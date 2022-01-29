import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase';
import { postCardClass } from '../../../styles/feed';
import { UilCircle, UilCheckCircle } from '@iconscout/react-unicons';

type PostVotingMechanismProps = {
    id: string,
    compareData: Array<T>, 
    votesList: Array<T>
};

const PostVotingMechanism = ({id, compareData, votesList}: PostVotingMechanismProps) => {
    const [user] = useAuthState(auth);
     
    // Track voting button state
    const [voteButtonLeft, setVoteButtonLeft] = useState(<UilCircle/>);
    const [voteButtonRight, setVoteButtonRight] = useState(<UilCircle/>);
    
    // Initialize correct voting button state
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
    
    useEffect(() => {
        db.collection("posts")
            .doc(id)
            .onSnapshot((snapshot) => {
                const postData = snapshot.data();
                if (postData) { // prevent error on compare post deletion
                                // Probably not a permanent fix, may want to 
                                // look at listening only for changes in the children elements
                                // to avoid issues during post deletion
                    // Only gets mounted when post isCompare so we don't need to worry
                    // that postData.compare does not exist
                    for (var i = 0; i < postData.compare.votesObjMapList.length; i++) {
                        // Check if the user voted for an object in the past and
                        // update vote button state accordingly
                        if (user.uid in postData.compare.votesObjMapList[i]) {
                            updateVoteButton(i)
                        }
                    }
                }
            });
    }, []);

    // Event hooks
    const voteOnImage = (objIdx) => {
        // Add a vote, for this user, to one of the images
        var docRef = db.collection("posts").doc(id);

        return db.runTransaction((transaction) => {
            return transaction.get(docRef).then((doc) => {
                const postData = doc.data();

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
            });
        });
    };



    return (
        <div className={postCardClass.voteDiv}>
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
    );
};

export default PostVotingMechanism;