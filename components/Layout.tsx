import React, {useEffect, useState} from 'react'
import Header from './Header/Header'
import {useUser} from '@auth0/nextjs-auth0'
import {userProfileState} from '../atoms/user'
import {useRecoilState, useSetRecoilState} from 'recoil'
import {getOrCreateUserFromFirebase} from '../lib/userHelper'
import {FirebaseProfile} from "../utils/types/firebase";
import firebase from "firebase/compat";
import Modal from "./Utils/Modal";
import UserProfileForm from "./Login/UserProfileForm";
import {termsAndConditionsPopUpState} from "../atoms/termsAndConditons";
import DocumentData = firebase.firestore.DocumentData;

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({children}: LayoutProps) => {
    const {user, isLoading} = useUser()
    const [userProfilePopup, setUserProfilePopup] = useState<boolean>(false)

    // Get userProfileState state from recoil.
    const setUserProfileState = useSetRecoilState(userProfileState)

    // Get Terms modal state form recoil
    const [termsModal, setTermsModal] = useRecoilState(termsAndConditionsPopUpState);

    // This useEffect will run everytime the page is reloaded
    // to fetch the user profile information from the backend.
    // It will then set the recoil state with the user profile information
    // to make it available to each component.
    useEffect(() => {
        // isLoading is completed (i.e., it is not loading anymore) and user exists,
        // getUserFromFirebase will get the returned user from the backend
        // and set it to recoil state by setUserProfileState
        if (!isLoading && user) {
            getOrCreateUserFromFirebase(user).then((data: FirebaseProfile | DocumentData | undefined) => {
                setUserProfileState(data as FirebaseProfile)
                if (!data?.termAndConditions) {
                    setUserProfilePopup(true)
                }
            })
        }
    }, [isLoading, user])

    return (
        <div className="flex flex-col min-h-screen max-h-screen overflow-y-hidden">
            <div className="sticky">
                <Header/>
            </div>
            <div className="">
                <main>{children}</main>
            </div>
            <Modal
                children={<UserProfileForm closeModal={() => setUserProfilePopup(false)}/>}
                show={userProfilePopup}
                onClose={() => setUserProfilePopup(false)}
            />
            <Modal
                children={<div>Model here</div>}
                show={termsModal}
                onClose={() => setTermsModal(false)}
            />
        </div>
    )
}

export default Layout
