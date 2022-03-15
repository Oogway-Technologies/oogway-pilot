import { useUser } from '@auth0/nextjs-auth0'
import { getDownloadURL, ref, uploadString } from '@firebase/storage'
import { UilImagePlus, UilTrashAlt } from '@iconscout/react-unicons'
import { useMediaQuery } from '@mui/material'
// Firebase
import { deleteField, doc, updateDoc } from 'firebase/firestore'
import Head from 'next/head'
import React, { ChangeEvent, FC, MouseEvent, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'

import { userProfileState } from '../../atoms/user'
import API from '../../axios'
import { db, storage } from '../../firebase'
import { getProfileDoc } from '../../lib/profileHelper'
import { deleteMedia } from '../../lib/storageHelper'
import {
    loginButtons,
    loginDivs,
    loginImages,
    loginInputs,
} from '../../styles/login'
import { warningTime } from '../../utils/constants/global'
import { checkFileSize } from '../../utils/helpers/common'
import preventDefaultOnEnter from '../../utils/helpers/preventDefaultOnEnter'
import Button from '../Utils/Button'
import { Avatar } from '../Utils/common/Avatar'
import FlashErrorMessage from '../Utils/FlashErrorMessage'

type UserProfileFormProps = {
    headerText: string
    cancelButtonText: string
    closeModal: () => void
}

const UserProfileForm: FC<UserProfileFormProps> = ({
    closeModal,
    headerText = 'Edit Profile',
    cancelButtonText = 'Cancel',
}) => {
    // Get current user profile
    const { user, isLoading } = useUser()
    const [userProfile, setUserProfile] = useRecoilState(userProfileState)

    // Form state
    const [dm] = useState(userProfile.dm || false)
    const [username, setUsername] = useState(userProfile.username || '')
    const [name, setName] = useState(userProfile.name || '')
    const [last, setLast] = useState(userProfile.lastName || '')
    const [location, setLocation] = useState(userProfile.location || '')
    const [bio, setBio] = useState(userProfile.bio || '')

    // Picture state
    const profilePicRef = useRef<HTMLInputElement>(null)
    const [imageToUpload, setImageToUpload] = useState<
        string | ArrayBuffer | null | undefined
    >(null)
    const [targetEvent, setTargetEvent] =
        useState<ChangeEvent<HTMLInputElement>>()
    const [isImageSizeLarge, setIsImageSizeLarge] = useState<boolean>(false)

    // // Router
    // const router = useRouter()

    // // Handler functions
    // const toggleDM = () => {
    //     setDm(!dm)
    // }

    // Database Hook functions
    const uploadProfileAndContinue = async () => {
        // Using Firebase v9+ which is nice and modular.
        // Update original profile with new information
        const updatedUserProfile = {
            username: username,
            name: name,
            lastName: last,
            bio: bio,
            location: location,
            resetProfile: false,
            dm: dm,
        }
        // Update recoil state
        setUserProfile({
            ...userProfile, // First old data
            ...updatedUserProfile, // Then add and update with new data
        })
        // Update profile in DB
        await updateDoc(
            doc(db, 'profiles', userProfile.uid),
            updatedUserProfile
        )

        // Upload the profile image in Firebase storage.
        // Note: path to image is profiles/<profile_id>/image
        if (imageToUpload) {
            const imageRef = ref(storage, `profiles/${userProfile.uid}/image`)
            try {
                await uploadString(
                    imageRef,
                    imageToUpload as string,
                    'data_url'
                )

                // Get the download URL for the image
                const downloadURL = await getDownloadURL(imageRef)
                // Update the original profile with the image url
                await updateDoc(doc(db, 'profiles', userProfile.uid), {
                    profilePic: downloadURL,
                })
                // Update the user's data as well
                await updateDoc(doc(db, 'users', userProfile.uid), {
                    name: name.trim(),
                    username: username,
                    photoUrl: downloadURL,
                })
                // Update atom
                setUserProfile({
                    ...userProfile,
                    profilePic: downloadURL,
                })
            } catch (e) {
                console.log(e)
            }
            setImageToUpload(null)

            if (targetEvent) {
                // Reset the event state so the user can reload
                // the same image twice
                targetEvent.target.value = ''
            }
        }

        // Close Modal
        closeModal()
    }

    const cancelAndContinue = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        // Set the profile so that it doesn't need reset
        const profileDoc = getProfileDoc(userProfile.uid)
        await profileDoc
            .then(async doc => {
                if (doc?.exists()) {
                    // If profile needs reseting mark as reset
                    // i.e. upon registration
                    if (doc.data().resetProfile) {
                        const tmp = doc.data()
                        tmp.resetProfile = false
                        await updateDoc(doc?.ref, tmp)
                    }
                    // Else return early
                    return
                } else {
                    console.log('Error: userProfile.resetProfile not updated')
                }
            })
            .catch(err => {
                console.log(err)
            })

        // Close modal
        closeModal()
    }

    const addImageToUpload = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const reader = new FileReader()
        const { target } = e
        if (!target) {
            return
        }
        // Extract file if it exists and read it
        const file = (target?.files && target?.files[0]) ?? null
        if (file) {
            reader.readAsDataURL(file)
        }
        // Reader is async, so use onload to attach a function
        // to set the loaded image from the reader
        reader.onload = readEvent => {
            setImageToUpload(readEvent?.target?.result)
            if (targetEvent) {
                // Reset the event state so the user can reload
                // the same image twice
                targetEvent.target.value = ''
            }
        }
    }

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed

        if (checkFileSize(e.target.files)) {
            setTargetEvent(e)
            addImageToUpload(e)
        } else {
            setIsImageSizeLarge(true)
        }
    }

    const deleteProfilePic = async () => {
        try {
            // Remove from storage
            deleteMedia(`profiles/${userProfile.uid}/image`)

            // Remove from user doc
            await updateDoc(doc(db, 'users', userProfile.uid), {
                photoUrl: deleteField(),
            })

            // Remove from profile doc
            await updateDoc(doc(db, 'profiles', userProfile.uid), {
                profilePic: '',
            })
            setUserProfile({ ...userProfile, profilePic: '' })
        } catch (e) {
            console.log(e)
        }
    }

    const handleRemoveImage = async () => {
        // Delete user image if there is not a staged image for upload
        // and profile pic exists
        if (userProfile.profilePic) {
            // Update user profile atom
            setUserProfile({
                ...userProfile,
                profilePic: '',
            })

            // Update auth0 user object
            if (!isLoading && user) {
                // We cannot use empty value in the picture, so we have to set a default image when we want to delete the image.
                const userMetadata = {
                    // TODO: Change image link to our own personal drive link from where the image can never be removed.
                    picture:
                        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
                }
                await API.patch('auth/updateUser', userMetadata)
                // Delete from back-end
                await deleteProfilePic()
            }
        }
        // Otherwise just remove staged image
        if (imageToUpload) {
            setImageToUpload(null)
        }

        if (targetEvent) {
            // Reset the event state so the user can reload
            // the same image twice
            targetEvent.target.value = ''
        }
    }

    const sizeAvatar = () => {
        const isMobile = useMediaQuery('(max-width: 1024px)')

        if (isMobile) return true
        return false
    }

    return (
        <div>
            <Head>
                <title>Profile Settings</title>
            </Head>

            <div className={loginDivs.signIn}>
                {/* Header */}
                <div className={loginDivs.modalHeader}>{headerText}</div>
                <div className={loginDivs.modalSubheader}>
                    Complete your profile below.
                </div>

                {/* Upload Image */}
                <div className={loginInputs.inputHeader}>Profile Picture</div>
                <div className={loginDivs.sideBySide}>
                    <Avatar
                        className={
                            sizeAvatar()
                                ? 'h-[75px] w-[75px]'
                                : 'h-[150px] w-[150px]'
                        }
                        isHoverEffect={false}
                        src={
                            imageToUpload
                                ? (imageToUpload as string)
                                : userProfile?.profilePic
                        }
                    />

                    <div className={loginDivs.upload}>
                        <button
                            className={loginButtons.uploadImage}
                            onClick={() => profilePicRef?.current?.click()}
                        >
                            <UilImagePlus />
                            <span>Upload Image</span>
                            <input
                                ref={profilePicRef}
                                onChange={handleImageUpload}
                                type="file"
                                onKeyPress={preventDefaultOnEnter}
                                hidden
                                accept="image/*"
                            />
                        </button>
                        <button
                            className={
                                loginButtons.removeImage +
                                `${
                                    imageToUpload ||
                                    userProfile.profilePic.length > 0
                                        ? ' text-black dark:text-white'
                                        : ' text-neutral-100 dark:text-neutralDark-300'
                                }`
                            }
                            disabled={
                                !(
                                    imageToUpload ||
                                    userProfile.profilePic.length > 0
                                )
                            }
                            onClick={handleRemoveImage}
                        >
                            <UilTrashAlt />
                            <span>Remove Image</span>
                        </button>
                    </div>
                </div>
                {isImageSizeLarge && (
                    <FlashErrorMessage
                        message={`Image should be less then 10 MB`}
                        ms={warningTime}
                        style={loginImages.imageSizeAlert}
                        onClose={() => setIsImageSizeLarge(false)}
                    />
                )}
            </div>

            {/* User Profile Form */}
            <form className={loginDivs.signIn}>
                <div className={loginInputs.inputHeader}>Name</div>
                <div className={loginDivs.sideBySide}>
                    <div className="flex-col">
                        <div className={loginInputs.inputBorder}>
                            <input
                                onChange={e => {
                                    setName(e.target.value)
                                }}
                                onKeyPress={preventDefaultOnEnter}
                                defaultValue={userProfile.name || ''}
                                className={loginInputs.inputField}
                                placeholder="First name"
                                type="text"
                            />
                        </div>
                        {/* Warning message on email */}
                        {/* {errors.email && errors.email.type === 'required' && (
                            <FlashErrorMessage
                                message={errors.email.message}
                                ms={warningTime}
                                style={loginInputs.formAlert}
                                error="email"
                            />
                        )} */}
                    </div>
                    <div className="flex-col">
                        <div className={loginInputs.inputBorder}>
                            <input
                                onChange={e => {
                                    setLast(e.target.value)
                                }}
                                onKeyPress={preventDefaultOnEnter}
                                defaultValue={userProfile.lastName || ''}
                                className={loginInputs.inputField}
                                placeholder="Last name"
                                type="text"
                            />
                        </div>
                        {/* Warning message on email */}
                        {/* {errors.email && errors.email.type === 'required' && (
                            <FlashErrorMessage
                                message={errors.email.message}
                                ms={warningTime}
                                style={loginInputs.formAlert}
                                error="email"
                            />
                        )}                       */}
                    </div>
                </div>

                <div className={loginInputs.inputHeader}>Username</div>
                <div className={loginInputs.inputBorder}>
                    <input
                        onChange={e => {
                            setUsername(e.target.value)
                        }}
                        onKeyPress={preventDefaultOnEnter}
                        defaultValue={userProfile.username || ''}
                        className={loginInputs.inputField}
                        placeholder="a_cool_username"
                        type="text"
                    />
                </div>

                <div className={loginInputs.inputHeader}>Location</div>
                <div className={loginInputs.inputBorder}>
                    <input
                        onChange={e => {
                            setLocation(e.target.value)
                        }}
                        onKeyPress={preventDefaultOnEnter}
                        defaultValue={userProfile.location || ''}
                        className={loginInputs.inputField}
                        placeholder="Country"
                        type="text"
                    />
                </div>

                <div className={loginInputs.inputHeader}>Bio</div>
                <div className={loginInputs.inputBorder}>
                    <textarea
                        onChange={e => {
                            e.target.style.height = '0px'
                            e.target.style.height = e.target.scrollHeight + 'px'
                            setBio(e.target.value)
                        }}
                        defaultValue={userProfile.bio || ''}
                        className={loginInputs.textArea}
                        rows={1}
                        placeholder="About me..."
                    />
                </div>
                {/* TODO: Implement DM system */}
                {/*
                <div className={loginDivs.checkbox}>
                    <input
                        type="checkbox"
                        className={loginButtons.checkbox}
                        checked={dm}
                        onChange={toggleDM}
                        onKeyPress={preventDefaultOnEnter}
                    />
                    <div>Allow other users to send me a Direct Message</div>
                </div>
                */}
            </form>

            {/* Form buttons */}
            <div className={loginDivs.customSignIn}>
                <Button
                    onClick={cancelAndContinue}
                    addStyle={loginButtons.cancelButtonStyle}
                    text={cancelButtonText}
                    keepText={true}
                    forceNoText={false}
                    icon={null}
                    type="button"
                />
                <Button
                    onClick={uploadProfileAndContinue}
                    addStyle={loginButtons.loginButtonStyle}
                    text="Save"
                    keepText={true}
                    forceNoText={false}
                    icon={null}
                    type="submit"
                />
            </div>
        </div>
    )
}

export default UserProfileForm
