import React, {FC} from 'react'
import {ParsedUrlQuery} from 'querystring'
import {FirebaseProfile} from '../../utils/types/firebase'
import {profilePage} from '../../styles/profile'
import {GetServerSideProps, GetServerSidePropsContext} from 'next'

import {ProfileCard} from '../../components/Profile/ProfileCard'
// Firebase imports
import firebase from 'firebase/compat'
import {collection, doc, getDoc, orderBy, query, where} from 'firebase/firestore'
import {db} from '../../firebase'
import {useCollection} from 'react-firebase-hooks/firestore'
import PostCard from '../../components/Feed/Post/Post'
import DocumentData = firebase.firestore.DocumentData;

interface ProfileProps {
    userProfile: FirebaseProfile
}

const Profile: FC<ProfileProps> = ({userProfile, posts}) => {
    const {
        bio,
        profilePic,
        resetProfile,
        uid,
        username,
        name,
        lastName,
        dm,
        location,
    } = userProfile

    // Get real-time connection with DB
    const [realtimePosts] = useCollection(
        query(
            collection(db, 'posts'),
            where('uid', '==', uid),
            orderBy('timestamp', 'desc')
        )
    )

    return (
        <div className={profilePage.innerDiv}>
            <div className={profilePage.contentDiv}>
                {/*profile card of the user*/}
                <ProfileCard
                    bio={bio}
                    location={location}
                    name={name}
                    lastName={lastName}
                    profilePic={profilePic}
                    username={username}
                    uid={uid}
                    joinedAt={''}
                />
                {/* TODO: profile engagement bar when design and logic are ready */}
                {/*
                    {currentUserUid !== uid && <ProfileEngagementBar expanded={true}/>}
                */}
                <>
                    {realtimePosts
                        ? realtimePosts?.docs.map((post) => (
                            <PostCard
                                key={post.id}
                                id={post.id}
                                authorUid={post.data().uid}
                                name={post.data().name}
                                message={post.data().message}
                                description={post.data().description}
                                isCompare={post.data().isCompare}
                                email={post.data().email}
                                timestamp={post.data().timestamp}
                                postImage={post.data().postImage}
                                comments={null}
                                isCommentThread={false}
                            />
                        ))
                        : // Render out the server-side rendered posts
                        posts.map((post) => (
                            <PostCard
                                key={post.id}
                                id={post.id}
                                authorUid={post.uid}
                                name={post.name}
                                message={post.message}
                                description={post.description}
                                isCompare={post.isCompare}
                                email={post.email}
                                timestamp={post.timestamp}
                                postImage={post.postImage}
                                comments={null}
                                isCommentThread={false}
                            />
                        ))}
                </>
            </div>
        </div>
    )
}

export default Profile

// Implement server side rendering for userProfile and posts
export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext<ParsedUrlQuery,
        string | false | object | undefined>
) => {
    //Get userProfile of selected user from database.
    const userProfile: DocumentData | undefined = (
        await getDoc(doc(db, 'profiles', (context?.query?.id as string) || ''))
    ).data()

    // Get the posts
    const postsRef = await db
        .collection('posts')
        .where('uid', '==', context?.query?.id as string)
        .orderBy('timestamp', 'desc')
        .get()

    const posts = postsRef.docs.map((post) => ({
        id: post.id,
        ...post.data(),
        timestamp: null, // DO NOT prefetch timestamp
    }))

    // Note: after fetching the posts, we need to stringify the Timestamp objects.
    return {
        props: {
            posts,
            userProfile, // pass the userProfile back to the front-end
        },
    }
}
