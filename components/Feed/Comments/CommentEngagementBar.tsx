import React, {useEffect, useState} from 'react';
import {commentEngagementBarClass} from '../../../styles/feed';
import Button from '../../Utils/Button';
import {UilCornerUpLeftAlt, UilThumbsUp} from '@iconscout/react-unicons'
import {auth, db} from '../../../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import {EngagementItems} from "../../../utils/types/global";
import {getLikes} from "../../../utils/helpers/common";


type CommentEngagementBarProps = {
    postId: string,
    commentId: string,
    handleReply: React.MouseEventHandler<HTMLButtonElement>,
    expanded: boolean
};

const CommentEngagementBar = ({postId, commentId, handleReply, expanded}: CommentEngagementBarProps) => {
    const [user] = useAuthState(auth);
    const [numLikes, setNumLikes] = useState(0);

    useEffect(() => {
        getLikes(postId, setNumLikes)
        return () => {
            setNumLikes(0)
        }
    }, [postId]);

    const addLike = (e) => {
        e.preventDefault(); // Don't think it is needed
        db.collection("posts")
            .doc(postId)
            .collection("comments")
            .doc(commentId)
            .get()
            .then((doc) => {
                // Here goes the logic for toggling likes from each user
                if (doc.exists) {
                    // Get a reference to the comment
                    let tmp = doc.data();

                    // Step 1: check if user.uid is in the list
                    if (user.uid in tmp.likes) {
                        // Negate what the user previously did
                        tmp.likes[user.uid] = !tmp.likes[user.uid];
                    } else {
                        // The user liked the comment
                        tmp.likes[user.uid] = true;
                    }

                    // Update comment.
                    // Note: a simple update here is fine.
                    // No need for a transaction, since even if a like is lost,
                    // That event is very rare and probably not so much of a pain
                    doc.ref.update(tmp);
                } else {
                    console.log("Error comment not found: " + commentId);
                }
            });
    };

    // Items
    const engagementItems: EngagementItems[] = [
        {
            icon: <UilThumbsUp/>,
            text: `${numLikes === 1 ? `${numLikes} Like` : `${numLikes} Likes`}`,
            onClick: addLike,
            expanded: expanded
        },
        {
            icon: <UilCornerUpLeftAlt/>,
            text: 'Reply',
            onClick: handleReply
        },
        // {
        //     icon: <UilUpload/>,
        //     text: 'Share',
        //     onClick: needsHook
        // },
        // {
        //     icon: <UilBookmark/>,
        //     text: 'Save',
        //     onClick: needsHook
        // },
    ]

    return <div className={commentEngagementBarClass.engagementBar}>
        {
            engagementItems.map((item, idx) => (
                <Button
                    key={idx}
                    addStyle={commentEngagementBarClass.engagementButton}
                    type='button'
                    onClick={item.onClick}
                    icon={item.icon}
                    keepText={true}
                    text={item.text}
                    aria-expanded={item.expanded ? item.expanded : false}
                />
            ))
        }
    </div>
};

export default CommentEngagementBar;
