import React from "react";
import FeedToolbar from "./FeedToolbar";
import InputBoxAPI from "./InputBoxAPI";
import NewPostButton from "./NewPostButton";
import PostsAPI from "./PostsAPI";

const FeedAPI = ({ posts }) => {
  return (
    <div className="flex-grow h-screen pb-44 pt-6 mr-4 xl:mr-40 overflow-y-auto">
      <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl">
        <FeedToolbar/>

        {/* Posts */}
        <PostsAPI posts={posts} />
      </div>
    </div>
  );
}

export default FeedAPI;
