import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'
import { postCardClass } from '../../../styles/feed'
// @ts-ignore
import { UilCheckCircle, UilCircle } from '@iconscout/react-unicons'
import { userProfileState } from '../../../atoms/user'
import { useRecoilValue } from 'recoil'
import { streamPostData } from '../../../lib/postsHelper'
import { useUser } from '@auth0/nextjs-auth0'
import Linkify from 'react-linkify'
import { isValidURL, parseYoutubeVideoId } from '../../../utils/helpers/common'
import { MediaObject } from '../../../utils/types/global'
import YoutubeEmbed from '../../Utils/YoutubeEmbed'

type PostVotingMechanismProps = {
    id: string
    compareData: Array<MediaObject>
    votesList: number[]
}

const PostVotingMechanism = ({
    id,
    compareData,
    votesList,
}: PostVotingMechanismProps) => {
    const { user } = useUser()
    const userProfile = useRecoilValue(userProfileState)

    // Track voting button state
    const [winningChoice, setWinningChoice] = useState(-1) // Instantiate to value that's not possible
    const [userVoteChoice, setUserVoteChoice] = useState(-1) // Instantiate to value that's never in index
    const [voteButtonLeft, setVoteButtonLeft] = useState(<UilCircle />)
    const [voteButtonRight, setVoteButtonRight] = useState(<UilCircle />)

    // Track winning choice
    useEffect(() => {
        if (votesList[0] > votesList[1]) setWinningChoice(0)
        else if (votesList[1] > votesList[0]) setWinningChoice(1)
        else setWinningChoice(-1) // reset to default in event of a tie
    }, [votesList])

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
            },
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
        let docRef = db.collection('posts').doc(id)

        return db.runTransaction(async transaction => {
            const doc = await transaction.get(docRef)
            const postData = doc.data()
            if (postData) {
                for (
                    var i = 0;
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

    return (
        <div className={postCardClass.voteDiv}>
            {compareData.map((obj, idx) => {
                return (
                    <div key={idx} className={postCardClass.voteContainer}>
                        {obj.image && obj.image.length > 1 ? (
                            <div className="flex h-full">
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
                        ) : parseYoutubeVideoId(obj.text) ? (
                            <YoutubeEmbed text={obj.text} />
                        ) : (
                            obj.previewImage &&
                            obj.previewImage.length > 1 && (
                                <div className="flex h-full">
                                    <img
                                        className={
                                            postCardClass.imageVote +
                                            (!user ? ' cursor-default' : '')
                                        }
                                        src={obj.previewImage}
                                        onClick={() => {
                                            voteOnImage(idx)
                                        }}
                                        alt=""
                                    />
                                </div>
                            )
                        )}
                        {isValidURL(obj.text) ? (
                            <Linkify
                                componentDecorator={(
                                    decoratedHref,
                                    decoratedText,
                                    key,
                                ) => (
                                    <a
                                        className={
                                            postCardClass.textVote +
                                            (user
                                                ? ' cursor-pointer'
                                                : ' cursor-default') +
                                            (userVoteChoice === idx
                                                ? ' text-primary dark:text-primaryDark font-bold'
                                                : ' text-neutral-700 dark:text-neutralDark-150') +
                                            (obj.text.split('').length > 20 &&
                                            isValidURL(obj.text)
                                                ? ' text-start truncate w-full p-sm'
                                                : ' text-center inline-flex w-full justify-center p-sm')
                                        }
                                        style={{ overflow: 'clip' }}
                                        target="blank"
                                        href={decoratedHref}
                                        key={key}
                                        onClick={() => {
                                            voteOnImage(idx)
                                        }}
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
                                <div
                                    className={
                                        postCardClass.textVote +
                                        (user
                                            ? ' cursor-pointer'
                                            : ' cursor-default') +
                                        (userVoteChoice === idx
                                            ? ' text-primary dark:text-primaryDark font-bold'
                                            : ' text-neutral-700 dark:text-neutralDark-150') +
                                        (obj.text.split('').length > 20
                                            ? ' text-start truncate w-full p-sm'
                                            : ' inline-flex w-full justify-center p-sm')
                                    }
                                    onClick={() => {
                                        voteOnImage(idx)
                                    }}
                                >
                                    {obj.text}
                                </div>
                            )
                        )}
                        {user && (
                            <div
                                className={
                                    postCardClass.voteButtonContainer +
                                    (winningChoice === idx &&
                                    userVoteChoice != -1
                                        ? ' shadow-lg shadow-black/10 dark:shadow-neutralDark-150/20'
                                        : '')
                                }
                            >
                                <button
                                    className={
                                        postCardClass.voteButton +
                                        (!user && ' cursor-default') +
                                        (userVoteChoice === idx
                                            ? ' text-primary dark:text-primaryDark'
                                            : ' text-neutral-700 dark:text-neutralDark-150')
                                    }
                                    onClick={() => {
                                        voteOnImage(idx)
                                    }}
                                >
                                    {idx == 0
                                        ? voteButtonLeft
                                        : voteButtonRight}
                                </button>
                                {userVoteChoice != -1 && (
                                    <p className={postCardClass.voteCounter}>
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
