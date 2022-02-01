import React from "react";
import FeedToolbar from "./FeedToolbar";
import PostsAPI from "./PostsAPI";

const FeedAPI = ({ posts }) => {
  return (
    <div className="flex-grow h-screen pb-44 pt-6 mx-4 xl:mr-40 overflow-y-auto scrollbar-hide">
      <div className="space-y-4 mx-auto max-w-md md:max-w-lg lg:max-w-2xl">
        <FeedToolbar/>


        {/* Posts */}
        <PostsAPI posts={posts} />
      </div>
    </div>
  );
}

export default FeedAPI;
