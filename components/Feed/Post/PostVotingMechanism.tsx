import { useUser } from '@auth0/nextjs-auth0'
import { UilCheckCircle, UilCircle } from '@iconscout/react-unicons'
import React, { useEffect, useState } from 'react'
import Linkify from 'react-linkify'

import { db } from '../../../firebase'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppSelector } from '../../../hooks/useRedux'
import { streamPostData } from '../../../lib/postsHelper'
import { useCreateEngagemmentActivity } from '../../../queries/engagementActivity'
import { postCardClass } from '../../../styles/feed'
import { truncateLength } from '../../../utils/constants/global'
import {
    isValidURL,
    parseYoutubeVideoId,
    winnerCall,
} from '../../../utils/helpers/common'
import { FirebaseEngagement } from '../../../utils/types/firebase'
import { MediaObject } from '../../../utils/types/global'
import YoutubeEmbed from '../../Utils/YoutubeEmbed'

type PostVotingMechanismProps = {
    authorUid: string
    id: string
    compareData: Array<MediaObject>
    votesList: number[]
}

const PostVotingMechanism = ({
    authorUid,
    id,
    compareData,
    votesList,
}: PostVotingMechanismProps) => {
    const { user } = useUser()
    const isMobile = useMediaQuery('(max-width: 965px)')
    const userProfile = useAppSelector(state => state.userSlice.user)

    // Update notifications
    const engagementMutation = useCreateEngagemmentActivity(authorUid)

    // Track voting button state
    const [userVoteChoice, setUserVoteChoice] = useState<number>(-1) // Instantiate to value that's never in index
    const [voteButtonLeft, setVoteButtonLeft] = useState<JSX.Element>(
        <UilCircle />
    )
    const [voteButtonRight, setVoteButtonRight] = useState<JSX.Element>(
        <UilCircle />
    )

    // track user vote choice
    useEffect(() => {
        const unsubscribe = streamPostData(
            id,
            snapshot => {
                const postData = snapshot.data()
                // prevent error on compare post deletion
                if (postData) {
                    // Probably not a permanent fix, may want to
                    // look at listening only for changes in the children elements
                    // to avoid issues during post deletion
                    // Only gets mounted when post isCompare so we don't need to worry
                    // that postData.compare does not exist
                    // if current user is a voter of left object
                    if (
                        postData.compare.votesObjMapList[0] &&
                        userProfile.uid in postData.compare.votesObjMapList[0]
                    ) {
                        setUserVoteChoice(0)
                        setVoteButtonLeft(<UilCheckCircle />)
                        setVoteButtonRight(<UilCircle />)
                    }
                    // if current user is a voter of right object
                    else if (
                        postData.compare.votesObjMapList[1] &&
                        userProfile.uid in postData.compare.votesObjMapList[1]
                    ) {
                        setUserVoteChoice(1)
                        setVoteButtonRight(<UilCheckCircle />)
                        setVoteButtonLeft(<UilCircle />)
                    }
                    // if current user is not a voter
                    else {
                        setUserVoteChoice(-1)
                        setVoteButtonLeft(<UilCircle />)
                        setVoteButtonRight(<UilCircle />)
                    }
                }
            },
            error => {
                console.log(error)
            }
        )

        // Stop listening
        return unsubscribe
    }, [id, userProfile])

    // Event hooks
    // TODO: refactor to firebase v9+
    const voteOnImage = (objIdx: number) => {
        // Do not vote if user is not logged in
        if (!user) return
        // Add a vote, for this user, to one of the images
        const docRef = db.collection('posts').doc(id)

        return db.runTransaction(async transaction => {
            const doc = await transaction.get(docRef)
            const postData = doc.data()
            if (postData) {
                for (
                    let i = 0;
                    i < postData.compare.votesObjMapList.length;
                    i++
                ) {
                    // Case 1: the user voted for an object in the past
                    if (
                        userProfile.uid in postData.compare.votesObjMapList[i]
                    ) {
                        // delete vote for the old index
                        delete postData.compare.votesObjMapList[i][
                            userProfile.uid
                        ]
                        if (i !== objIdx) {
                            // if new index is different from old index, set vote
                            postData.compare.votesObjMapList[objIdx][
                                userProfile.uid
                            ] = true
                        }
                        transaction.update(docRef, postData)
                        return
                    }
                }
                // Case 2: this is the first time for the user voting on this object
                postData.compare.votesObjMapList[objIdx][userProfile.uid] = true
                transaction.update(docRef, postData)
            }
        })
    }

    const voteHandler = (idx: number) => {
        // Send vote
        voteOnImage(idx)

        // Create engagement notification
        const engagement: FirebaseEngagement = {
            engagerId: userProfile.uid,
            engageeId: authorUid,
            action: 'vote',
            targetId: id,
            targetObject: 'Poll',
            targetRoute: `comments/${id}`,
            isNew: true,
        }
        engagementMutation.mutate(engagement)
    }

    return (
        <div className={postCardClass.voteDiv}>
            {compareData.map((obj: MediaObject, idx: number) => {
                return (
                    <div key={idx} className={postCardClass.voteContainer}>
                        {obj.image && obj.image.length > 1 ? (
                            <div className="w-full h-fit">
                                {/* Image of compare */}
                                <div
                                    className="flex justify-center items-center"
                                    style={{
                                        height: isMobile ? '11rem' : '16rem',
                                    }}
                                >
                                    <img
                                        className={
                                            postCardClass.imageVote +
                                            (!user ? ' cursor-default' : '')
                                        }
                                        src={obj.image}
                                        onClick={() => {
                                            voteOnImage(idx)
                                        }}
                                        alt=""
                                    />
                                </div>
                                {/* If the compare image has a label */}
                                {obj.label && (
                                    <div
                                        className={
                                            postCardClass.textVote + ' mt-sm'
                                        }
                                    >
                                        <div
                                            className={
                                                'inline-flex justify-center p-sm w-full'
                                            }
                                        >
                                            {obj.label}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : parseYoutubeVideoId(obj.text) ? (
                            // if the compare item is a youtube link
                            <YoutubeEmbed text={obj.text} />
                        ) : (
                            obj.previewImage &&
                            obj.previewImage.length > 1 && (
                                <div className="flex h-full">
                                    {/* if the compare item is an image preview which is generated by posting a link */}
                                    <img
                                        className={
                                            postCardClass.imageVote +
                                            (!user ? ' cursor-default' : '')
                                        }
                                        src={obj.previewImage}
                                        onClick={() => voteHandler(idx)}
                                        alt=""
                                    />
                                </div>
                            )
                        )}
                        {/* image bottom text */}
                        {isValidURL(obj.text) ? (
                            // if the text is a link
                            <Linkify
                                componentDecorator={(
                                    decoratedHref,
                                    decoratedText,
                                    key
                                ) => (
                                    <a
                                        className={
                                            postCardClass.textVote +
                                            (user
                                                ? ' cursor-pointer'
                                                : ' cursor-default') +
                                            'text-neutral-700 dark:text-neutralDark-150 hover:underline' +
                                            // string truncate logic
                                            (obj.text.split('').length >
                                            truncateLength
                                                ? ' text-start truncate w-full p-sm'
                                                : ' inline-flex w-full justify-center p-sm whitespace-nowrap')
                                        }
                                        target="blank"
                                        href={decoratedHref}
                                        key={key}
                                        onClick={() => voteHandler(idx)}
                                    >
                                        {decoratedText}
                                    </a>
                                )}
                            >
                                {obj.text}
                            </Linkify>
                        ) : (
                            obj.text &&
                            obj.text.length > 0 && (
                                <span
                                    className={
                                        postCardClass.textVote +
                                        (user
                                            ? ' cursor-pointer'
                                            : ' cursor-default') +
                                        'text-neutral-700 dark:text-neutralDark-150 inline-flex w-full justify-center p-sm'
                                    }
                                    onClick={() => voteHandler(idx)}
                                >
                                    {obj.text}
                                </span>
                            )
                        )}
                        {/* buttons for voting */}
                        {user && (
                            <div className={postCardClass.voteButtonContainer}>
                                <button
                                    className={
                                        postCardClass.voteButton +
                                        (!user && ' cursor-default')
                                    }
                                    onClick={() => voteHandler(idx)}
                                >
                                    {idx == 0
                                        ? voteButtonLeft
                                        : voteButtonRight}
                                </button>
                                {(userVoteChoice != -1 ||
                                    authorUid == userProfile.uid) && (
                                    <p
                                        className={
                                            postCardClass.voteCounter +
                                            (winnerCall(votesList) === idx &&
                                            userVoteChoice != -1
                                                ? ' text-primary dark:text-primaryDark'
                                                : ' text-neutral-700 dark:text-neutralDark-150')
                                        }
                                    >
                                        {votesList[idx]}{' '}
                                        {votesList[idx] == 1 ? 'vote' : 'votes'}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default PostVotingMechanism
