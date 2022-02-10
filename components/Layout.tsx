import React, {useEffect} from 'react'
import Header from './Header/Header'
import {useUser} from "@auth0/nextjs-auth0";
import {userProfileState} from "../atoms/userProfile";
import {useSetRecoilState} from "recoil";
import {getUserFromFirebase} from "../lib/userHelper";

interface LayoutProps {
    children: React.ReactNode
}


const Layout = ({children}: LayoutProps) => {
    // useUser is used to get the current Auth0 user.
    const {user, isLoading} = useUser();
    // using useSetRecoilState to get userProfileState state from recoil.
    const setUserProfileState = useSetRecoilState(userProfileState);

    // This useEffect will run everytime the page is reloaded, to fetch the user from the backend and it will set to recoil state.
    useEffect(() => {
        // isLoading is completed and user is exists, getUserFromFirebase will get the returned user form the backend and set it to recoil state by setUserProfileState
        if (!isLoading && user) {
            getUserFromFirebase(user).then((data) => {
                setUserProfileState(data || {});
            })
        }
    }, [isLoading])

    return (
        <div className="flex flex-col min-h-screen max-h-screen overflow-y-hidden">
            <div className="sticky">
                <Header/>
            </div>
            <div className="">
                <main>{children}</main>
            </div>
        </div>
    )
}

export default Layout
