import { UilLocationPoint, UilPen } from '@iconscout/react-unicons'
import { Avatar, useMediaQuery } from '@mui/material'
import React, { FC, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { userProfileState } from '../../atoms/user'
import { useProfileData } from '../../hooks/useProfileData'
import { profileCard } from '../../styles/profile'
import NewPostForm from '../Feed/Forms/NewPostForm'
import UserProfileForm from '../Login/UserProfileForm'
import bull from '../Utils/Bullet'
import Button from '../Utils/Button'
import Modal from '../Utils/Modal'

interface ProfileCardProps {
    bio?: string
    location?: string
    name?: string
    lastName?: string
    profilePic: string
    username?: string
    uid?: string
    joinedAt?: string
}

export const ProfileCard: FC<ProfileCardProps> = props => {
    const {
        bio,
        location,
        name,
        lastName,
        profilePic,
        username,
        uid,
        joinedAt,
    } = props
    // recoil state to check if Profile card is for current user.
    const { uid: currentUserUid } = useRecoilValue(userProfileState)
    const [userProfileSnapshot] = useProfileData(uid as string)

    // hook to check is user is no mobile device or not.
    const isMobile = useMediaQuery('(max-width: 965px)')

    // Profile Form Modal
    const [showProfileForm, setShowProfileForm] = useState(false)
    const openProfileModal = () => {
        setShowProfileForm(true)
    }
    const closeProfileModal = () => {
        setShowProfileForm(false)
    }

    // Modal helper functions
    const [showNewPostForm, setShowNewPostForm] = useState(false)
    const openPostModal = () => {
        setShowNewPostForm(true)
    }

    const closePostModal = () => {
        setShowNewPostForm(false)
    }

    const sizeAvatar = () => {
        if (isMobile) return { height: 75, width: 75 }
        return { height: 150, width: 150 }
    }

    return (
        <>
            <div className={'flex flex-col items-center mx-sm sm:mx-0'}>
                <div className={profileCard.mainDiv}>
                    {/* profile image*/}
                    <Avatar
                        sx={sizeAvatar}
                        src={userProfileSnapshot?.profilePic || profilePic}
                        alt={username}
                    />
                    {/* container for user details*/}
                    <div className={profileCard.userDetailsDiv}>
                        {/* User profile name and buttons list*/}
                        <div className={'flex items-center mb-1'}>
                            <div className={profileCard.userProfileName}>
                                {userProfileSnapshot?.name || name}{' '}
                                {userProfileSnapshot?.lastName || lastName}
                            </div>

                            <div
                                className={
                                    'flex justify-self-end items-center space-x-2'
                                }
                            >
                                {uid !== currentUserUid ? (
                                    <>
                                        {/* TODO: uncomment FOLLOW button when its done. */}
                                        {/* <Button*/}
                                        {/*    onClick={() => {*/}
                                        {/*        alert('TODO: Follow')*/}
                                        {/*    }}*/}
                                        {/*    text={'Follow'}*/}
                                        {/*    keepText={true}*/}
                                        {/*    addStyle={profileCard.newPostButton}*/}
                                        {/* />*/}
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            onClick={openProfileModal}
                                            text={'Edit Profile'}
                                            type={'button'}
                                            addStyle={profileCard.editButton}
                                            keepText={true}
                                        />
                                        {!isMobile && (
                                            <Button
                                                onClick={openPostModal}
                                                icon={
                                                    <UilPen
                                                        className={
                                                            'mr-1 w-5 h-5'
                                                        }
                                                    />
                                                }
                                                text={'New Post'}
                                                addStyle={
                                                    profileCard.newPostButton
                                                }
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {/* username*/}
                        {username && (
                            <span className={profileCard.usernameText}>
                                {userProfileSnapshot?.username || username}
                            </span>
                        )}
                        {/* location and date of joining*/}
                        {(joinedAt || location) && (
                            <span className={profileCard.joinedAndLocationText}>
                                {joinedAt && (
                                    <>
                                        Joined {joinedAt}
                                        {bull}
                                    </>
                                )}
                                {location && (
                                    <>
                                        <UilLocationPoint
                                            className={'mr-2 w-6 h-6'}
                                        />{' '}
                                        {userProfileSnapshot?.location ||
                                            location}
                                    </>
                                )}
                            </span>
                        )}
                        {/* user bio if not on mobile device*/}
                        {bio && !isMobile && (
                            <span className={profileCard.bioText}>
                                {userProfileSnapshot?.bio || bio}
                            </span>
                        )}
                    </div>
                </div>
                {/* user bio if on mobile device.*/}
                {bio && isMobile && (
                    <span className={profileCard.bioText}>
                        {userProfileSnapshot?.bio || bio}
                    </span>
                )}
                <Modal show={showProfileForm} onClose={closeProfileModal}>
                    <UserProfileForm
                        closeModal={closeProfileModal}
                        cancelButtonText="Cancel"
                        headerText="Edit Profile"
                    />
                </Modal>
            </div>
            <Modal show={showNewPostForm} onClose={closePostModal}>
                <NewPostForm closeModal={closePostModal} />
            </Modal>
        </>
    )
}
