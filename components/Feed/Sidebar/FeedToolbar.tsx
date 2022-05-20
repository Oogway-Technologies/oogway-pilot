// Auth0
import { useUser } from '@auth0/nextjs-auth0'
import { UilArrowLeft } from '@iconscout/react-unicons'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { setFeedState } from '../../../features/utils/utilsSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { feedApiClass, feedToolbarClass } from '../../../styles/feed'
import NewPostForm from '../../Forms/NewPostForm'
import Button from '../../Utils/Button'
import Modal from '../../Utils/Modal'
import FeedPostbar from './FeedPostbar'
import { FeedSelectorMobile } from './FeedSelector'

const FeedToolbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user } = useUser()

    // Tracking feed / new post button swap
    const isMobile = useMediaQuery('(max-width: 965px)')

    // Track feed
    const feed = useAppSelector(state => state.utilsSlice.feedState)

    // Router for shallow routing to feeds
    const router = useRouter()

    // helper functions
    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    // TODO: Center buttons when New Post button is not displayed
    return (
        <div className={feedApiClass.feedToolbar}>
            {isMobile ? (
                <div className={feedToolbarClass.div}>
                    {/* Left: Tabs */}
                    <div className={feedToolbarClass.leftDiv}>
                        {/* TODO: uncomment buttons when its done. */}
                        <span className={feedApiClass.feedTitle}>
                            {feed !== 'All' && (
                                <Button
                                    icon={<UilArrowLeft />}
                                    text={undefined}
                                    forceNoText={true}
                                    keepText={false}
                                    addStyle={feedApiClass.backbutton}
                                    type="button"
                                    onClick={() => {
                                        useAppDispatch(setFeedState('All'))
                                        router.push('/feed')
                                    }}
                                />
                            )}
                            {feed === 'All' ? 'Home' : `${feed}`}
                        </span>
                        {/* <Button text="Hot" keepText={false} icon={<UilFire/>} */}
                        {/*    type='button'*/}
                        {/*    addStyle={feedToolbarClass.leftTabButtons}*/}
                        {/*    onClick={needsHook}*/}
                        {/* />*/}
                        {/* <Button text="New" keepText={false} icon={<UilNewspaper/>}*/}
                        {/*    type='button'*/}
                        {/*    addStyle={feedToolbarClass.leftTabButtons}*/}
                        {/*    onClick={needsHook}*/}
                        {/* />*/}
                        {/* <Button text="Unanswered" keepText={false} icon={<UilQuestionCircle/>}*/}
                        {/*    type='button'*/}
                        {/*    addStyle={feedToolbarClass.leftTabButtons}*/}
                        {/*    onClick={needsHook}*/}
                        {/* />*/}
                    </div>

                    {/* Right: new post button */}
                    <div className={feedToolbarClass.rightDiv}>
                        <FeedSelectorMobile />
                    </div>
                </div>
            ) : (
                user && <FeedPostbar openModal={openModal} />
            )}
            <Modal show={isOpen} onClose={closeModal}>
                <NewPostForm closeModal={closeModal} />
            </Modal>
        </div>
    )
}

export default FeedToolbar
