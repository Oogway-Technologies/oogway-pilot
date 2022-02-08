import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { auth, db, storage } from '../../firebase'
import useUserProfile from '../../hooks/useUserProfile'
import { createUserProfile } from '../../lib/db'
import {
    loginButtons,
    loginDivs,
    loginImages,
    loginInputs,
} from '../../styles/login'
import Button from '../Utils/Button'
import { Avatar, useMediaQuery } from '@mui/material'
import {
    UilUserCircle,
    UilImagePlus,
    UilTrashAlt,
} from '@iconscout/react-unicons'
import preventDefaultOnEnter from '../../hooks/preventDefaultOnEnter'
import { useAuthState } from 'react-firebase-hooks/auth'

type UserProfileFormProps = {
    closeModal: () => void
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ closeModal }) => {
    // User state
    const [user] = useAuthState(auth)
    const [userProfile, setUserProfile] = useUserProfile(user.uid)

    // Picture statee
    const [imageToUpload, setImageToUpload] = useState(null)
    const [targetEvent, setTargetEvent] = useState(null)

    // Form refs
    const nameRef = useRef(null)
    const lastNameRef = useRef(null)
    const locationRef = useRef(null)
    const profilePicRef = useRef(null)
    const bioRef = useRef(null)
    const usernameRef = useRef(null)

    // Router
    const router = useRouter()

    // Handler functions
    const toggleDM = () => {
        setUserProfile({
            ...userProfile,
            dm: !userProfile.dm,
        })
    }

    // Database Hook functions
    const saveAndContinue = (e) => {
        e.preventDefault()

        // Upload profile pic
        if (imageToUpload) {
            // Push to storage
            const uploadTask = storage
                .ref(`profiles/${userProfile.uid}`)
                .putString(imageToUpload, 'data_url')

            // Remove image preview
            handleRemoveImage()

            // When the state changes, add the url to profile
            uploadTask.on(
                'state_change',
                null,
                (error) => console.error(error),
                () => {
                    // When the upload comples
                    storage
                        .ref('profiles')
                        .child(userProfile.uid)
                        .getDownloadURL()
                        .then((url) => {
                            // Add the url to the user Profile
                            setUserProfile({
                                ...userProfile,
                                profilePic: url,
                            })
                        })
                }
            )
        }

        // Update profile state according to refs and continue
        createUserProfile(userProfile.uid, userProfile) // Worked fine on SignUpForm but won't update now

        // Update user
        db.collection('users')
            .doc(userProfile.uid)
            .get()
            .then((doc) => {
                let tmp = doc.data()
                tmp.name =
                    userProfile.name +
                    (userProfile.name && userProfile.lastName
                        ? ' '
                        : '' + userProfile.lastName)
                tmp.username = userProfile.username
                tmp.photoUrl = userProfile.profilePic
                doc.ref.update(tmp)
            })

        // TODO: We should also be updating the auth user profile
        // user.updateProfile({ ...}).then(())

        // Close Modal
        closeModal()
    }

    const cancelAndContinue = (e) => {
        e.preventDefault()

        // Set the profile so that it doesn't need reset
        db.collection('profiles')
            .doc(userProfile.uid)
            .get()
            .then((doc) => {
                let tmp = doc.data()
                tmp.resetProfile = false
                doc.ref.update(tmp)

                // Close modal
                closeModal()

                // After update push the router to the feed
                router.push(`/feed/${userProfile.uid}`)
            })
    }

    const addImageToUpload = (e) => {
        const reader = new FileReader()
        if (e.target.files[0]) {
            // Read the file
            reader.readAsDataURL(e.target.files[0])
        }

        // Reader is async, so use onload to attach a function
        // to set the loaded image from the reader
        reader.onload = (readerEvent) => {
            setImageToUpload(readerEvent.target.result)
            if (targetEvent) {
                // Reset the event state so the user can reload
                // the same image twice
                targetEvent.target.value = ''
            }
        }
    }

    const handleImageUpload = (e) => {
        // Store the event to reset its state later
        // and allow the user to load the same image twice
        // if needed
        setTargetEvent(e)
        addImageToUpload(e)
    }

    const handleRemoveImage = () => {
        setImageToUpload(null)

        if (targetEvent) {
            // Reset the event state so the user can reload
            // the same image twice
            targetEvent.target.value = ''
        }
    }

    const sizeAvatar = () => {
        const isMobile = useMediaQuery('(max-width: 1024px)')
        let size
        if (isMobile) {
            size = 75
        } else {
            size = 150
        }
        return { width: size, height: size }
    }

    return (
        <div>
            <Head>
                <title>Profile Settings</title>
            </Head>

            <div className={loginDivs.signIn}>
                {/* Header */}
                <div className={loginDivs.modalHeader}>Setup Profile</div>
                <div>Complete your profile below.</div>

                {/* Upload Image */}
                <div className={loginInputs.inputHeader}>Profile Picture</div>
                <div className={loginDivs.sideBySide}>
                    <Avatar
                        className={loginImages.avatar}
                        sx={sizeAvatar}
                        src={imageToUpload}
                    />

                    <div className={loginDivs.upload}>
                        <button
                            className={loginButtons.uploadImage}
                            onClick={() => profilePicRef.current.click()}
                        >
                            <UilImagePlus />
                            <span>Upload Image</span>
                            <input
                                ref={profilePicRef}
                                onChange={handleImageUpload}
                                type="file"
                                onKeyPress={preventDefaultOnEnter}
                                hidden
                            />
                        </button>
                        <button
                            className={
                                loginButtons.removeImage +
                                `${
                                    imageToUpload
                                        ? ' text-black dark:text-white'
                                        : ' text-neutral-100 dark:text-neutralDark-300'
                                }`
                            }
                            disabled={!imageToUpload}
                            onClick={handleRemoveImage}
                        >
                            <UilTrashAlt />
                            <span>Remove Image</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* User Profile Form */}
            <form className={loginDivs.signIn}>
                <div className={loginInputs.inputHeader}>Name</div>
                <div className={loginDivs.sideBySide}>
                    <div className="flex-col">
                        <div className={loginInputs.inputBorder}>
                            <input
                                ref={nameRef}
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
                                ref={lastNameRef}
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
                        ref={usernameRef}
                        defaultValue={userProfile.username || ''}
                        className={loginInputs.inputField}
                        placeholder={userProfile.username}
                        type="text"
                    />
                </div>

                <div className={loginInputs.inputHeader}>Location</div>
                <div className={loginInputs.inputBorder}>
                    <input
                        ref={locationRef}
                        defaultValue={userProfile.location || ''}
                        className={loginInputs.inputField}
                        placeholder="Country"
                        type="text"
                    />
                </div>

                <div className={loginInputs.inputHeader}>Bio</div>
                <div className={loginInputs.inputBorder}>
                    <input
                        ref={bioRef}
                        defaultValue={userProfile.bio || ''}
                        className={loginInputs.inputField}
                        placeholder="About me..."
                        type="text"
                    />
                </div>

                <div className={loginDivs.checkbox}>
                    <input
                        type="checkbox"
                        className={loginButtons.checkbox}
                        checked={userProfile.dm || false}
                        onChange={toggleDM}
                    />
                    <div>Allow other users to send me a Direct Message</div>
                </div>
            </form>

            {/* Form buttons */}
            <div className={loginDivs.customSignIn}>
                <Button
                    onClick={cancelAndContinue}
                    addStyle={loginButtons.cancelButtonStyle}
                    text="Skip"
                    keepText={true}
                    forceNoText={false}
                    icon={null}
                    type="button"
                />
                <Button
                    onClick={saveAndContinue}
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
