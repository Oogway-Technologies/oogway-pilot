import Head from 'next/head';
import FeedAPI from '../components/FeedAPI'

// import {auth} from '../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../firebase";

// Pass the posts in from server-side rendering.
// TODO: instead of passing the posts all the way down,
// save the in a global store using RECOIL: https://recoiljs.org/
export default function Home({posts}) {
  // Can use the hook to get user information
  // const [user] = useAuthState(auth);

  return (
    <div className="">
      <Head>
        <title>Oogway</title>
      </Head>
      <main className="flex">
        <FeedAPI posts={posts}/>
      </main>
    </div>
  )
}

// Implement server side rendering for posts
export async function getServerSideProps() {
  // Get the posts
  const posts = await db.collection("posts").orderBy("timestamp", "desc").get();

  const docs = posts.docs.map(post => ({
    id: post.id,
    ...post.data(),
    timestamp: null // DO NOT prefetch timestamp
  }));

  return {
    props: {
      posts: docs,  // pass the posts back as docs
    }
  }
}