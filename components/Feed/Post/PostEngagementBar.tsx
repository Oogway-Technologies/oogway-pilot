import React, {useEffect, useState} from 'react';
import {postCardClass} from '../../../styles/feed';
import Button from '../../Utils/Button';
import {useRouter} from 'next/router';
import {UilComment, UilThumbsUp} from '@iconscout/react-unicons'
import {auth, db} from '../../../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from "react-firebase-hooks/firestore";
import {EngagementItems} from "../../../utils/types/global";


type PostEngagementBarProps = {
    id: string
};

const PostEngagementBar = ({id}: PostEngagementBarProps) => {
    const [user] = useAuthState(auth);
    const [numLikes, setNumLikes] = useState(0);

    // Use the router to redirect the user to the comments page
    const router = useRouter();

    // Hooks
    const enterComments = () => {
        router.push(`/comments/${id}`);
    };

    // Use useEffect to bind on document loading the
    // function that will set the number of likes on
    // each change of the DB (triggered by onSnapshot)
    useEffect(() => {
        // Save ref for unsubscribing on delete
        const unsubRef = db.collection("posts")
            .doc(id)
            .onSnapshot((snapshot) => {
                if (snapshot.data()) {
                    // Get the likes map
                    const likesMap = snapshot && snapshot?.data()?.likes;

                    // Count the entries that are True
                    let ctr = 0;
                    Object.values(likesMap).forEach((item) => {
                        if (item) {
                            ctr += 1;
                        }
                    });
                    setNumLikes(ctr);
                }
            });
        return () => unsubRef();
    }, [id]);

    // Track number of comments
    const [commentsSnapshot] = useCollection(
        db?.collection("posts")?.doc(id)?.collection("comments")
    );


    const addLike = (e) => {
        e.preventDefault(); // Don't think it is needed
        db.collection("posts")
            .doc(id)
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
                    console.log("Error post not found: " + id);
                }
            });
    };

    // Items
    const engagementItems: EngagementItems[] = [
        {
            icon: <UilComment/>,
            text: `${commentsSnapshot ? commentsSnapshot.docs.length : "0"} Comments`,
            onClick: enterComments
        },
        {
            icon: <UilThumbsUp/>,
            text: `${numLikes > 0 ? numLikes : "0"} Like`,
            onClick: addLike
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

    return <div className={postCardClass.engagementBar}>
        {
            engagementItems.map((item, idx) => (
                <Button
                    key={idx}
                    addStyle={postCardClass.engagementButton}
                    type='button'
                    onClick={item.onClick}
                    icon={item.icon}
                    keepText={true}
                    text={item.text}
                />
            ))
        }
    </div>
};

export default PostEngagementBar;
