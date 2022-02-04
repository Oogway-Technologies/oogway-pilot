import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { UilComment, UilThumbsUp, UilUpload, UilBookmark, UilEllipsisH, UilCircle, UilCheckCircle } from '@iconscout/react-unicons';
import moment from 'moment';
import Button from '../Utils/Button';
import PostOptionsDropdown from './PostOptionsDropdown';

// Database
import { auth, db, storage } from "../../firebase";


// Styling
const postCardClass = {
    card: "flex flex-col px-md pt-md pb-sm rounded-md shadow-sm shadow-black/20 dark:shadow-black/60 \
        dark:bg-neutralDark-500",
    // Header
    header: "inline-block md:inline-flex relative text-sm text-neutral-700 dark:text-neutralDark-150 \
        space-x-1 items-center",
    headerMobileRowOne: "inline-flex items-center md:flex",
    headerMobileRowTwo: "inline-flex items-center  pl-[46px] md:pl-0 text-xs md:text-sm md:flex",
    // Body
    body: "flex flex-col ml-xl",
    bodyQuestion: "font-bold mb-[8px] text-md text-neutral-800 dark:text-neutralDark-50",    
    bodyDescription: "text-neutral-700 dark:text-neutralDark-150 text-sm",
    // Media
    voteDiv: "flex px-2 space-x-md",
    voteContainer: "flex flex-col w-full items-center",
    imageVote: "flex rounded-[8px]  object-contain",
    textVote: "flex rounded-[8px] border border-solid border-primary p-xl \
        text-sm text-primary dark:text-primaryDark",
    voteButton: "p-sm justify-center text-neutral-700 dark:text-neutralDark-150 \
        hover:text-primary dark:hover:text-primary active:text-primary dark:active:text-primary \
        focus:text-primary dark:focus:text-primary text-sm",
    voteCounter: "text-sm text-neutral-700 dark:text-neutralDark-150",
    // Engagement
    engagementBar: "flex px-md mt-[36px] pb-md ml-xl w-3/5 justify-between text-sm",
    engagementButton: "inline-flex items-center space-x-2 text-neutral-700 dark:text-neutralDark-150 \
        hover:text-neutral-800 dark:hover:text-neutralDark-50 focus:text-neutral-800 dark:focus:text-neutralDark-50 \
        active:text-primary"

}

