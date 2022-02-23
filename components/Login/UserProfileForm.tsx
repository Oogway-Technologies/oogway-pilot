import Head from 'next/head'
import {useRouter} from 'next/router'
import React, {FC, useRef, useState} from 'react'
import {db, storage} from '../../firebase'
import {loginButtons, loginDivs, loginImages, loginInputs,} from '../../styles/login'
import Button from '../Utils/Button'
import {Avatar, useMediaQuery} from '@mui/material'
//@ts-ignore
import {UilImagePlus, UilTrashAlt} from '@iconscout/react-unicons'
import preventDefaultOnEnter from '../../utils/helpers/preventDefaultOnEnter'

// Firebase
import {doc, updateDoc} from 'firebase/firestore'
import {getDownloadURL, ref, uploadString} from '@firebase/storage'
import {userProfileState} from '../../atoms/user'
import {useRecoilState} from 'recoil'
import {getProfileDoc} from '../../lib/profileHelper'
import {checkFileSize} from "../../utils/helpers/common";
import FlashErrorMessage from "../Utils/FlashErrorMessage";
import {warningTime} from "../../utils/constants/global";
import Modal from "../Utils/Modal";
import TermsConditions from "./TermsConditions";
import PrivacyPolicy from "./PrivacyPolicy";

type UserProfileFormProps = {
    closeModal: () => void
}

const UserProfileForm: FC<UserProfileFormProps> = ({closeModal}) => {
    // Get current user profile
    const [userProfile, setUserProfile] = useRecoilState(userProfileState)

    // Form state
    const [dm, setDm] = useState(userProfile.dm || false)
    const [username, setUsername] = useState(userProfile.username || '')
    const [name, setName] = useState(userProfile.name || '')
    const [last, setLast] = useState(userProfile.lastName || '')
    const [location, setLocation] = useState(userProfile.location || '')
    const [bio, setBio] = useState(userProfile.bio || '')
    const [profilePic] = useState(userProfile.profilePic || '')
    const [termAndConditions, setTermAndConditions] = useState(userProfile.termAndConditions || false)


    // Picture state
    const profilePicRef = useRef<HTMLInputElement>(null)
    const [imageToUpload, setImageToUpload] = useState(null)
    const [targetEvent, setTargetEvent] = useState(null)
    const [isImageSizeLarge, setIsImageSizeLarge] = useState(false);

    //modals
    const [termsPopUp, setTermsPopUp] = useState<boolean>(false)
    const [privacyPolicyPopUp, setPrivacyPolicyPopUp] = useState<boolean>(false)


    // Router
    const router = useRouter()

    // Handler functions
    const toggleDM = () => {
        setDm(!dm)
    }

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
            profilePic: profilePic,
            dm: dm,
            termAndConditions: termAndConditions
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
            await uploadString(imageRef, imageToUpload, 'data_url').then(
                async () => {
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
                }
            )

            handleRemoveImage()
        }

        // Close Modal
        closeModal()
    }

    const cancelAndContinue = async (e) => {
        e.preventDefault()

        // Set the profile so that it doesn't need reset
        const profileDoc = getProfileDoc(userProfile.uid)
        await profileDoc
            .then(async (doc) => {
                if (doc?.exists()) {
                    // If profile needs reseting mark as reset
                    // i.e. upon registration
                    if (doc.data().resetProfile) {
                        let tmp = doc.data()
                        tmp.resetProfile = false
                        await updateDoc(doc?.ref, tmp)
                    }
                    // Else return early
                    return
                } else {
                    console.log('Error: userProfile.resetProfile not updated')
                }
            })
            .catch((err) => {
                console.log(err)
            })

        // Close modal
        closeModal()
    }

    const addImageToUpload = (e) => {
        const reader = new FileReader()
        if (e.target.files[0]) {
            // Read the file
            reader.readAsDataURL(e.target.files[0])
        }

        // Reader is async, so use onload to attach a function
        // to set the loaded image from the reader
        reader.onload = (readEvent) => {
            setImageToUpload(readEvent.target.result)
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

        if (checkFileSize(e.target.files)) {
            setTargetEvent(e)
            addImageToUpload(e)
        } else {
            setIsImageSizeLarge(true)
        }
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
        return {width: size, height: size}
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
                        src={
                            imageToUpload
                                ? imageToUpload
                                : userProfile.profilePic
                        }
                    />

                    <div className={loginDivs.upload}>
                        <button
                            className={loginButtons.uploadImage}
                            onClick={() => profilePicRef?.current?.click()}
                        >
                            <UilImagePlus/>
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
                                    imageToUpload
                                        ? ' text-black dark:text-white'
                                        : ' text-neutral-100 dark:text-neutralDark-300'
                                }`
                            }
                            disabled={!imageToUpload}
                            onClick={handleRemoveImage}
                        >
                            <UilTrashAlt/>
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
                                onChange={(e) => {
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
                                onChange={(e) => {
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
                        onChange={(e) => {
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
                        onChange={(e) => {
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
                        onChange={(e) => {
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
                <div className={loginDivs.checkbox}>
                    <input
                        type="checkbox"
                        className={loginButtons.checkbox}
                        checked={termAndConditions}
                        onChange={() => setTermAndConditions(!termAndConditions)}
                        onKeyPress={preventDefaultOnEnter}
                    />
                    <div className={'flex items-center'}>I agree to the <span
                        className={'text-primary hover:underline-offset-4 mx-2 cursor-pointer'}
                        onClick={() => setTermsPopUp(true)}>Teams and conditions</span>and <span
                        className={'text-primary hover:underline-offset-4 mx-2 cursor-pointer'}
                        onClick={() => setPrivacyPolicyPopUp(true)}>privacy policy's</span>
                    </div>
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
                    onClick={uploadProfileAndContinue}
                    addStyle={loginButtons.loginButtonStyle}
                    text="Save"
                    keepText={true}
                    forceNoText={false}
                    icon={null}
                    type="submit"
                />
            </div>
            <Modal
                children={<TermsConditions/>}
                show={termsPopUp}
                onClose={() => setTermsPopUp(false)}
                closeIcon={true}
            />
            <Modal
                children={<PrivacyPolicy/>}
                show={privacyPolicyPopUp}
                onClose={() => setPrivacyPolicyPopUp(false)}
                closeIcon={true}
            />
        </div>
    )
}

export default UserProfileForm
