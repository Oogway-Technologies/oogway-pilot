import React, {FC} from 'react'
import {ParsedUrlQuery} from "querystring";
import {FirebaseProfile} from "../../utils/types/firebase";
import {profilePage,} from "../../styles/profile";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import firebase from "firebase/compat";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {ProfileCard} from "../../components/Profile/ProfileCard";
import ProfileEngagementBar from "../../components/Profile/ProfileEngagementBar";
import {useRecoilValue} from "recoil";
import {userProfileState} from "../../atoms/user";
import DocumentData = firebase.firestore.DocumentData;

import { useCollection } from "react-firebase-hooks/firestore";
import PostCard from "../../components/Feed/Post/Post";

import {
    addDoc,
    collection,
    serverTimestamp,
    updateDoc,
    where,
    query,
  } from 'firebase/firestore'

interface ProfileProps {
    userProfile: FirebaseProfile
}

const Profile: FC<ProfileProps> = ({userProfile}) => {
    const {bio, profilePic, resetProfile, uid, username, name, lastName, dm, location} = userProfile;
    // recoil state to check if Profile card is for current user.
    const {uid: currentUserUid} = useRecoilValue(userProfileState);

    // Get real-time connection with DB
    const [realtimePosts] = useCollection(
        query(collection(db, "posts"), where("uid", "==", uid))
    );

    return (
        <div className={profilePage.innerDiv}>
            <div className={profilePage.contentDiv}>
                {/*profile card of the user*/}
                <ProfileCard
                    bio={bio}
                    location={location}
                    name={name}
                    profilePic={profilePic}
                    username={username}
                    uid={uid}
                    joinedAt={''}
                />
                {/* TODO: profile engagement bar when design and logic are ready */}
                {/*
                    {currentUserUid !== uid && <ProfileEngagementBar expanded={true}/>}
                */}
                {realtimePosts?.docs.map((post) => (
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
                        />))
                }
            </div>
        </div>
    )
}

export default Profile

// Implement server side rendering for userProfile and posts
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<ParsedUrlQuery, string | false | object | undefined>) => {
    //Get userProfile of selected user from database.
    const userProfile: DocumentData | undefined = (await getDoc(doc(db, "profiles", context?.query?.id as string || ''))).data();

    // Get the posts
    // TODO: Get the posts from the database AFTER we implement an index on Firebase.
    // If we don't have an index, Firebase complains that the query is too complex.
    // This is because it needs to run the where and the orderBy.
    //
    // Message from firebase:
    // error - FirebaseError: [code=failed-precondition]: The query requires an index.
    // You can create it here:
    // https://console.firebase.google.com/v1/r/project/oogway-pilot/firestore/indexes?create_composite=Ckpwcm9qZWN0cy9vb2d3YXktcGlsb3QvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Bvc3RzL2luZGV4ZXMvXxABGgcKA3VpZBABGg0KCXRpbWVzdGFtcBACGgwKCF9fbmFtZV9fEAI
    //const posts = await db
    //    .collection('posts')
    //    .where('uid', '==', context?.query?.id as string)
    //    .orderBy('timestamp', 'desc')
    //    .get()
    //
    // Note: after fetching the posts, we need to stringify the Timestamp objects.
    return {
        props: {
            userProfile, // pass the userProfile back to the front-end
        },
    }
}
