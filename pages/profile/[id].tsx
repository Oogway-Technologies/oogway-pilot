// Firebase imports
import firebase from 'firebase/compat'
import {
    collection,
    doc,
    getDoc,
    orderBy,
    query,
    where,
} from 'firebase/firestore'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import React, { FC } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useRecoilValue } from 'recoil'

import { userProfileState } from '../../atoms/user'
import PostCard from '../../components/Feed/Post/Post'
import { ProfileCard } from '../../components/Profile/ProfileCard'
import { db } from '../../firebase'
import { profilePage } from '../../styles/profile'
import { FirebasePost, FirebaseProfile } from '../../utils/types/firebase'

import DocumentData = firebase.firestore.DocumentData

interface ProfileProps {
    userProfile: FirebaseProfile
    posts: FirebasePost[]
}

const Profile: FC<ProfileProps> = ({ userProfile, posts }) => {
    const { bio, profilePic, uid, username, lastName, location } = userProfile

    const authUserProfile = useRecoilValue(userProfileState)
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
                {/* profile card of the user*/}
                <ProfileCard
                    bio={bio}
                    location={location}
                    // name={name}
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
                        ? realtimePosts?.docs
                              .filter(post => {
                                  return (
                                      post.data().isAnonymous != true ||
                                      post.data().uid == authUserProfile.uid
                                  )
                              })
                              .map(post => (
                                  <PostCard
                                      key={post.id}
                                      id={post.id}
                                      authorUid={post.data().uid}
                                      name={post.data().name}
                                      message={post.data().message}
                                      description={post.data().description}
                                      feed={post.data().feed}
                                      isCompare={post.data().isCompare}
                                      timestamp={post.data().timestamp}
                                      postImage={post.data().postImage}
                                      comments={null}
                                      isCommentThread={false}
                                      previewImage={
                                          post.data().previewImage || ''
                                      }
                                      isAnonymous={post.data().isAnonymous}
                                  />
                              ))
                        : // Render out the server-side rendered posts
                          posts
                              .filter(function (post: FirebasePost) {
                                  return (
                                      post.isAnonymous != true ||
                                      post.uid == authUserProfile.uid
                                  )
                              })
                              .map(post => (
                                  <PostCard
                                      key={post.id}
                                      id={post.id || ''}
                                      authorUid={post.uid}
                                      name={post.name}
                                      message={post.message}
                                      description={post.description}
                                      isCompare={post.isCompare}
                                      timestamp={post.timestamp}
                                      postImage={post.postImage}
                                      comments={null}
                                      isCommentThread={false}
                                      previewImage={post.previewImage || ''}
                                      isAnonymous={post.isAnonymous}
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
    context: GetServerSidePropsContext<
        ParsedUrlQuery,
        string | false | object | undefined
    >
) => {
    // Get userProfile of selected user from database.
    const userProfile: DocumentData | undefined = (
        await getDoc(doc(db, 'profiles', (context?.query?.id as string) || ''))
    ).data()

    // Get the posts
    const postsRef = await db
        .collection('posts')
        .where('uid', '==', context?.query?.id as string)
        .orderBy('timestamp', 'desc')
        .get()

    const posts = postsRef.docs.map(post => ({
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
