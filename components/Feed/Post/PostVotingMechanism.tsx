import React, {useEffect, useState} from 'react'
import {db} from '../../../firebase'
import {postCardClass} from '../../../styles/feed'
import {UilCheckCircle, UilCircle} from '@iconscout/react-unicons'
import {userProfileState} from '../../../atoms/user'
import {useRecoilValue} from 'recoil'
import {streamPostData} from '../../../lib/postsHelper'
import {useUser} from '@auth0/nextjs-auth0'
import Linkify from 'react-linkify';
import {isValidURL} from "../../../utils/helpers/common";

type PostVotingMechanismProps = {
    id: string
    compareData: Array<T>
    votesList: Array<T>
}

const PostVotingMechanism = ({
                                 id,
                                 compareData,
                                 votesList,
                             }: PostVotingMechanismProps) => {
    const {user} = useUser()
    const userProfile = useRecoilValue(userProfileState)

    // Track voting button state
    const [voteButtonLeft, setVoteButtonLeft] = useState(<UilCircle/>)
    const [voteButtonRight, setVoteButtonRight] = useState(<UilCircle/>)

    useEffect(() => {
        const unsubscribe = streamPostData(
            id,
            (snapshot) => {
                const postData = snapshot.data()
                if (postData) {
                    // prevent error on compare post deletion
                    // Probably not a permanent fix, may want to
                    // look at listening only for changes in the children elements
                    // to avoid issues during post deletion
                    // Only gets mounted when post isCompare so we don't need to worry
                    // that postData.compare does not exist
                    // if current user is a voter of left object
                    if (postData.compare.votesObjMapList[0] && postData.compare.votesObjMapList[1]) {
                        if (userProfile.uid in postData.compare.votesObjMapList[0]) {
                            setVoteButtonLeft(<UilCheckCircle/>)
                            setVoteButtonRight(<UilCircle/>)
                        }
                        // if current user is a voter of right object
                        else if (userProfile.uid in postData.compare.votesObjMapList[1]) {
                            setVoteButtonRight(<UilCheckCircle/>)
                            setVoteButtonLeft(<UilCircle/>)
                        }
                    } else {
                        // if current user is not a voter
                        setVoteButtonLeft(<UilCircle/>)
                        setVoteButtonRight(<UilCircle/>)
                    }
                }
            },
            (error) => {
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
        if (!user) return;
        // Add a vote, for this user, to one of the images
        let docRef = db.collection('posts').doc(id)

        return db.runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef)
            const postData = doc.data()

            for (var i = 0; i < postData?.compare?.votesObjMapList?.length; i++) {
                // Case 1: the user voted for an object in the past
                if (userProfile.uid in postData?.compare?.votesObjMapList[i]) {
                    // delete vote for the old index
                    delete postData?.compare?.votesObjMapList[i][userProfile.uid]
                    if (i !== objIdx) {
                        // if new index is different from old index, set vote
                        postData.compare.votesObjMapList[objIdx][userProfile.uid] = true
                    }
                    transaction.update(docRef, postData)
                    return
                }
            }
            // Case 2: this is the first time for the user voting on this object
            postData.compare.votesObjMapList[objIdx][userProfile.uid] = true
            transaction.update(docRef, postData)
        })
    }

    return (
        <div className={postCardClass.voteDiv}>
            {compareData.map((obj, idx) => {
                return (
                    <div key={idx} className={postCardClass.voteContainer}>
                        {
                            (obj.image && obj.image.length > 1) ? (
                                <img
                                    className={postCardClass.imageVote + (!user ? ' cursor-default' : '')}
                                    src={obj.image}
                                    onClick={() => {
                                        voteOnImage(idx)
                                    }}
                                    alt=""
                                />
                            ) : (obj.previewImage && obj.previewImage.length > 1) && (
                                <img
                                    className={postCardClass.imageVote + (!user ? ' cursor-default' : '')}
                                    src={obj.previewImage}
                                    onClick={() => {
                                        voteOnImage(idx)
                                    }}
                                    alt=""
                                />
                            )
                        }
                        {
                            isValidURL(obj.text) ? (
                                <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                                    <a className={postCardClass.textVote + (!user ? ' cursor-default' : '')}
                                       target="blank" href={decoratedHref}
                                       key={key}
                                       onClick={() => {
                                           voteOnImage(idx)
                                       }}
                                    >
                                        {decoratedText}
                                    </a>
                                )}
                                >{obj.text}</Linkify>
                            ) : (obj.text && obj.text.length > 0) && (
                                <span className={postCardClass.textVote + (!user ? ' cursor-default' : '')}
                                      onClick={() => {
                                          voteOnImage(idx)
                                      }}
                                >
                                    {obj.text}
                                </span>
                            )
                        }
                        <div className={postCardClass.voteButtonContainer}>
                            <button
                                className={postCardClass.voteButton + (!user ? ' cursor-default' : '')}
                                onClick={() => {
                                    voteOnImage(idx)
                                }}
                            >
                                {idx == 0 ? voteButtonLeft : voteButtonRight}
                            </button>
                            <p className={postCardClass.voteCounter}>
                                {votesList[idx]}{' '}
                                {votesList[idx] == 1 ? 'vote' : 'votes'}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default PostVotingMechanism
