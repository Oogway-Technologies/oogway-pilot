import { useUser } from '@auth0/nextjs-auth0'
import firebase from 'firebase/compat'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import { userProfileState } from '../atoms/user'
import { getOrCreateUserFromFirebase } from '../lib/userHelper'
import { FirebaseProfile } from '../utils/types/firebase'
import Header from './Header/Header'
import DocumentData = firebase.firestore.DocumentData

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const { user, isLoading } = useUser()

    // Get userProfileState state from recoil.
    const setUserProfileState = useSetRecoilState(userProfileState)

    // This useEffect will run everytime the page is reloaded
    // to fetch the user profile information from the backend.
    // It will then set the recoil state with the user profile information
    // to make it available to each component.
    useEffect(() => {
        // isLoading is completed (i.e., it is not loading anymore) and user exists,
        // getUserFromFirebase will get the returned user from the backend
        // and set it to recoil state by setUserProfileState
        if (!isLoading && user) {
            getOrCreateUserFromFirebase(user).then(
                (data: FirebaseProfile | DocumentData | undefined) => {
                    setUserProfileState(data as FirebaseProfile)
                }
            )
        }
    }, [isLoading, user])

    return (
        <>
            <Head>
                <title>Oogway | Social - Wisdom of the crowd</title>
            </Head>
            <div className="flex overflow-y-hidden flex-col min-h-screen max-h-screen">
                <div className="sticky">
                    <Header />
                </div>
                <div className="">
                    <main>{children}</main>
                </div>
            </div>
        </>
    )
}

export default Layout
