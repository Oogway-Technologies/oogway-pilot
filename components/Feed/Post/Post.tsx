import React, { useEffect, useState } from 'react';
import { db } from "../../../firebase";
import { postCardClass } from '../../../styles/feed';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import PostEngagementBar from './PostEngagementBar';
import PostHeader from './PostHeader';
import PostVotingMechanism from './PostVotingMechanism';
import CommentsAPI from '../Comments/CommentsAPI';

interface PostProps {
    authorUid: string,
    id: string,
    name: string,
    message: string,
    description: string | null,
    email: string,
    isCompare: boolean,
    userImage: string | null,
    postImage: string | null
    timestamp: Date,
    isCommentThread: boolean,
    comments:  null | any // Should be json object
};

const PostCard: React.FC<PostProps> = (
    { 
        authorUid,
        id,
        name,
        message,
        description,
        email,
        isCompare,
        postImage,
        userImage,
        timestamp,
        isCommentThread,
        comments
    }) => {

    // Track state for voting mechanism
    const [votesList, setVotesList] = useState([]);
    const [compareData, setCompareData] = useState([]);
    
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

    const isComparePost = (postData) => {
        return "compare" in postData;
    };

    return (
        <Card className={postCardClass.card}>
            {/* Header */}
            <PostHeader id={id} authorUid={authorUid} userImage={userImage} name={name} email={email} timestamp={timestamp}/>
            
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
            {isCompare && <PostVotingMechanism id={id} compareData={compareData} votesList={votesList}/>}

            {/* Engagement */}
            <PostEngagementBar id={id}/>

            {/* Comments */}
            {/* Note: pass the server-rendered comments to the panel */}
            {isCommentThread && <CommentsAPI comments={comments}/>}
        </Card>
    );
};

export default PostCard;
