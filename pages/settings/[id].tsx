import Head from 'next/head'
import {FC, useState} from 'react'
import UserProfileForm from '../../components/Login/UserProfileForm'
import Modal from '../../components/Utils/Modal'
import {db} from '../../firebase'
import {useRouter} from 'next/router'
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import {ParsedUrlQuery} from "querystring";
import {doc, DocumentData, getDoc} from "firebase/firestore";
import {FirebaseProfile} from "../../utils/types/firebase";

interface SettingsProps {
    userProfile:FirebaseProfile
    referer?:string
}
const Settings:FC<SettingsProps> = ({userProfile, referer}:SettingsProps) => {
    const router = useRouter()

    // Block unauthorized users
    //const [user] = useAuthState(auth)
    //useEffect(() => {
    //    if (!user) {
    //        router.push(referer)
    //    }
    //    if (!user.uid === userProfile.uid) {
    //        router.push(`settings/${user.uid}`)
    //    }
    //}, [user])

    // Modal handlers
    const [showModal, setShowModal] = useState(true)
    const closeModal = () => {
        setShowModal(false)
        referer && router.push(referer)
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

// Implement server side rendering for userProfile and posts
export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext<ParsedUrlQuery,
        string | false | object | undefined>
) => {

    //Get userProfile of selected user from database.
    const userProfile: DocumentData | undefined = (
        await getDoc(doc(db, 'profiles', (context?.query?.id as string) || ''))
    ).data()
    // Track outgoing url
    const referer = context.req.headers.referer
    return {
        props: {
            referer,
            userProfile, // pass the userProfile back to the front-end
        },
    }
}
