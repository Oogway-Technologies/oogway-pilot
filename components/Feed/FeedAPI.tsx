import React from "react";
import { feedApiClass } from "../../styles/feed";
import FeedToolbar from "./FeedToolbar";
import PostsAPI from "./Post/PostsAPI";

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