// Bullet point
const bull = (
    <Box
      component="span"
      className="text-neutral-300 px-sm"
      sx={{ display: 'inline-block', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

interface PostProps {
    postUid: string,
    id: string,
    name: string,
    message: string,
    description: string | null,
    email: string,
    isCompare: boolean,
    userImage: string | null,
    postImage: string | null
    timestamp: Date
};

const PostCard: React.FC<PostProps> = ({ postUid, id, name, message, description, email, isCompare, postImage, userImage, timestamp }) => {
    // Use the router to redirect the user to the comments page
    const router = useRouter();
    const [user] = useAuthState(auth);

    // Track state for voting mechanism
    const [votesList, setVotesList] = useState([]);
    const [compareData, setCompareData] = useState([]);
    const [voteButtonLeft, setVoteButtonLeft] = useState(<UilCircle/>);
    const [voteButtonRight, setVoteButtonRight] = useState(<UilCircle/>);

    const avatarURL =
        "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

    // Use useEffect to bind on document loading the
    // function that will listen for DB updates to the
    // setters of number of votes for a comparison
    // post
    useEffect(() => {
        // Store reference to snapshot
        db.collection("posts")
            .doc(id)
            .onSnapshot((snapshot) => {
                const postData = snapshot.data();
                if (postData) { // prevent error on compare post deletion
                                // Probably not a permanent fix, may want to 
                                // look at listening only for changes in the children elements
                                // to avoid issues during post deletion
                    if (isComparePost(postData)) {
                        // Add a counter of votes for each object to compare.
                        // Note: this should generally be an array of 2 objects
                        let votesCounter = new Array(
                            postData.compare.votesObjMapList.length
                        ).fill(0);
                        for (var i = 0; i < votesCounter.length; i++) {
                            votesCounter[i] = Object.keys(
                            postData.compare.votesObjMapList[i]
                            ).length;
                        }
    
                        // Update the vote counter
                        setVotesList(votesCounter);
    
                        // Add compare data to state
                        setCompareData(postData.compare.objList);
                    }
                }
            });

    }, []);

    // Event hooks
    // Placeholder for hooks until they are added
    const needsHook = () => {
        alert('This button needs a hook!')
    }

    const voteOnImage = (objIdx) => {
        // Add a vote, for this user, to one of the images
        var docRef = db.collection("posts").doc(id);

        return db.runTransaction((transaction) => {
            return transaction.get(docRef).then((doc) => {
                const postData = doc.data();
                if (isComparePost(postData)) {
                    // This is probably not needed (vote is only enabled on compare posts)
                    // Different scenarios to consider
                    for (var i = 0; i < postData.compare.votesObjMapList.length; i++) {
                        // Case 1: the user voted for an object in the past
                        if (user.uid in postData.compare.votesObjMapList[i]) {
                            // Case 1.a: the user voted again on same object -> nothing to do
                            if (i === objIdx) {
                                return;
                            }

                            // Case 1.b: the user voted again on different object -> switch votes
                            delete postData.compare.votesObjMapList[i][user.uid];
                            postData.compare.votesObjMapList[objIdx][user.uid] = true;
                            transaction.update(docRef, postData);
                            return;
                        }
                    }
                    // Case 2: this is the first time for the user voting on this object
                    postData.compare.votesObjMapList[objIdx][user.uid] = true;
                    transaction.update(docRef, postData);
                }
            });
        });
    };

    const enterComments = () => {
        router.push(`/comments/${id}`);
    };

    const isComparePost = (postData) => {
        return "compare" in postData;
    };

    const updateVoteButton = (idx) => {
        // Exit early if the index doesn't map to left (0)/ right (1)
        if (![0, 1].includes(idx)) return;
        else if (idx == 0) {
            // If voting on left, set left to check and set right to empty
            setVoteButtonLeft(<UilCheckCircle/>)
            setVoteButtonRight(<UilCircle/>)
        } else {
            // Do the same for right
            setVoteButtonRight(<UilCheckCircle/>)
            setVoteButtonLeft(<UilCircle/>)
        }
    }

    // Deletes a post
    const deletePost = () => {
        db.collection("posts")
        .doc(id)
        .delete()
        .catch((err) => { console.log("Cannot delete post: ", err) });

        // Update the user's posts list
        db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
            let tmp = doc.data();
            const index = tmp.posts.indexOf(id);
            if (index > -1) {
                tmp.posts.splice(index, 1);
                doc.ref.update(tmp);
            }
        })

        // Delete the post's media, if any
        storage.ref(`posts/${id}`).listAll().then((listResults) => {
            const promises = listResults.items.map((item) => {
                return item.delete();
            });
            Promise.all(promises);
        });

        return true
    }

    // Sub-components
    // Extract header from the card to simplify JSX
    const PostHeader = (
            {userImage, name, email, timestamp}: {
                userImage: string | null,
                name: string | null,
                email: string,
                timestamp: Date | null
            }
        ) => {
        return <div className={postCardClass.header}>
                    {/* Split into two rows on mobile */}
                    <div className={postCardClass.headerMobileRowOne}>
                        {/* Avatar */}
                        <Avatar
                            onClick={needsHook}
                            className="h-[45px] w-[45px] cursor-pointer" 
                            src={userImage ? userImage : avatarURL} 
                        />

                        {/* User Name */}
                        <span className="pl-sm">{name ? name : email}</span>
                    </div>

                    <div className={postCardClass.headerMobileRowTwo}>
                        {/* Number of replies */}
                        {/* TODO: interpolate number below */}
                        <span className="hidden md:flex">{bull}</span> 
                        <p className='inline-flex'>0 <span className="hidden md:flex md:ml-1">Answers</span></p>
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
                                <p className="inline-flex text-neutral-700 dark:text-neutralDark-50">
                                    loading
                                </p>
                            )
                        }
                    </div>

                    {/* More Button */}
                    <PostOptionsDropdown postUid={postUid} authorName={name ? name : email} deletePost={deletePost}/>
                </div>
    }

    // UI functional component for the voting mechanism
    // Takes in the compare object and it's index in the array
    // to assign votes to correct object.
    const DisplayVoteOnImage = ({compareData, votesList}: {compareData: Array<T>, votesList: Array<T>}) => {
        return <div className={postCardClass.voteDiv}>
                {
                    compareData.map(
                        (obj, idx) => {
                            return <div key={idx} className={postCardClass.voteContainer}>
                                    {obj.type == 'image' ? (
                                        <img 
                                        className={postCardClass.imageVote} 
                                        src={obj.value}
                                        alt=''/>
                                    ) : (
                                        <p className={postCardClass.textVote}>
                                            {obj.value}
                                        </p>
                                    )}
                                    <button
                                        className={postCardClass.voteButton}
                                        onClick={() => {
                                            voteOnImage(idx);
                                            updateVoteButton(idx);
                                        }}
                                    >
                                        {(idx == 0) ? voteButtonLeft : voteButtonRight }
                                    </button>
                                    <p className={postCardClass.voteCounter}>
                                        {votesList[idx]} {(votesList[idx] == 1) ? 'vote' : 'votes'}
                                    </p> 
                                </div> 
                        }
                    )
                }
                </div>

    }

    // Extract engagement bar to simplify JSX
    const EngagementBar = () => {
        const engagementItems = [
            {
                icon: <UilComment/>,
                text: 'Answer',
                onClick: enterComments
            },
            {
                icon: <UilThumbsUp/>,
                text: 'Like',
                onClick: needsHook
            },
            {
                icon: <UilUpload/>,
                text: 'Share',
                onClick: needsHook
            },
            {
                icon: <UilBookmark/>,
                text: 'Save',
                onClick: needsHook
            },
        ]

        return <Box className={postCardClass.engagementBar}>
                    {
                        engagementItems.map((item, idx) => (
                            <Button
                                key={idx}
                                addStyle={postCardClass.engagementButton}
                                type='button'
                                onClick={item.onClick}
                                icon={item.icon}
                                keepText={false}
                                text={item.text}
                            />
                        ))
                    }
                </Box>
    }

    return (
        <Card className={postCardClass.card}>
            {/* Header */}
            <PostHeader userImage={userImage} name={name} email={email} timestamp={timestamp}/>
            
            {/* Body */}
            <CardContent className={postCardClass.body}>
                <Typography component={'h4'} className={postCardClass.bodyQuestion}>
                    {message}
                </Typography>
                <Typography className={postCardClass.bodyDescription}>
                    {description}
                </Typography>
            </CardContent>
            
            {/* Media */}
            {postImage && <div className="flex ml-xl p-md"><CardMedia component="img" src={postImage}/></div>}

            {/* Voting for compare posts */}
            {isCompare && <DisplayVoteOnImage compareData={compareData} votesList={votesList}/>}

            {/* Engagement */}
            <EngagementBar/>
        </Card>
    );
};

export default PostCard;
