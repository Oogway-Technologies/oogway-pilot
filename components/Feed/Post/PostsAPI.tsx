import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../../firebase";
import PostCard from "./Post";


function PostsAPI({ posts }) {
    // Get real-time connection with DB
    const [realtimePosts] = useCollection(
        db.collection("posts").orderBy("timestamp", "desc")
    );

    return (
        <>
        {realtimePosts
            ? realtimePosts?.docs.map((post) => (
                <PostCard
                key={post.id}
                id={post.id}
                authorUid={post.data().uid}
                name={post.data().name}
                message={post.data().message}
                description={post.data().description}
                isCompare={post.data().isCompare}
                email={post.data().email}
                timestamp={post.data().timestamp}
                postImage={post.data().postImage}
                comments={null}
                isCommentThread={false}
                previewImage={post.data().previewImage}
                />
            ))
            : // Render out the server-side rendered posts
            posts.map((post) => (
                <PostCard
                key={post.id}
                id={post.id}
                authorUid={post.uid}
                name={post.name}
                message={post.message}
                description={post.description}
                isCompare={post.isCompare}
                email={post.email}
                timestamp={post.timestamp}
                postImage={post.postImage}
                comments={null}
                isCommentThread={false}
                previewImage={post.previewImage}
                />
            ))}
        </>
    );
}

export default PostsAPI;
