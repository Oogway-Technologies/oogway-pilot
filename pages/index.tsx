// Next and react
import Head from 'next/head'
import React, { FC, ReactNode, useState } from 'react'
// Recoil states
// import {userProfileState} from '../atoms/user'
// import {useRecoilValue} from 'recoil'
// Queries
import { dehydrate, QueryClient } from 'react-query'

// Components and styling
import FeedAPI from '../components/Feed/FeedAPI'
import { FeedSelectorMenu } from '../components/Feed/FeedSelector'
import UserProfileForm from '../components/Login/UserProfileForm'
import Modal from '../components/Utils/Modal'
import SidebarWidget from '../components/Utils/SidebarWidget'
import { getPosts } from '../queries/posts'
import { queryClientConfig } from '../query'

interface Props {
    children: ReactNode
}

const Sidebar: FC<Props> = ({ children }) => {
    return (
        <div
            className={
                'hidden lg:flex lg:visible lg:flex-col lg:w-3/12 lg:align-top'
            }
        >
            {children}
        </div>
    )
}

const MainContent: FC<Props> = ({ children }) => {
    return (
        <div
            className={
                'flex flex-col justify-center px-1 w-full lg:px-0 lg:w-6/12'
            }
        >
            {children}
        </div>
    )
}

/**
 * Home: The public (or personalized user) feed of the app
 * @return {JSX.Element} The JSX Code for the home page
 */
export default function Home() {
    // Call user Profile and check whether profile requires updating
    // Should only be called on user first log-in
    // const userProfile = useRecoilValue(userProfileState)
    const [show, setShow] = useState(false)
    const closeModal = () => {
        setShow(false)
    }

    return (
        <div>
            <Head>
                <title>Oogway | Social - Wisdom of the crowd</title>
            </Head>

            <div className="flex flex-row">
                <Sidebar>
                    <SidebarWidget>
                        <FeedSelectorMenu />
                    </SidebarWidget>
                </Sidebar>
                <MainContent>
                    <FeedAPI />
                </MainContent>
                <Sidebar>
                    <div></div>
                </Sidebar>
            </div>

            {/* Modal for user profile */}
            <Modal show={show} onClose={closeModal}>
                <UserProfileForm
                    closeModal={closeModal}
                    headerText="Setup Profile"
                    cancelButtonText="skip"
                />
            </Modal>
        </div>
    )
}

/**
 * getServerSideProps: Fetches server side props for the home page
 * @return {Promise} Promise containing props object with dehydrated posts from react query client
 */
export async function getServerSideProps() {
    const queryClient = new QueryClient(queryClientConfig)

    // Get the posts
    await queryClient.prefetchQuery(['posts', 'infinite'], getPosts)

    return {
        props: {
            dehhydratedState: dehydrate(queryClient),
            // posts: response?.data.posts, // pass the posts back as a list
            // lastTimestamp: response?.data.lastTimestamp,
        },
    }
}
