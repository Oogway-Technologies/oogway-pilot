import React, {useEffect, useState} from 'react'
import {postCardClass} from '../../../styles/feed'
import {Card, CardContent, CardMedia, Link, Typography} from '@mui/material'
import PostEngagementBar from './PostEngagementBar'
import PostHeader from './PostHeader'
import PostVotingMechanism from './PostVotingMechanism'
import CommentsAPI from '../Comments/CommentsAPI'
import {streamPostData} from '../../../lib/postsHelper'
import Linkify from 'react-linkify';
import {isValidURL, parseYoutubeVideoId} from "../../../utils/helpers/common";
import {FirebasePost} from '../../../utils/types/firebase'
import {FieldValue} from 'firebase/firestore'

interface PostProps {
    authorUid: string
    id: string | undefined
    name: string
    message: string
    description: string | null
    isCompare: boolean
    postImage: string | null | undefined
    timestamp: FieldValue
    isCommentThread: boolean
    comments: null | any // Should be json object
    previewImage: string | null
}

const PostCard: React.FC<PostProps> = ({
                                           authorUid,
                                           id,
                                           name,
                                           message,
                                           description,
                                           isCompare,
                                           postImage,
                                           timestamp,
                                           isCommentThread,
                                           comments,
                                           previewImage
                                       }) => {
    // Track state for voting mechanism
    const [votesList, setVotesList] = useState([])
    const [compareData, setCompareData] = useState([])
    const [URL, setURL] = useState<string>('');
    const [YouTubeURLID, setYouTubeURLID] = useState<string>('');

    // Use useEffect to bind on document loading the
    // function that will listen for DB updates to the
    // setters of number of votes for a comparison
    // post
    useEffect(() => {
        // Store reference to snapshot
        const unsubscribe = streamPostData(
            id,
            (snapshot) => {
                const postData = snapshot.data()
                if (postData) {
                    // prevent error on compare post deletion
                    // Probably not a permanent fix, may want to
                    // look at listening only for changes in the children elements
                    // to avoid issues during post deletion

                    setURL(isValidURL(postData?.description));
                    setYouTubeURLID(parseYoutubeVideoId(postData?.description));

                    if (isComparePost(postData)) {
                        // Add a counter of votes for each object to compare.
                        // Note: this should generally be an array of 2 objects
                        let votesCounter = new Array(
                            postData.compare.votesObjMapList.length
                        ).fill(0)
                        for (var i = 0; i < votesCounter.length; i++) {
                            votesCounter[i] = Object.keys(
                                postData.compare.votesObjMapList[i]
                            ).length
                        }

                        // Update the vote counter
                        setVotesList(votesCounter)

                        // Add compare data to state
                        setCompareData(postData.compare.objList)
                    }
                }
            },
            (err) => {
                console.log(err)
            }
        )

        return () => unsubscribe()
    }, [id])

    const isComparePost = (postData: FirebasePost) => {
        return 'compare' in postData
    }

    return (
        <Card className={postCardClass.card}>
            {/* Header */}
            <PostHeader
                id={id}
                authorUid={authorUid}
                name={name}
                timestamp={timestamp}
            />

            {/* Body */}
            <CardContent className={postCardClass.body}>
                <Typography
                    component={'h4'}
                    className={postCardClass.bodyQuestion}
                >
                    {message}
                </Typography>
                {(URL && URL.length > 0) ?
                    <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                        <Link className={postCardClass.bodyDescription} target="blank" href={decoratedHref} key={key}>
                            {decoratedText}
                        </Link>
                    )}
                    >{description}</Linkify> :
                    <Typography className={postCardClass.bodyDescription}>
                        {description}
                    </Typography>
                }

            </CardContent>

            {/* Media */}
            {postImage ? (
                <div className="flex ml-xl p-md">
                    <CardMedia component="img" src={postImage}/>
                </div>
            ) : (YouTubeURLID && YouTubeURLID.length > 0) ? (
                <div className="flex ml-xl p-md">
                    <iframe
                        width="800"
                        height="400"
                        src={`https://www.youtube.com/embed/${YouTubeURLID}`}
                        frameBorder='0'
                        allow='autoplay; encrypted-media'
                        allowFullScreen
                        title='video'
                    />
                </div>
            ) : (previewImage && previewImage.length > 2) && (
                <div className="flex ml-xl p-md">
                    <CardMedia component="img" src={previewImage} alt="banner"/>
                </div>
            )
            }

            {/* Voting for compare posts */}
            {isCompare && (
                <PostVotingMechanism
                    id={id}
                    compareData={compareData}
                    votesList={votesList}
                />
            )}

            {/* Engagement */}
            <PostEngagementBar id={id}/>

            {/* Comments */}
            {/* Note: pass the server-rendered comments to the panel */}
            {isCommentThread && <CommentsAPI comments={comments}/>}
        </Card>
    )
}

export default PostCard
