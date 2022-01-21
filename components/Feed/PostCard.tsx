import React from 'react';
import Image from 'next/image';
import { Avatar, Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { UilComment, UilThumbsUp, UilUpload, UilBookmark, UilEllipsisH } from '@iconscout/react-unicons';
import moment from 'moment'
import Button from '../Utils/Button';

// Styling
const postCardClass = "flex flex-col px-md pt-md pb-sm rounded-md \
    shadow-sm shadow-black/20 dark:shadow-black/60 dark:bg-neutralDark-500"
const headerClass = "inline-block md:inline-flex relative text-sm text-neutral-700 dark:text-neutralDark-150 \
    space-x-1 items-center"
const bodyClass = "flex flex-col ml-xl"
const engagementClass = "flex px-md mt-[36px] pb-md ml-xl w-3/5 justify-between text-sm"
const engagementButtonClass = "inline-flex items-center space-x-2 text-neutral-700 dark:text-neutralDark-150 \
    hover:text-neutral-800 dark:hover:text-neutralDark-50 focus:text-neutral-800 dark:focus:text-neutralDark-50 \
    active:text-primary"

// Helper components
const avatarURL =
        "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";
  
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
    name: string,
    message: string,
    email: string,
    postImage: string,
    image: string | null,
    timestamp: Date
};

const PostCard: React.FC<PostProps> = ({ name, message, email, postImage, image, timestamp }) => {
      
    // Placeholder for hooks until they are added
    const needsHook = () => {
        alert('This button needs a hook!')
    }

    return (
        <Card className={postCardClass}>
            {/* TODO: Refactor header into it's own component */}
            <div className={headerClass}>
                {/* Split into two rows on mobile */}
                <div className="inline-flex items-center md:flex">
                    {/* Avatar */}
                    <Avatar
                        onClick={needsHook}
                        className="h-[45px] w-[45px]" 
                        src={image ? image : avatarURL} 
                    />
                    
                    {/* User Name */}
                    <span className="pl-sm">{name ? name : email}</span>
                </div>

                <div className="inline-flex items-center  pl-[46px] md:pl-0 text-xs md:text-sm md:flex">
                    {/* Number of replies */}
                    {/* TODO: interpolate number below */}
                    <span className="hidden md:flex">{bull}</span> <p className='inline-flex'>0 <span className="hidden md:flex md:ml-1">Answers</span></p>
                    {bull} <p className="font-bold text-primary">Education</p>
                    {bull}
                    {/* Time stamp */}
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

            <CardContent className={bodyClass}>
                <Typography component={'h4'} className="font-bold mb-[8px] text-md text-neutral-800 dark:text-neutralDark-50">
                    Insert question here, make description the body.
                </Typography>
                <Typography className="text-neutral-700 dark:text-neutralDark-150 text-sm">
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
            <Box className={engagementClass}>
                {
                    engagementItems.map((item, idx) => (
                        <Button
                            key={idx}
                            addStyle={engagementButtonClass}
                            type='button'
                            onClick={needsHook}
                            icon={item.icon}
                            keepText={false}
                            text={item.text}
                        />
                    ))
                }
            </Box>
        </Card>
    );
};

export default PostCard;
