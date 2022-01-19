import InputBoxAPI from "./InputBoxAPI";
import PostsAPI from "./PostsAPI";

function FeedAPI({ posts }) {
  return (
    <div className="flex-grow h-screen pb-44 pt-6 mr-4 xl:mr-40 overflow-y-auto">
      <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl">
        {/* Input Box */}
        <InputBoxAPI />

        {/* Posts */}
        <PostsAPI posts={posts} />
      </div>
    </div>
  );
}

export default FeedAPI;
