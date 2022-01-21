import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import PostCard from "./PostCard";
import PostAPI from "./PostAPI";

function PostsAPI({ posts }) {
  // Get real-time connection with DB
  const [realtimePosts] = useCollection(
    db.collection("posts").orderBy("timestamp", "desc")
  );

  return (
    <div className='flex flex-col space-y-md'>
      {realtimePosts
        ? realtimePosts?.docs.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              name={post.data().name}
              message={post.data().message}
              email={post.data().email}
              timestamp={post.data().timestamp}
              image={post.data().image}
              postImage={post.data().postImage}
            />
          ))
        : // Render out the server-side rendered posts
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              name={post.name}
              message={post.message}
              email={post.email}
              timestamp={post.timestamp}
              image={post.image}
              postImage={post.postImage}
            />
          ))}
    </div>
  );
}

export default PostsAPI;
