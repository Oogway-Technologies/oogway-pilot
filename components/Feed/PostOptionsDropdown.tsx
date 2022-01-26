import React, { useState } from 'react';
import Button from '../Utils/Button';
import DropdownMenu from '../Utils/DropdownMenu';
import { UilQuestionCircle, UilExclamationCircle, UilBan, UilTrashAlt, UilEllipsisH} from '@iconscout/react-unicons'
import { auth, db } from '../../firebase';
import Modal from '../Utils/Modal';
import { Dialog } from '@headlessui/react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc } from 'firebase/firestore';

// Styles
const postOptionsDropdownStyles = {
    // Dropdown menu
    menuButtonClass: "absolute top-sm right-sm text-neutral-700 cursor-pointer",
    menuItemsClass: "absolute right-6 w-auto h-auto mt-2 p-2 origin-top-right \
        bg-white dark:bg-neutralDark-500 rounded-md shadow-lg \
        ring-2 ring-primary dark:ring-white ring-opacity-50 focus:outline-none before:font-bold",
    buttonAddStyle: "items-center space-x-2 px-sm text-neutral-700 dark:text-neutralDark-150 \
        hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold \
        hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark",
    // Delete post confirmation modal
    modalDiv: "flex-col bg-white dark:bg-neutralDark-500",
    modalTitle: "flex px-2 py-md text-lg font-bold  text-neutral-800 dark:text-neutralDark-50",
    modalCancelButton: "rounded-[20px] p-sm w-full justify-center bg-neutral-150 hover:bg-neutral-300\
    text-neutral-700 text-sm font-bold",
    modalConfirmButton: "rounded-[20px] p-sm w-full space-x-2 justify-center bg-alert dark:bg-alertDark\
    hover:bg-error active:bg-error dark:hover:bg-errorDark \
    dark:active:bg-errorDark text-white dark:text-white font-bold"
}

type PostOptionsDropdownProps = {
    postUid: string, // Post author id
    deletePost:  React.MouseEventHandler<HTMLButtonElement> // Handler function to delete post
    authorName: string, // Post author name
}

const PostOptionsDropdown: React.FC<PostOptionsDropdownProps> = ({ postUid, deletePost, authorName }) => {
    const [user] = useAuthState(auth);
    const [userData] = useDocumentData(doc(db, "users", user.uid));
    const [isOpen, setIsOpen] = useState(false)

    // Helper Functions
    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const isUsersOwnPost = (postUid) => {
        return user?.uid === postUid
    }

    const isUserBlocked = (postUid) => {
        return userData?.blockedUsers?.includes(postUid)
    }

    // Handler functions
    const blockUser = (e) => {
        e.preventDefault();

        // Return early if user already blocked
        console.log(user.posts);
        if (isUserBlocked(postUid)) {
            return
        }

        // Otherwise add blocked user uid to current user's
        // blockedUsers array
        // Why is this needed?
        // The alternative is to create a separate collection for blocked
        // users which maps  user's uid to an array of blocked user uids
        // Storing this as an attribute under the user collection is more 
        // efficient because we will need to store the current user attribuutes
        // in global state
        db.collection("users")
        .doc(user.uid)
        .get()
        .then((userDoc) => {
            let tmp = userDoc.data();

            if ("blockedUsers" in tmp) {
                tmp.blockedUsers.push(postUid)
            } else {
                // Create a new array
                tmp["blockedUsers"] = [postUid]
            }

            userDoc.ref.update(tmp);
        })
        .catch((err) => {console.log(err)})
    }

    const unblockUser = (e) => {
        e.preventDefault();

        // Return early if user not blocked
        if (!isUserBlocked(postUid)) {
            return
        }

        // Remove blocked user uid from current user's 
        // blockedUser list
        db.collection("users")
        .doc(user.uid)
        .get()
        .then((userDoc) => {
            let tmp = userDoc.data();
            const index = tmp.blockedUsers.indexOf(postUid);
            if (index > -1) {
                tmp.blockedUsers.splice(index, 1);
                userDoc.ref.update(tmp);
            }
        })
        .catch((err) => {console.log(err)})
    }

    const deleteAndClose = (e) => {
        e.preventDefault();
        deletePost(e);
        closeModal();
    }

    // Confirm delete post modal component
    const ConfirmDeletePost = () => {

        return (
            <div className={postOptionsDropdownStyles.modalDiv}>
                <Dialog.Title as="div" className={postOptionsDropdownStyles.modalTitle}>
                    Are you sure you want to delete your post? It will be gone forever.
                </Dialog.Title>
                
                {/* Cancel / Submit buttons */}
                <div className="inline-flex w-full space-x-3 px-2">
                    <Button text="No" keepText={true} icon={null}
                        type='button' 
                        addStyle={postOptionsDropdownStyles.modalCancelButton}
                        onClick={closeModal}
                    />
                    <Button text="Yes, delete" keepText={true} icon={<UilTrashAlt/>}
                        type="submit"
                        addStyle={postOptionsDropdownStyles.modalConfirmButton}
                        onClick={deleteAndClose}/>
                </div>
            </div>
        )
    }

    const needsHook = () => {
        alert('This button needs a hook!')
    }

    // Dropdown menu props
    const menuButton = <UilEllipsisH/>
    const ownPostMenuItems = [
        <Button 
            text="Delete Post"
            keepText={true}
            icon={<UilTrashAlt/>}
            type="button"
            onClick={openModal}
            addStyle={postOptionsDropdownStyles.buttonAddStyle}
        />
    ]
    const otherPostMenuItems = [
        <Button 
            text="Not Interested in This Post"
            keepText={true}
            icon={<UilQuestionCircle/>}
            type="button"
            onClick={needsHook}
            addStyle={postOptionsDropdownStyles.buttonAddStyle}
        />,
        // TODO: Get more input on business logic. Does not make sense to be able to unblock 
        // a user you've previous blocked froom within their posts. Presumably, you wouldn't see
        // a blocked user's posts...
        <Button 
            text={`${isUserBlocked(postUid) ? 'Unblock' : 'Block'} ${authorName}`}
            keepText={true}
            icon={<UilBan/>}
            type="button"
            onClick={isUserBlocked(postUid) ? unblockUser : blockUser}
            addStyle={postOptionsDropdownStyles.buttonAddStyle}
        />,
        <Button 
            text="Report"
            keepText={true}
            icon={<UilExclamationCircle/>}
            type="button"
            onClick={needsHook}
            addStyle={postOptionsDropdownStyles.buttonAddStyle}
        />
    ]

    return (
            <>
            <DropdownMenu 
                menuButtonClass={postOptionsDropdownStyles.menuButtonClass}
                menuItemsClass={postOptionsDropdownStyles.menuItemsClass}
                menuButton={menuButton}
                menuItems={isUsersOwnPost(postUid) ? ownPostMenuItems : otherPostMenuItems}
            />
            <Modal 
                children={<ConfirmDeletePost/>}
                show={isOpen}
                onClose={closeModal}
            />
            </>
    )
};

export default PostOptionsDropdown;
