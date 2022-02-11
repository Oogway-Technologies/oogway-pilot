import React, { useEffect } from 'react'
import Header from './Header/Header'
import { useUser } from '@auth0/nextjs-auth0'
import { userProfileState } from '../atoms/user'
import { useSetRecoilState } from 'recoil'
import { getOrCreateUserFromFirebase } from '../lib/userHelper'

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
        // isLoading is completed (i.e., it is not loading anymoe) and user exists,
        // getUserFromFirebase will get the returned user from the backend
        // and set it to recoil state by setUserProfileState
        if (!isLoading && user) {
            getOrCreateUserFromFirebase(user).then((data) => {
                setUserProfileState(data || {})
            })
        }
    }, [isLoading, user])

    return (
        <div className="flex flex-col min-h-screen max-h-screen overflow-y-hidden">
            <div className="sticky">
                <Header />
            </div>
            <div className="">
                <main>{children}</main>
            </div>
        </div>
    )
}

export default Layout
