import { UilArrowCircleLeft } from '@iconscout/react-unicons'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC } from 'react'

import PostCard from '../../components/Feed/Post/Post'
import Button from '../../components/Utils/Button'
import { db } from '../../services/firebase'
import { commentsPageClass } from '../../styles/feed'
import { FirebaseComment, FirebasePost } from '../../utils/types/firebase'

interface CommentPageProps {
    post: FirebasePost
    comments: FirebaseComment[] | []
}

const CommentPage: FC<CommentPageProps> = ({
    post,
    comments,
}: CommentPageProps) => {
    // Use the router to go back on the stack
    const router = useRouter()

    const goBack = () => {
        router.push(`/`)
    }

    return (
        <div className={commentsPageClass.outerDiv}>
            <Head>
                <title>{`Comments | ${post.message}`}</title>
            </Head>

            {/* Go Back */}
            <div className={commentsPageClass.toolbarDiv}>
                <div className={commentsPageClass.backButtonDiv}>
                    <Button
                        text="Back"
                        keepText={false}
                        forceNoText={false}
                        icon={<UilArrowCircleLeft />}
                        type="button"
                        onClick={goBack}
                        addStyle={commentsPageClass.goBackButton}
                    />
                </div>
            </div>

            {/* Scrolling content */}
            <div className={commentsPageClass.innerDiv}>
                <div className={commentsPageClass.contentDiv}>
                    {/* Post w/ comments */}
                    <PostCard
                        id={post.id || ''}
                        authorUid={post.uid}
                        name={post.name}
                        message={post.message}
                        description={post.description}
                        feed={post.feed}
                        isCompare={post.isCompare}
                        timestamp={post.timestamp}
                        postImage={post.postImage}
                        comments={comments}
                        isCommentThread={true}
                        previewImage={post.previewImage || ''}
                        isAnonymous={post.isAnonymous}
                    />
                </div>
            </div>
        </div>
    )
}

export default CommentPage

// Prefetch the data prepared by the server
export async function getServerSideProps(context: {
    query: { id: string | undefined }
}) {
    // Two things to prepare here:
    // 1. prepare the post (clone from what it is coming from);
    // 2. prepare the comments
    // Get the reference to the post this comments are for
    const ref = db.collection('posts').doc(context.query.id)

    // Prepare the post on the server
    // timestamp: JSON.parse(safeJsonStringify(postRes.data().timestamp))
    const postRes = await ref.get()
    const post = {
        id: postRes.id,
        ...postRes.data(),
        timestamp: postRes?.data()?.timestamp.toDate().getTime() || '',
    }

    // Prepare the comments
    const commentsRef = await db
        .collection('post-activity')
        .where('postId', '==', post.id)
        .where('isComment', '==', true)
        .orderBy('timestamp', 'asc')
        .get()

    // Need to parse each comment and convert the timestamp
    // to a string due to server-side rendering
    const comments = commentsRef.docs
        .map(doc => ({
            id: doc.id,
            timestamp: doc?.data().timestamp,
            ...doc.data(),
        }))
        .map(comments => ({
            ...comments,
            timestamp: comments?.timestamp.toDate()?.getTime() || '',
        }))
    return {
        props: {
            post: post, // pass the post back as a doc
            comments: JSON.stringify(comments), // pass the comments back as docs
        },
    }
}
