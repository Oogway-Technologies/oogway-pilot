import React, { useEffect } from 'react'
import Header from './Header/Header'
import { useUser } from '@auth0/nextjs-auth0'
import firebase from 'firebase/compat'
import Loading from './Loading'
import { UserIDState, UserProfileState } from '../atoms/user'
import { useSetRecoilState } from 'recoil'

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const { user, isLoading } = useUser()

    if (isLoading) return <Loading />

    // // Get userProfileState state from recoil.
    // const setUserProfileState = useSetRecoilState(userProfileState)

    // // This useEffect will run everytime the page is reloaded
    // // to fetch the user profile information from the backend.
    // // It will then set the recoil state with the user profile information
    // // to make it available to each component.


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
