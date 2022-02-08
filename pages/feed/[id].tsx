import Head from 'next/head'
import { useState } from 'react'
import FeedAPI from '../../components/Feed/FeedAPI'
import UserProfileForm from '../../components/Login/UserProfileForm'
import Modal from '../../components/Utils/Modal'
import { db } from '../../firebase'

// Pass the posts in from server-side rendering.
// TODO: instead of passing the posts all the way down,
// save the in a global store using RECOIL: https://recoiljs.org/
function Feed({ posts, profile }) {
    // Track reset profile state
    const [showModal, setShowModal] = useState(
        profile.resetProfile ? profile.resetProfile : false
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
                children={<UserProfileForm closeModal={closeModal} />}
                show={showModal}
                onClose={closeModal}
            />
        </>
    )
}

export default Feed

// Implement server side rendering for posts
export async function getServerSideProps(context) {
    // Get the posts
    const posts = await db
        .collection('posts')
        .orderBy('timestamp', 'desc')
        .get()
    const profile = await db.collection('profiles').doc(context.query.id).get()

    const docs = posts.docs.map((post) => ({
        id: post.id,
        ...post.data(),
        timestamp: null, // DO NOT prefetch timestamp
    }))
    const userProfile = profile.data()

    return {
        props: {
            posts: docs, // pass the posts back as docs
            profile: userProfile, // pass the profile back to the front-end
        },
    }
}
