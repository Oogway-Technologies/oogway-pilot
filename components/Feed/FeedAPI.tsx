import React from "react";
import FeedToolbar from "./FeedToolbar";
import PostsAPI from "./Post/PostsAPI";
import { feedApiClass } from '../../styles/feed'

const FeedAPI = ({ posts }) => {
  return (
    <>
        <div className={feedApiClass.toolbarDiv}>
            <div className={feedApiClass.feedToolbar}>
            <FeedToolbar/>
            </div>
        </div>

        <div className={feedApiClass.innerDiv}>
            {/* Posts */}
            <div className={feedApiClass.contentDiv}>
                <PostsAPI posts={posts} />
            </div>
        </div>
    </>
  );
}

export default FeedAPI;
