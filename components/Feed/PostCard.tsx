import React from 'react';
import Image from 'next/image';
import { Avatar, Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { UilComment, UilThumbsUp, UilUpload, UilBookmark, UilEllipsisH } from '@iconscout/react-unicons';
import moment from 'moment'
import Button from '../Utils/Button';

// === IMPORTS FOR DELETE POST ==== //
import { XIcon } from "@heroicons/react/solid";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../../firebase";
// ======== //

// Styling
const postCardClass = {
    card: "flex flex-col px-md pt-md pb-sm rounded-md shadow-sm shadow-black/20 dark:shadow-black/60 \
        dark:bg-neutralDark-500",
    header: "inline-block md:inline-flex relative text-sm text-neutral-700 dark:text-neutralDark-150 \
        space-x-1 items-center",
    headerMobileRowOne: "inline-flex items-center md:flex",
    headerMobileRowTwo: "inline-flex items-center  pl-[46px] md:pl-0 text-xs md:text-sm md:flex",
    body: "flex flex-col ml-xl",
    bodyQuestion: "font-bold mb-[8px] text-md text-neutral-800 dark:text-neutralDark-50",
    bodyDescription: "text-neutral-700 dark:text-neutralDark-150 text-sm",
    engagementBar: "flex px-md mt-[36px] pb-md ml-xl w-3/5 justify-between text-sm",
    engagementButton: "inline-flex items-center space-x-2 text-neutral-700 dark:text-neutralDark-150 \
        hover:text-neutral-800 dark:hover:text-neutralDark-50 focus:text-neutral-800 dark:focus:text-neutralDark-50 \
        active:text-primary"

}

// Helper vars
const bull = (
    <Box
      component="span"
      className="text-neutral-300 px-sm"
      sx={{ display: 'inline-block', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

const engagementItems = [
    {
        icon: <UilComment/>,
        text: 'Answer'
    },
    {
        icon: <UilThumbsUp/>,
        text: 'Like'
    },
    {
        icon: <UilUpload/>,
        text: 'Share'
    },
    {
        icon: <UilBookmark/>,
        text: 'Save'
    },
]

interface PostProps {
    postOwner: string,
    id: string,
    name: string,
    message: string,
    email: string,
    postImage: string,
    image: string | null,
    timestamp: Date
};

const PostCard: React.FC<PostProps> = ({postOwner, id, name, message, email, postImage, image, timestamp }) => {
    const [user] = useAuthState(auth);
    const avatarURL =
        "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

    // Placeholder for hooks until they are added
    const needsHook = () => {
        alert('This button needs a hook!')
    }

    // Deletes a post
    const deletePost = () => {
        // OPEN A MODAL OR ASK THE USER IF HE/SHE IS SURE TO DELETE THE POST
        db.collection("posts")
        .doc(id)
        .delete()
        .catch((err) => { console.log("Cannot delete post: ", err) });
    }

    return (
        <Card className={postCardClass.card}>
            {/* TODO: Refactor header into it's own component */}
            <div className={postCardClass.header}>
                {/* Split into two rows on mobile */}
                <div className={postCardClass.headerMobileRowOne}>
                    {/* Avatar */}
                    <Avatar
                        onClick={needsHook}
                        className="h-[45px] w-[45px]" 
                        src={image ? image : avatarURL} 
                    />
                    
                    {/* User Name */}
                    <span className="pl-sm">{name ? name : email}</span>
                </div>

                <div className={postCardClass.headerMobileRowTwo}>
                    {/* Number of replies */}
                    {/* TODO: interpolate number below */}
                    <span className="hidden md:flex">{bull}</span> <p className='inline-flex'>0 <span className="hidden md:flex md:ml-1">Answers</span></p>
                    {/* TODO: interpolate post category below */}
                    {bull} <p className="font-bold text-primary">Education</p>
                    {bull}
                    {/* Time stamp 
                        TODO: Make into separate utillity
                    */}
                    {
                        timestamp ? (
                            <p>
                                {moment(new Date(timestamp?.toDate()).toLocaleString()).fromNow()}
                            </p>
                        ) : (
                            // Do this for prefetching from server-side
                            <>Loading</>
                        )
                    }
                </div>

                {/* More Button */}
                <button className="absolute top-sm right-sm text-neutral-700 cursor-pointer">
                    <UilEllipsisH onClick={needsHook}/>
                </button>
            </div>

            <CardContent className={postCardClass.body}>
                <Typography component={'h4'} className={postCardClass.bodyQuestion}>
                    Insert question here, make description the body.
                </Typography>
                <Typography className={postCardClass.bodyDescription}>
                {message}
                </Typography>
            </CardContent>
            
            {/* Media */}
            {postImage && (
                <div className="flex ml-xl p-md">
                    <CardMedia component="img" src={postImage}/>
                </div>
            )}

            {/* Engagement */}
            <Box className={postCardClass.engagementBar}>
                {
                    engagementItems.map((item, idx) => (
                        <Button
                            key={idx}
                            addStyle={postCardClass.engagementButton}
                            type='button'
                            onClick={needsHook}
                            icon={item.icon}
                            keepText={false}
                            text={item.text}
                        />
                    ))
                }
            </Box>
            
            {/* Show cancel button only for the user owning the post */}
            {/* THIS CAN GO IN THE "..." TOP RIGHT OR WHEREVER MAKES SENSE */}
            {user?.uid === postOwner ? (
                <XIcon
                className="h-7 sm:mr-3 text-gray-500 cursor-pointer 
                transition duration-100 transform hover:scale-125"
                onClick={deletePost}
            />
            ) : (null)}


        </Card>
    );
};

export default PostCard;
