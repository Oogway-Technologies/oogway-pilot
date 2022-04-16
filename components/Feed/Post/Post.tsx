import { FieldValue } from 'firebase/firestore'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import Linkify from 'react-linkify'

import { setJumpToComment } from '../../../features/utils/utilsSlice'
import { usePostNumberComments } from '../../../hooks/useNumberComments'
import { useAppDispatch } from '../../../hooks/useRedux'
import { streamPostData } from '../../../lib/postsHelper'
import { postCardClass } from '../../../styles/feed'
import { cardMediaStyle } from '../../../styles/utils'
import { isValidURL, parseYoutubeVideoId } from '../../../utils/helpers/common'
import { FirebasePost } from '../../../utils/types/firebase'
import { staticPostData } from '../../../utils/types/params'
import { Card } from '../../Utils/common/Card'
import CommentsAPI from '../Comments/CommentsAPI'
import PostEngagementBar from './PostEngagementBar'
import PostHeader from './PostHeader'
import PostVotingMechanism from './PostVotingMechanism'

interface PostProps {
    authorUid: string
    id: string
    name: string
    message: string
    description: string | null
    feed?: string | undefined
    isCompare: boolean
    postImage: string | null | undefined
    timestamp: FieldValue
    isCommentThread: boolean
    comments: null | any // Should be json object
    previewImage: string | null
    isAnonymous: boolean
    className?: string
}

const PostCard: React.FC<PostProps> = ({
    authorUid,
    id,
    name,
    message,
    description,
    feed,
    isCompare,
    postImage,
    timestamp,
    isCommentThread,
    comments,
    previewImage,
    isAnonymous,
    className,
}) => {
    // Track state for voting mechanism
    const [votesList, setVotesList] = useState(Array<number>())
    const [compareData, setCompareData] = useState([])
    const [URL, setURL] = useState<string>('')
    const [YouTubeURLID, setYouTubeURLID] = useState<string>('')

    // Track number of comments
    const [numComments] = usePostNumberComments(id)

    // Set params for child components
    const staticPostData: staticPostData = {
        authorUid: authorUid,
        id: id,
        isAnonymous: isAnonymous,
    }
    // Use useEffect to bind on document loading the
    // function that will listen for DB updates to the
    // setters of number of votes for a comparison
    // post
    useEffect(() => {
        // Store reference to snapshot{bull})
        const unsubscribe = streamPostData(
            id,
            snapshot => {
                const postData = snapshot.data()
                if (postData) {
                    // prevent error on compare post deletion
                    // Probably not a permanent fix, may want to
                    // look at listening only for changes in the children elements
                    // to avoid issues during post deletion

                    setURL(isValidURL(postData?.description))
                    setYouTubeURLID(
                        parseYoutubeVideoId(postData?.description) || ''
                    )

                    if (isComparePost(postData)) {
                        // Add a counter of votes for each object to compare.
                        // Note: this should generally be an array of 2 objects
                        const votesCounter = new Array(
                            postData.compare.votesObjMapList.length
                        ).fill(0)
                        for (let i = 0; i < votesCounter.length; i++) {
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
            err => {
                console.log(err)
            }
        )

        return () => unsubscribe()
    }, [id])

    const isComparePost = (postData: FirebasePost) => {
        return 'compare' in postData
    }

    return (
        <Card
            id={`post-${id}`}
            className={`${postCardClass.card} ${className ? className : ''}`}
            onClick={() => {
                useAppDispatch(setJumpToComment(`post-${id}`))
                router.push(`/comments/${id}`)
            }}
        >
            {/* Header */}
            <PostHeader
                id={id}
                authorUid={authorUid}
                name={name}
                numComments={numComments}
                feed={feed}
                timestamp={timestamp}
                isAnonymous={isAnonymous}
            />
            {/* Body */}
            <div className={postCardClass.body}>
                <h4 className={postCardClass.bodyQuestion}>{message}</h4>
                {URL && URL.length > 0 ? (
                    <Linkify
                        componentDecorator={(
                            decoratedHref,
                            decoratedText,
                            key
                        ) => (
                            <a
                                className={
                                    postCardClass.bodyDescription +
                                    ' hover:underline'
                                }
                                target="blank"
                                href={decoratedHref}
                                key={key}
                            >
                                {decoratedText}
                            </a>
                        )}
                    >
                        <p className={postCardClass.bodyDescription}>
                            {description}
                        </p>
                    </Linkify>
                ) : (
                    <p className={postCardClass.bodyDescription}>
                        {description}
                    </p>
                )}
            </div>
            {/* Media */}
            {postImage ? (
                <div className={'flex p-md mx-xl'}>
                    <img
                        src={postImage}
                        className={
                            'block w-full max-w-full h-auto align-middle bg-center bg-no-repeat bg-cover rounded-lg'
                        }
                    />
                </div>
            ) : YouTubeURLID && YouTubeURLID.length > 0 ? (
                <div className="flex object-contain justify-center p-md ml-xl h-60">
                    <iframe
                        src={`https://www.youtube.com/embed/${YouTubeURLID}`}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title="video"
                        className="w-auto"
                    />
                </div>
            ) : (
                previewImage &&
                previewImage.length > 2 && (
                    <div className="flex p-md mx-xl">
                        <img
                            src={previewImage}
                            alt="banner"
                            className={cardMediaStyle}
                        />
                    </div>
                )
            )}
            {/* Voting for compare posts */}
            {isCompare && (
                <PostVotingMechanism
                    authorUid={authorUid}
                    id={id}
                    compareData={compareData}
                    votesList={votesList}
                />
            )}
            {/* Engagement */}
            <PostEngagementBar
                id={id}
                authorUid={authorUid}
                numComments={numComments}
            />

            {/* Comments */}
            {/* Note: pass the server-rendered comments to the panel */}
            {isCommentThread && (
                <CommentsAPI
                    comments={comments}
                    parentPostData={staticPostData}
                />
            )}
        </Card>
    )
}

export default PostCard
