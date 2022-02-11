import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { db, storage } from '../../firebase'
import {
    loginButtons,
    loginDivs,
    loginImages,
    loginInputs,
} from '../../styles/login'
import Button from '../Utils/Button'
import { Avatar, useMediaQuery } from '@mui/material'
import { UilImagePlus, UilTrashAlt } from '@iconscout/react-unicons'
import preventDefaultOnEnter from '../../hooks/preventDefaultOnEnter'

// Firebase
import { setDoc, updateDoc, doc } from 'firebase/firestore'
import { ref, getDownloadURL, uploadString } from '@firebase/storage'
import { userProfileState } from '../../atoms/user'
import { useRecoilState } from 'recoil'

type UserProfileFormProps = {
    profile: firebase.firestore.DocumentData
    closeModal: () => void
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
    profile,
    closeModal,
}) => {
    // Get current user profile
    const [userProfile, setUserProfile] = useRecoilState(userProfileState)

    // Form state
    const [dm, setDm] = useState(profile.allowDM || false)
    const [username, setUsername] = useState(profile.username || '')
    const [name, setName] = useState('')
    const [last, setLast] = useState('')
    const [location, setLocation] = useState('')
    const [bio, setBio] = useState('')
    const [profilePic, setProfilePic] = useState('')

    // Picture state
    const profilePicRef = useRef(null)
    const [imageToUpload, setImageToUpload] = useState(null)
    const [targetEvent, setTargetEvent] = useState(null)

    // Router
    const router = useRouter()

    // Handler functions
    const toggleDM = () => {
        setDm(!dm)
    }

    // Database Hook functions
    const uploadProfileAndContinue = async () => {
        // Using Firebase v9+ which is nice and modular.
        // Steps:
        // 1) create a user profile and add to firestore 'profiles' collection
        // 2) get the post ID for the newly created profile
        // 3) upload the image to firebase storage with the profile ID as the file name
        // 4) get the dowanload URL for the image and update the original post with image url
        const docRef = await setDoc(doc(db, 'profiles', user.uid), {
            username: username,
            name: name,
            lastName: last,
            bio: bio,
            location: location,
            resetProfile: false,
            profilePic: profilePic,
            dm: dm,
        })

        // Upload the profile image in Firebase storage.
        // Note: path to image is profiles/<profile_id>/image
        if (imageToUpload) {
            const imageRef = ref(storage, `profiles/${user.uid}/image`)
            await uploadString(imageRef, imageToUpload, 'data_url').then(
                async (snapshot) => {
                    // Get the download URL for the image
                    const downloadURL = await getDownloadURL(imageRef, snapshot)

                    // Update the original profile with the image url
                    await updateDoc(doc(db, 'profiles', user.uid), {
                        profilePic: downloadURL,
                    })

                    // Upadate the user's data as well
                    await updateDoc(doc(db, 'users', user.uid), {
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
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                                defaultValue={profile.name || ''}
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
                                defaultValue={profile.lastName || ''}
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
                        defaultValue={profile.username || ''}
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
                        defaultValue={profile.location || ''}
                        className={loginInputs.inputField}
                        placeholder="Country"
                        type="text"
                    />
                </div>

                <div className={loginInputs.inputHeader}>Bio</div>
                <div className={loginInputs.inputBorder}>
                    <input
                        onChange={(e) => {
                            setBio(e.target.value)
                        }}
                        defaultValue={profile.bio || ''}
                        className={loginInputs.inputField}
                        placeholder="About me..."
                        type="text"
                    />
                </div>

                <div className={loginDivs.checkbox}>
                    <input
                        type="checkbox"
                        className={loginButtons.checkbox}
                        checked={profile.dm || false}
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
