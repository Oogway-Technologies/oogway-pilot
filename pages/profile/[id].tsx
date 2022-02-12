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

interface ProfileProps {
    userProfile: FirebaseProfile
}

const Profile: FC<ProfileProps> = ({userProfile}) => {
    const {bio, profilePic, resetProfile, uid, username, name, lastName, dm, location} = userProfile;
    // recoil state to check if Profile card is for current user.
    const {uid: currentUserUid} = useRecoilValue(userProfileState);

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

                {currentUserUid !== uid && <ProfileEngagementBar expanded={true}/>}
            </div>
        </div>
    )
}

export default Profile

// Implement server side rendering for userProfile
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<ParsedUrlQuery, string | false | object | undefined>) => {
    //get userProfile of selected user from database.
    const userProfile: DocumentData | undefined = (await getDoc(doc(db, "profiles", context?.query?.id as string || ''))).data();
    return {
        props: {
            userProfile, // pass the userProfile back to the front-end
        },
    }
}
