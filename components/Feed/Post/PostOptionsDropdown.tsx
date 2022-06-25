// React
import { Dialog } from '@headlessui/react'
import { UilEllipsisH, UilTrashAlt } from '@iconscout/react-unicons'
import { useRouter } from 'next/router'
import React, { MouseEvent, useState } from 'react'
// Queries
import { useQueryClient } from 'react-query'

import { useAppSelector } from '../../../hooks/useRedux'
// Database
import { postOptionsDropdownClass } from '../../../styles/feed'
import { FirebaseProfile } from '../../../utils/types/firebase'
// Styles and Components
import Button from '../../Utils/Button'
import DropdownMenu from '../../Utils/DropdownMenu'
import Modal from '../../Utils/Modal'

type PostOptionsDropdownProps = {
    authorUid: string
    deletePost: () => Promise<string> // Handler function to delete post
    postType: 'Post' | 'Comment' | 'Reply' // Whether post, comment, or reply
    authorProfile: FirebaseProfile | undefined
}

const PostOptionsDropdown: React.FC<
    React.PropsWithChildren<React.PropsWithChildren<PostOptionsDropdownProps>>
> = ({
    authorUid,
    // authorProfile,
    deletePost,
    postType,
}) => {
    const userProfile = useAppSelector(state => state.userSlice.user)
    // const currentUserDoc = getUserDoc(userProfile?.uid) // Get user document data

    // For triggering posts refetch on form submission
    const queryClient = useQueryClient()

    // const authorName = authorProfile?.username
    //     ? authorProfile?.username
    //     : authorProfile?.name
    // Track author blocked state
    // TODO: refactor to custom hook
    // const [authorIsBlocked, setAuthorIsBlocked] = useState(false)
    // useEffect(() => {
    //     isUserBlocked(authorUid).then(result => {
    //         setAuthorIsBlocked(result)
    //     })
    // }, [authorUid])

    const router = useRouter()

    // Modal state management
    const [isOpen, setIsOpen] = useState(false)
    const openModal = () => {
        setIsOpen(true)
    }
    const closeModal = () => {
        setIsOpen(false)
    }

    const isUsersOwnPost = (authorUid: string) => {
        return userProfile?.uid === authorUid
    }

    // const isUserBlocked = async (authorUid: string) => {
    //     const isBlocked = await currentUserDoc.then(async doc => {
    //         if (doc?.exists()) {
    //             return authorUid in doc.data().blockedUsers
    //         } else {
    //             return false
    //         }
    //     })
    //     return isBlocked
    // }

    // Handler functions
    // const blockUser = async (e: MouseEvent<HTMLButtonElement>) => {
    //     e.preventDefault() // Not sure if necessary

    //     // Return early if user already blocked
    //     if (authorIsBlocked) {
    //         return
    //     }

    //     // Otherwise add blocked user uid to current user's
    //     // blockedUsers map
    //     await currentUserDoc
    //         .then(async doc => {
    //             if (doc?.exists()) {
    //                 const tmp = doc.data()
    //                 tmp.blockedUsers[authorUid] = true
    //                 await updateDoc(doc.ref, tmp)
    //             } else {
    //                 console.log('User doc not retrieved')
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })

    //     // Update state
    //     setAuthorIsBlocked(true)
    // }

    // const unblockUser = async (e: MouseEvent<HTMLButtonElement>) => {
    //     e.preventDefault()

    //     // Return early if user not blocked
    //     if (!authorIsBlocked) {
    //         return
    //     }

    //     // Remove blocked user uid from current user's
    //     // blockedUser list
    //     await currentUserDoc
    //         .then(async doc => {
    //             if (doc?.exists()) {
    //                 const tmp = doc.data()
    //                 delete tmp.blockedUsers[authorUid]
    //                 await updateDoc(doc.ref, tmp)
    //             } else {
    //                 console.log('User doc not retrieved')
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })

    //     // Update state
    //     setAuthorIsBlocked(false)
    // }

    const deleteAndClose = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const nextUrl = deletePost()
        closeModal()

        // Trigger a post refetch with a timeout to give the database
        // time to register the delete
        setTimeout(() => queryClient.invalidateQueries('posts'), 2000)

        // Reroute user to the correct location
        if (router.asPath !== (await nextUrl)) {
            router.push(await nextUrl)
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
                    Are you sure you want to delete your{' '}
                    {postType.toLowerCase()}? It will be gone forever.
                </Dialog.Title>

                {/* Cancel / Submit buttons */}
                <div className="inline-flex px-2 space-x-3 w-full">
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
    const ownPostMenuItems = [
        <Button
            key={`Delete ${postType}`}
            text={`Delete ${postType}`}
            keepText={true}
            icon={<UilTrashAlt />}
            type="button"
            onClick={openModal}
            addStyle={postOptionsDropdownClass.buttonAddStyle}
        />,
    ]
    // const otherPostMenuItems = [
    //     <Button
    //         key="Not Interested in This Post"
    //         text="Not Interested in This Post"
    //         keepText={true}
    //         icon={<UilQuestionCircle />}
    //         type="button"
    //         onClick={needsHook}
    //         addStyle={postOptionsDropdownClass.buttonAddStyle}
    //     />,
    //     // TODO: Get more input on business logic. Does not make sense to be able to unblock
    //     // a user you've previous blocked froom within their posts. Presumably, you wouldn't see
    //     // a blocked user's posts...
    //     <Button
    //         key={`${authorIsBlocked ? 'Unblock' : 'Block'} ${authorName}`}
    //         text={`${authorIsBlocked ? 'Unblock' : 'Block'} ${authorName}`}
    //         keepText={true}
    //         icon={<UilBan />}
    //         type="button"
    //         onClick={authorIsBlocked ? unblockUser : blockUser}
    //         addStyle={postOptionsDropdownClass.buttonAddStyle}
    //     />,
    //     <Button
    //         key={'Report'}
    //         text="Report"
    //         keepText={true}
    //         icon={<UilExclamationCircle />}
    //         type="button"
    //         onClick={needsHook}
    //         addStyle={postOptionsDropdownClass.buttonAddStyle}
    //     />,
    // ]

    {
        /* TODO: change menu items to
                        isUsersOwnPost(authorUid)
                        ? ownPostMenuItems
                        : otherPostMenuItems when its done
                        and remove  isUsersOwnPost(authorUid) condition*/
    }

    return isUsersOwnPost(authorUid) ? (
        <>
            <DropdownMenu
                menuButtonClass={postOptionsDropdownClass.menuButtonClass}
                menuItemsClass={postOptionsDropdownClass.menuItemsClass}
                menuButton={<UilEllipsisH />}
                menuItems={ownPostMenuItems}
            />
            <Modal show={isOpen} onClose={closeModal}>
                <ConfirmDeletePost />
            </Modal>
        </>
    ) : (
        <></>
    )
}

export default PostOptionsDropdown
