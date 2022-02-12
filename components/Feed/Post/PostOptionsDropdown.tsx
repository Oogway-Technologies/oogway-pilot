import React, { useState } from 'react'
import Button from '../../Utils/Button'
import DropdownMenu from '../../Utils/DropdownMenu'
import {
    UilQuestionCircle,
    UilExclamationCircle,
    UilBan,
    UilTrashAlt,
    UilEllipsisH,
} from '@iconscout/react-unicons'
import Modal from '../../Utils/Modal'
import { Dialog } from '@headlessui/react'
import { postOptionsDropdownClass } from '../../../styles/feed'
import needsHook from '../../../hooks/needsHook'
import { useRouter } from 'next/router'
import { userProfileState } from '../../../atoms/user'
import { useRecoilValue } from 'recoil'
import { getUserDoc } from '../../../lib/userHelper'

type PostOptionsDropdownProps = {
    authorUid: string // Post author id
    deletePost: React.MouseEventHandler<HTMLButtonElement> // Handler function to delete post
    authorName: string // Post author name
}

const PostOptionsDropdown: React.FC<PostOptionsDropdownProps> = ({
    authorUid,
    deletePost,
    authorName,
}) => {
    const userProfile = useRecoilValue(userProfileState) // Get user profile
    const currentUserDoc = getUserDoc(userProfile.uid) // Get user document data

    const router = useRouter()

    // Modal state
    const [isOpen, setIsOpen] = useState(false)

    // Helper Functions
    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const isUsersOwnPost = (authorUid: string) => {
        return userProfile.uid === authorUid
    }

    const isUserBlocked = (authorUid: string) => {
        return authorUid in currentUserDoc?.data().blockedUsers
    }

    // Handler functions
    const blockUser = (e) => {
        e.preventDefault()

        // Return early if user already blocked
        if (isUserBlocked(authorUid)) {
            return
        }

        // Otherwise add blocked user uid to current user's
        // blockedUsers map
        currentUserDoc
            .then((doc) => {
                let tmp = doc.data()
                tmp.blockedUsers[authorUid] = true
                doc.ref.update(tmp)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const unblockUser = (e) => {
        e.preventDefault()

        // Return early if user not blocked
        if (!isUserBlocked(authorUid)) {
            return
        }

        // Remove blocked user uid from current user's
        // blockedUser list
        currentUserDoc
            .then((doc) => {
                let tmp = doc.data()
                delete tmp.blockedUSers[authorUid]
                doc.ref.update(tmp)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const deleteAndClose = (e) => {
        e.preventDefault()
        deletePost(e)
        closeModal()

        // Reroute user back to homepage if not already there
        if (router.pathname !== '/') {
            router.push('/')
        }
    }

    // Confirm delete post modal component
    const ConfirmDeletePost = () => {
        return (
            <div className={postOptionsDropdownClass.modalDiv}>
                <Dialog.Title
                    as="div"
                    className={postOptionsDropdownClass.modalTitle}
                >
                    Are you sure you want to delete your post? It will be gone
                    forever.
                </Dialog.Title>

                {/* Cancel / Submit buttons */}
                <div className="inline-flex w-full space-x-3 px-2">
                    <Button
                        text="No"
                        keepText={true}
                        icon={null}
                        type="button"
                        addStyle={postOptionsDropdownClass.modalCancelButton}
                        onClick={closeModal}
                    />
                    <Button
                        text="Yes, delete"
                        keepText={true}
                        icon={<UilTrashAlt />}
                        type="submit"
                        addStyle={postOptionsDropdownClass.modalConfirmButton}
                        onClick={deleteAndClose}
                    />
                </div>
            </div>
        )
    }

    // Dropdown menu props
    const menuButton = <UilEllipsisH />
    const ownPostMenuItems = [
        <Button
            text="Delete Post"
            keepText={true}
            icon={<UilTrashAlt />}
            type="button"
            onClick={openModal}
            addStyle={postOptionsDropdownClass.buttonAddStyle}
        />,
    ]
    const otherPostMenuItems = [
        <Button
            text="Not Interested in This Post"
            keepText={true}
            icon={<UilQuestionCircle />}
            type="button"
            onClick={needsHook}
            addStyle={postOptionsDropdownClass.buttonAddStyle}
        />,
        // TODO: Get more input on business logic. Does not make sense to be able to unblock
        // a user you've previous blocked froom within their posts. Presumably, you wouldn't see
        // a blocked user's posts...
        <Button
            text={`${
                isUserBlocked(authorUid) ? 'Unblock' : 'Block'
            } ${authorName}`}
            keepText={true}
            icon={<UilBan />}
            type="button"
            onClick={isUserBlocked(authorUid) ? unblockUser : blockUser}
            addStyle={postOptionsDropdownClass.buttonAddStyle}
        />,
        <Button
            text="Report"
            keepText={true}
            icon={<UilExclamationCircle />}
            type="button"
            onClick={needsHook}
            addStyle={postOptionsDropdownClass.buttonAddStyle}
        />,
    ]

    return (
        <>
            <DropdownMenu
                menuButtonClass={postOptionsDropdownClass.menuButtonClass}
                menuItemsClass={postOptionsDropdownClass.menuItemsClass}
                menuButton={menuButton}
                menuItems={
                    isUsersOwnPost(authorUid)
                        ? ownPostMenuItems
                        : otherPostMenuItems
                }
            />
            <Modal
                children={<ConfirmDeletePost />}
                show={isOpen}
                onClose={closeModal}
            />
        </>
    )
}

export default PostOptionsDropdown
