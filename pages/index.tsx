import FeedAPI from '../components/Feed/FeedAPI'
import Head from 'next/head'

// Database
import { db } from '../firebase'

import UserProfileForm from '../components/Login/UserProfileForm'
import Modal from '../components/Utils/Modal'
import { useState } from 'react'
import { userProfileState } from '../atoms/user'
import { useRecoilValue } from 'recoil'

export default function Home({ posts }) {
    // Call user Profile and check whether profile requires updating
    // Should only be called on user first log-in
    const userProfile = useRecoilValue(userProfileState)
    // const [show, setShow] = useState(userProfile.resetProfile)
    // const closeModal = () => {
    //     setShow(false)
    // }

    return (
        <>
            <div className="flex flex-col w-full justify-center">
                <Head>
                    <title>Oogway | Social - Wisdom of the crowd</title>
                </Head>
                <FeedAPI posts={posts} />
            </div>
            {/* <Modal
        children={<UserProfileForm/>}
        show={show}
        onClose={closeModal}
    /> */}
        </>
    )
}

// Implement server side rendering for posts
export async function getServerSideProps() {
    // Get the posts
    const posts = await db
        .collection('posts')
        .orderBy('timestamp', 'desc')
        .get()

    const docs = posts.docs.map((post) => ({
        id: post.id,
        ...post.data(),
        timestamp: null, // DO NOT prefetch timestamp
    }))

    return {
        props: {
            posts: docs, // pass the posts back as docs
        },
    }
}
