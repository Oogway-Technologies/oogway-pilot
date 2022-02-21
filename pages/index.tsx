// Next and react
import { useState } from 'react'
import Head from 'next/head'

// Components and styling
import FeedAPI from '../components/Feed/FeedAPI'
import UserProfileForm from '../components/Login/UserProfileForm'
import Modal from '../components/Utils/Modal'

// Recoil states
import { userProfileState } from '../atoms/user'
import { useRecoilValue } from 'recoil'

// Queries
import { QueryClient, dehydrate } from 'react-query'
import { queryClientConfig } from '../query'
import { getPosts } from '../queries/posts'

export default function Home() {
    // Call user Profile and check whether profile requires updating
    // Should only be called on user first log-in
    const userProfile = useRecoilValue(userProfileState)
    const [show, setShow] = useState(false)
    const closeModal = () => {
        setShow(false)
    }

    return (
        <>
            <div className="flex flex-col w-full justify-center">
                <Head>
                    <title>Oogway | Social - Wisdom of the crowd</title>
                </Head>
                <FeedAPI />
            </div>

            {/* Modal for user profile */}
            <Modal
                children={<UserProfileForm closeModal={closeModal} />}
                show={show}
                onClose={closeModal}
            />
        </>
    )
}

// Implement server side rendering for posts
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
