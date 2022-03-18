import React from 'react'

import { feedApiClass } from '../../styles/feed'
import FeedTitle from './FeedTitle'
import FeedToolbar from './FeedToolbar'
import PostsAPI from './Post/PostsAPI'

const FeedAPI = () => {
    return (
        <>
            <div className={feedApiClass.toolbarDiv}>
                <FeedToolbar />
                <FeedTitle />
            </div>

            <div id="infiniteScrollTarget" className={feedApiClass.innerDiv}>
                {/* Posts */}
                <div className={feedApiClass.contentDiv}>
                    <PostsAPI />
                </div>
            </div>
        </>
    )
}

export default FeedAPI
