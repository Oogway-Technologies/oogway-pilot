import React from 'react';
import { commentEngagementBarClass, replyEngagementBarClass } from '../../../styles/feed';
import Button from '../../Utils/Button';
import needsHook from '../../../hooks/needsHook';
import { UilThumbsUp, UilUpload, UilBookmark } from '@iconscout/react-unicons'
import { auth, db } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';



type ReplyEngagementBarProps = {
    postId: string,
    commentId: string,
    replyId: string,
};

const ReplyEngagementBar: React.FC<ReplyEngagementBarProps> = (
    { 
        postId,
        commentId,
        replyId
    }) => {
    const [user] = useAuthState(auth);

    const addLike = (e) => {
        e.preventDefault(); // Don't think it is needed
        db.collection("posts")
          .doc(postId)
          .collection("comments")
          .doc(commentId)
          .collection("replies")
          .doc(replyId)
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
    const engagementItems = [
        {
            icon: <UilThumbsUp/>,
            text: 'Like',
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

    return <div className={replyEngagementBarClass.engagementBar}>
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
                        />
                    ))
                }
        </div>
};

export default ReplyEngagementBar;
