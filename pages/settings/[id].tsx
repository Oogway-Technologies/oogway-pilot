import Head from 'next/head'
import { useEffect, useState } from 'react'
import FeedAPI from '../../components/Feed/FeedAPI'
import UserProfileForm from '../../components/Login/UserProfileForm'
import Modal from '../../components/Utils/Modal'
import { auth, db } from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'

const Settings = ({ userProfile, referer }) => {
    const router = useRouter()

    // Block unauthorized users
    const [user] = useAuthState(auth)
    useEffect(() => {
        if (!user) {
            router.push(referer)
        }
        if (!user.uid === userProfile.uid) {
            router.push(`settings/${user.uid}`)
        }
    }, [user])

    // Modal handlers
    const [showModal, setShowModal] = useState(true)
    const closeModal = () => {
        setShowModal(false)
        router.push(referer)
    }
    const openModal = () => {
        setShowModal(true)
    }

    return (
        <>
            <div className="flex flex-col w-full justify-center">
                <Head>
                    <title>{`${userProfile.username}'s Settings`}</title>
                </Head>
            </div>
            <Modal
                children={
                    <UserProfileForm
                        profile={userProfile}
                        closeModal={closeModal}
                    />
                }
                show={showModal}
                onClose={closeModal}
            />
        </>
    )
}

export default Settings

// Implement server side rendering for posts
export async function getServerSideProps(context) {
    // Get profile
    const profile = await db.collection('profiles').doc(context.query.id).get()
    const userProfile = profile.data()

    // Track outgoing url
    const referer = context.req.headers.referer

    return {
        props: {
            userProfile: userProfile,
            referer: referer,
        },
    }
}
