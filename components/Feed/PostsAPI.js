import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import PostCard from "./PostCard";

function PostsAPI({ posts }) {
  // Get real-time connection with DB
  const [realtimePosts] = useCollection(
    db.collection("posts").orderBy("timestamp", "desc")
  );

  return (
    <div className="flex flex-col space-y-md">
      {realtimePosts
        ? realtimePosts?.docs.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              postOwner={post.data().uid}
              name={post.data().name}
              message={post.data().message}
              description={post.data().description}
              isCompare={post.data().isCompare}
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
              postOwner={post.uid}
              name={post.name}
              message={post.message}
              description={post.description}
              isCompare={post.isCompare}
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
