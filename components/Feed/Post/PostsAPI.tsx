import React, { useRef } from 'react'

// Styles and components
import PostCard from './Post'
import Loading from '../../Loading'

// Custoom hook
import useIntersectionObserver from '../../../hooks/useIntersectionObserver'

// Queries
import { useInfinitePostsQuery, usePostsQuery } from '../../../queries/posts'

function PostsAPI() {
    // Retrieve postts
    // const { status, data, error } = usePostsQuery()

    // Instantiate infinite posts query
    const {
        status,
        data,
        error,
        refetch,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfinitePostsQuery()

    // Instantiate intersection observer
    const loadMoreRef = useRef()
    useIntersectionObserver({
        target: loadMoreRef,
        onIntersect: fetchNextPage,
        enabled: !!hasNextPage,
    })

    return (
        <>
            {status === 'loading' ? (
                <Loading />
            ) : status === 'error' ? (
                <div>Error: {error.message}</div> // TODO: need nicer error component
            ) : (
                <>
                    {data?.pages.map((page) => (
                        <React.Fragment key={page.lastTimestamp.seconds}>
                            {page.posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    id={post.id}
                                    authorUid={post.uid}
                                    name={post.name}
                                    message={post.message}
                                    description={post.description}
                                    isCompare={post.isCompare}
                                    timestamp={post.timestamp}
                                    postImage={post.postImage}
                                    comments={null}
                                    isCommentThread={false}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                    <div>
                        <button
                            ref={loadMoreRef}
                            onClick={() => fetchNextPage()}
                            disabled={!hasNextPage || isFetchingNextPage}
                        >
                            {isFetchingNextPage
                                ? 'Loading more...'
                                : hasNextPage
                                ? 'Load Older'
                                : 'Nothing more to load'}
                        </button>
                    </div>
                </>
            )}
        </>
    )
}

export default PostsAPI
