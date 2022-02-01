import React from "react";
import FeedToolbar from "./FeedToolbar";
import PostsAPI from "./PostsAPI";
import { feedApiClass } from '../../styles/feed'

const FeedAPI = ({ posts }) => {
  return (
    <div className={feedApiClass.divOuter}>
      <div className={feedApiClass.divInner}>
        <FeedToolbar/>


        {/* Posts */}
        <PostsAPI posts={posts} />
      </div>
    </div>
  );
}

export default FeedAPI;
