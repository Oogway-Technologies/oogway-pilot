import React, { useState } from 'react';
import Button from '../Utils/Button';
import { UilEstate, UilFire, UilNewspaper, UilQuestionCircle, UilPen } from '@iconscout/react-unicons'
import Modal from '../Utils/Modal';
import NewPostForm from './NewPostForm';


const FeedToolbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    // Modal helper functions
    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    // Placeholder for hooks until they are added
    const needsHook = () => {
        console.log('This button needs a hook!')
    }

    //  Button additional styles
    const leftTabsStyle = "rounded-[20px] p-sm md:px-md md:space-x-2 border-2 border-solid border-transparent\
        text-neutral-700 dark:text-neutralDark-150 \
        hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold \
        hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20\
        hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark"
    const newPostStyle = "rounded-[20px] p-sm md:px-md md:space-x-2 \
        bg-primary dark:bg-primaryDark hover:bg-primaryActive \
        active:bg-primaryActive dark:hover:bg-primaryActive \
        dark:active:bg-primaryActive text-white font-bold"

    return (
        <>
            <div className="grid grid-cols-2">
                {/* Left: Tabs */}
                <div className="flex items-center justify-self-start md:mr-auto">
                    <Button text="Home" keepText={false} icon={<UilEstate/>} 
                        type='button'
                        addStyle={leftTabsStyle} 
                        onClick={needsHook}
                    />
                    <Button text="Hot" keepText={false} icon={<UilFire/>} 
                        type='button'
                        addStyle={leftTabsStyle}
                        onClick={needsHook}
                    />
                    <Button text="New" keepText={false} icon={<UilNewspaper/>}
                        type='button'
                        addStyle={leftTabsStyle}
                        onClick={needsHook}
                    />
                    <Button text="Unanswered" keepText={false} icon={<UilQuestionCircle/>}
                        type='button'
                        addStyle={leftTabsStyle}
                        onClick={needsHook}
                    />
                </div>

                {/* Right: new post button */}
                <div className="flex items-center justify-self-end md:ml-auto">
                    <Button text="New Post" keepText={false} icon={<UilPen/>}
                        type='button'
                        addStyle={newPostStyle}
                        onClick={openModal}
                    />
                </div>
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
