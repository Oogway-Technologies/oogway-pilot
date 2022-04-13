import React, { Fragment, useEffect, useRef } from 'react'

import { setJumpToComment } from '../../../features/utils/utilsSlice'
// Custom hook
import useIntersectionObserver from '../../../hooks/useIntersectionObserver'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
// Queries
import { useInfinitePostsQuery } from '../../../queries/posts'
import {
    demoAccountIdDev,
    demoAccountIdProd,
} from '../../../utils/constants/global'
import { FirebasePost } from '../../../utils/types/firebase'
import {
    GeneratePostCardLoaders,
    PostCardLoader,
} from '../../Loaders/PostContentLoader'
import EndOfFeedMessage from '../../Utils/EndOfFeedMessage'
// Styles and components
import PostCard from './Post'

function PostsAPI() {
    // Track user
    const userProfile = useAppSelector(state => state.userSlice.user)

    // Instantiate infinite posts query
    const feed = useAppSelector(state => state.utilsSlice.feedState)
    const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfinitePostsQuery(feed)

    // Instantiate intersection observer
    const loadMoreRef = useRef<HTMLDivElement>(null)
    useIntersectionObserver({
        threshold: 0.5,
        target: loadMoreRef,
        onIntersect: fetchNextPage,
        enabled: !!hasNextPage,
    })

    // Only allow demo account to see demo account posts
    const isDemoAccountPost = (uid: string) => {
        return uid === demoAccountIdDev || uid === demoAccountIdProd
    }
    const isDemoAccountUser = (uid: string) => {
        return uid === demoAccountIdDev || uid === demoAccountIdProd
    }
    const jumpToCommentId = useAppSelector(
        state => state.utilsSlice.jumpToCommentId
    )

    useEffect(() => {
        if (jumpToCommentId) {
            setTimeout(() => {
                document
                    .getElementById(jumpToCommentId)
                    ?.scrollIntoView({ behavior: 'smooth' })
                useAppDispatch(setJumpToComment(''))
            }, 1500)
        }
    }, [])

    return (
        <>
            {status === 'loading' ? (
                // Post Placeholders While Content Fetching
                <GeneratePostCardLoaders n={5} />
            ) : status === 'error' ? (
                // TODO: need nicer error component

                <div>Error: loading posts.</div>
            ) : (
                <>
                    {/* Infinite Scroller / Lazy Loader */}
                    {data?.pages.map(page => (
                        <Fragment key={page?.lastTimestamp?.seconds}>
                            {/* If posts collection exists */}
                            {page.posts &&
                                page.posts.map((post: FirebasePost) => {
                                    // Only allow demo account to see demo account posts
                                    if (
                                        isDemoAccountPost(post.uid) &&
                                        !isDemoAccountUser(userProfile.uid)
                                    )
                                        return

                                    return (
                                        <PostCard
                                            key={post.id}
                                            id={post?.id || ''}
                                            authorUid={post.uid}
                                            name={post.name}
                                            message={post.message}
                                            description={post.description}
                                            feed={post.feed || undefined}
                                            isCompare={post.isCompare}
                                            timestamp={post.timestamp}
                                            postImage={post.postImage}
                                            comments={null}
                                            isCommentThread={false}
                                            previewImage={
                                                post?.previewImage || ''
                                            }
                                            isAnonymous={
                                                post?.isAnonymous || false
                                            }
                                            className="cursor-pointer"
                                        />
                                    )
                                })}
                        </Fragment>
                    ))}

                    {/* Lazy Loader Sentinel and End of Feed*/}
                    {isFetchingNextPage || hasNextPage ? (
                        <PostCardLoader ref={loadMoreRef} />
                    ) : (
                        <EndOfFeedMessage
                            topMessage={
                                data?.pages[0].posts
                                    ? "You've read it all..."
                                    : 'No Posts...'
                            }
                            bottomMessage={
                                data?.pages[0].posts
                                    ? 'Now share your wisdom!'
                                    : 'Be the first!'
                            }
                        />
                    )}
                </>
            )}
        </>
    )
}

export default PostsAPI
