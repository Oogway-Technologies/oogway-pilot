import { useUser } from '@auth0/nextjs-auth0'
import firebase from 'firebase/compat'
import Cookies from 'js-cookie'
import Head from 'next/head'
import React, { useEffect } from 'react'

import { setUser } from '../features/user/userSlice'
import { useAppDispatch } from '../hooks/useRedux'
import { getOrCreateUserFromFirebase } from '../lib/userHelper'
import { FirebaseProfile } from '../utils/types/firebase'
import Header from './Header/Header'
import DocumentData = firebase.firestore.DocumentData

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const { user, isLoading } = useUser()
    const ipAddress = Cookies.get('userIp')

    // This useEffect will run every time the page is reloaded
    // to fetch the user profile information from the backend.
    // It will then set the redux state with the user profile information
    // to make it available to each component.
    useEffect(() => {
        // isLoading is completed (i.e., it is not loading anymore) and user exists,
        // getUserFromFirebase will get the returned user from the backend
        // and set it to redux state by useAppDispatch(setUser(data as FirebaseProfile))
        if (!isLoading && user) {
            getOrCreateUserFromFirebase(user, ipAddress).then(
                (data: FirebaseProfile | DocumentData | undefined) => {
                    useAppDispatch(setUser(data as FirebaseProfile))
                }
            )
        }
    }, [isLoading, user])

    return (
        <>
            <Head>
                <title>Oogway | Decision Engine</title>
            </Head>
            <div className="flex max-h-screen min-h-screen flex-col overflow-y-clip">
                <div className="sticky z-10">
                    <Header />
                </div>
                <div className="z-0">
                    <main>{children}</main>
                </div>
            </div>
        </>
    )
}

export default Layout
