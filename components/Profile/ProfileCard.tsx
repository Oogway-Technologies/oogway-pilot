import Button from "../Utils/Button";
import {profileCard} from "../../styles/profile";
import bull from "../Utils/Bullet";
import React, {FC} from "react";
// @ts-ignore
import {UilLocationPoint, UilPen} from '@iconscout/react-unicons'
import {useRecoilValue} from "recoil";
import {userProfileState} from "../../atoms/user";
import {useMediaQuery} from "@mui/material";

interface ProfileCardProps {
    bio?: string;
    location?: string;
    name?: string;
    profilePic: string;
    username?: string;
    uid?: string;
    joinedAt?: string
}

export const ProfileCard: FC<ProfileCardProps> = (props) => {
    const {
        bio,
        location,
        name,
        profilePic,
        username,
        uid,
        joinedAt
    } = props;
    // recoil state to check if Profile card is for current user.
    const {uid: currentUserUid} = useRecoilValue(userProfileState);

    // hook to check is user is no mobile device or not.
    const isMobile = useMediaQuery('(max-width: 965px)')


    return <div className={'flex flex-col items-center'}>
        <div className={profileCard.mainDiv}>
            {/*profile image*/}
            <img className={profileCard.profileImg} alt={username}
                 src={profilePic}/>
            {/*container for user details*/}
            <div className={profileCard.userDetailsDiv}>
                {/*User profile name and buttons list*/}
                <div className={'flex items-center mb-1'}>
                            <span
                                className={profileCard.userProfileName}>{name}</span>
                    <div className={'flex items-center justify-self-end space-x-2'}>
                        {uid !== currentUserUid ? <>
                            <Button onClick={() => {
                                alert('TODO: Follow')
                            }} text={'Follow'} keepText={true} addStyle={profileCard.newPostButton}/>
                        </> : <>
                            <Button onClick={() => {
                                alert('TODO: Edit profile')
                            }} text={'Edit Profile'} type={'button'}
                                    addStyle={profileCard.editButton} keepText={true}
                            />
                            {!isMobile && <Button onClick={() => {
                                alert('TODO: Add new post')
                            }} icon={<UilPen className={'h-5 w-5 mr-1'}/>} text={'New Post'}
                                                  addStyle={profileCard.newPostButton}/>}</>}
                    </div>
                </div>
                {/*username*/}
                {username && <span className={profileCard.usernameText}>@{username}</span>}
                {/*location and date of joining*/}
                {(joinedAt || location) && <span className={profileCard.joinedAndLocationText}>
                           {joinedAt && <>Joined {joinedAt}{bull}</>}
                    {location && <><UilLocationPoint
                        className={'h-6 w-6 mr-2'}/> {location}
                    </>}
                    </span>}
                {/*user bio if not on mobile device*/}
                {bio && !isMobile && <span
                    className={profileCard.bioText}>{bio}</span>}
            </div>
        </div>
        {/*user bio if on mobile device.*/}
        {bio && isMobile && <span
            className={profileCard.bioText}>{bio}</span>}
    </div>

}
