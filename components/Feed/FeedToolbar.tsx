import React, {useState} from 'react';
import Button from '../Utils/Button';
import {UilPen} from '@iconscout/react-unicons'
import Modal from '../Utils/Modal';
import NewPostForm from './Forms/NewPostForm';
import {feedToolbarClass} from '../../styles/feed';

// Auth0
import {useUser} from '@auth0/nextjs-auth0';

const FeedToolbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const {user, isLoading} = useUser();

    // Modal helper functions
    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    // TODO: Center buttons when New Post button is not displayed
    return (
        <>
            <div className={feedToolbarClass.div}>
                {/* Left: Tabs */}
                <div className={feedToolbarClass.leftDiv}>
                    {/*TODO: uncomment buttons when its done. */}

                    {/*<Button text="Home" keepText={false} icon={<UilEstate/>} */}
                    {/*    type='button'*/}
                    {/*    addStyle={feedToolbarClass.leftTabButtons} */}
                    {/*    onClick={needsHook}*/}
                    {/*/>*/}
                    {/*<Button text="Hot" keepText={false} icon={<UilFire/>} */}
                    {/*    type='button'*/}
                    {/*    addStyle={feedToolbarClass.leftTabButtons}*/}
                    {/*    onClick={needsHook}*/}
                    {/*/>*/}
                    {/*<Button text="New" keepText={false} icon={<UilNewspaper/>}*/}
                    {/*    type='button'*/}
                    {/*    addStyle={feedToolbarClass.leftTabButtons}*/}
                    {/*    onClick={needsHook}*/}
                    {/*/>*/}
                    {/*<Button text="Unanswered" keepText={false} icon={<UilQuestionCircle/>}*/}
                    {/*    type='button'*/}
                    {/*    addStyle={feedToolbarClass.leftTabButtons}*/}
                    {/*    onClick={needsHook}*/}
                    {/*/>*/}
                </div>

                {/* Right: new post button */}
                {user && (
                    <div className={feedToolbarClass.rightDiv}>
                        <Button text="New Post" keepText={false} icon={<UilPen/>}
                                type='button'
                                addStyle={feedToolbarClass.newPostButton}
                                onClick={openModal}
                        />
                    </div>
                )}
            </div>

            <Modal
                children={<NewPostForm closeModal={closeModal}/>}
                show={isOpen}
                onClose={closeModal}
            />
        </>
    );
};

export default FeedToolbar;
