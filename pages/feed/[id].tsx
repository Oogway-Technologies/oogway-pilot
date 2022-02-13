import Head from 'next/head'
import { useState } from 'react'
import FeedAPI from '../../components/Feed/FeedAPI'
import UserProfileForm from '../../components/Login/UserProfileForm'
import Modal from '../../components/Utils/Modal'
import { db } from '../../firebase'
<<<<<<< HEAD
import { useRecoilValue } from 'recoil'
import { userProfileState } from '../../atoms/user'

// Pass the posts in from server-side rendering.
function Feed({ posts }) {
=======
import { useRecoilValue } from 'recoil';
import { userProfileState } from '../../atoms/user'

// Pass the posts in from server-side rendering.
function Feed({ posts}) {
>>>>>>> e040160e8a9bb74a4009ab4fa9e56c7915a921bf
    // Track reset profile state
    const userProfile = useRecoilValue(userProfileState)
    const [showModal, setShowModal] = useState(
        userProfile.resetProfile ? userProfile.resetProfile : false
    )
    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <div className="flex flex-col w-full justify-center">
                <Head>
                    <title>Oogway | Social - Wisdom of the crowd</title>
                </Head>
                <FeedAPI posts={posts} />
            </div>
            <Modal
<<<<<<< HEAD
                children={<UserProfileForm closeModal={closeModal} />}
=======
                children={
                    <UserProfileForm closeModal={closeModal}/>
                }
>>>>>>> e040160e8a9bb74a4009ab4fa9e56c7915a921bf
                show={showModal}
                onClose={closeModal}
            />
        </>
    )
}

export default Feed

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
        timestamp: post.data().timestamp.toDate().getTime(), // DO NOT prefetch timestamp
    }))

    return {
        props: {
            posts: docs, // pass the posts back as docs
        },
    }
}
