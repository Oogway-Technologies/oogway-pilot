import { UilPen } from '@iconscout/react-unicons'
import { useMediaQuery } from '@mui/material'
import React, { useState } from 'react'

import { feedApiClass, feedToolbarClass } from '../../styles/feed'
import Button from '../Utils/Button'
import Modal from '../Utils/Modal'
import FeedTitle from './FeedTitle'
import FeedToolbar from './FeedToolbar'
import NewPostForm from './Forms/NewPostForm'
import PostsAPI from './Post/PostsAPI'

const FeedAPI = () => {
    const [isOpen, setIsOpen] = useState(false)
    const isMobile = useMediaQuery('(max-width: 965px)')

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
                <FeedTitle />
            </div>

            <div id="infiniteScrollTarget" className={feedApiClass.innerDiv}>
                {/* Posts */}
                <div className={feedApiClass.contentDiv}>
                    {/* New Post button on mobile devices */}
                    {isMobile && (
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
