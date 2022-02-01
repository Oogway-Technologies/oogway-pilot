import React, { useState } from 'react';
import Button from '../Utils/Button';
import { UilEstate, UilFire, UilNewspaper, UilQuestionCircle, UilPen } from '@iconscout/react-unicons'
import Modal from '../Utils/Modal';
import NewPostForm from './Forms/NewPostForm';
import { feedToolbarClass } from '../../styles/feed';
import needsHook from '../../hooks/needsHook';


const FeedToolbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    // Modal helper functions
    const openModal = () => {
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    return (
        <>
            <div className={feedToolbarClass.div}>
                {/* Left: Tabs */}
                <div className={feedToolbarClass.leftDiv}>
                    <Button text="Home" keepText={false} icon={<UilEstate/>} 
                        type='button'
                        addStyle={feedToolbarClass.leftTabButtons} 
                        onClick={needsHook}
                    />
                    <Button text="Hot" keepText={false} icon={<UilFire/>} 
                        type='button'
                        addStyle={feedToolbarClass.leftTabButtons}
                        onClick={needsHook}
                    />
                    <Button text="New" keepText={false} icon={<UilNewspaper/>}
                        type='button'
                        addStyle={feedToolbarClass.leftTabButtons}
                        onClick={needsHook}
                    />
                    <Button text="Unanswered" keepText={false} icon={<UilQuestionCircle/>}
                        type='button'
                        addStyle={feedToolbarClass.leftTabButtons}
                        onClick={needsHook}
                    />
                </div>

                {/* Right: new post button */}
                <div className={feedToolbarClass.rightDiv}>
                    <Button text="New Post" keepText={false} icon={<UilPen/>}
                        type='button'
                        addStyle={feedToolbarClass.newPostButton}
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
