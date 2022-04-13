import { useUser } from '@auth0/nextjs-auth0'
import { UilPen } from '@iconscout/react-unicons'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { setFeedState } from '../../features/utils/utilsSlice'
import useMediaQuery from '../../hooks/useMediaQuery'
import { useAppDispatch } from '../../hooks/useRedux'
import { feedApiClass, feedToolbarClass } from '../../styles/feed'
import NewPostForm from '../Forms/NewPostForm'
import Button from '../Utils/Button'
import Modal from '../Utils/Modal'
import PostsAPI from './Post/PostsAPI'
import FeedToolbar from './Sidebar/FeedToolbar'

const FeedAPI = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user } = useUser()

    // Track mobile
    const isMobile = useMediaQuery('(max-width: 965px)')

    // Initialize feed state
    const router = useRouter()

    useEffect(() => {
        const { feed: currentFeed } = router.query
        if (currentFeed) {
            useAppDispatch(setFeedState(currentFeed as string))
        }
    }, [router])

    // helper functions
    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    return (
        <>
            <div className={feedApiClass.toolbarDiv}>
                <FeedToolbar />
                {/* <FeedTitle /> */}
            </div>

            <div id="infiniteScrollTarget" className={feedApiClass.innerDiv}>
                {/* Posts */}
                <div className={feedApiClass.contentDiv}>
                    {/* New Post button on mobile devices */}
                    {isMobile && user && (
                        <Button
                            text="New Post"
                            keepText={true}
                            icon={<UilPen />}
                            type="button"
                            addStyle={
                                feedToolbarClass.newPostButton +
                                feedApiClass.mobileNewPostButton
                            }
                            onClick={openModal}
                        />
                    )}
                    {/* Posts */}
                    <PostsAPI />

                    <Modal show={isOpen} onClose={closeModal}>
                        <NewPostForm closeModal={closeModal} />
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default FeedAPI
