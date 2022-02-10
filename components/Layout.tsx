import React, {useEffect} from 'react'
import Header from './Header/Header'
import {useUser} from "@auth0/nextjs-auth0";
import {userProfileState} from "../atoms/userProfile";
import {useSetRecoilState} from "recoil";
import {getUserFromFirebase} from "../utils/helpers/userHelper";

interface LayoutProps {
    children: React.ReactNode
}


const Layout = ({children}: LayoutProps) => {
    const {user, isLoading} = useUser();
    const setUser = useSetRecoilState(userProfileState);

    useEffect(() => {
        if (user) {
            getUserFromFirebase(user).then((data) => {
                if (data?.docs.length) {
                    setUser(data?.docs[0]?.data() || {});
                }
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
