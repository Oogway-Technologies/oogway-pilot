import FeedAPI from '../components/Feed/FeedAPI'
import Head from 'next/head'

// Database
import { db } from '../firebase'

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home({ posts }) {
  //const router = useRouter();

  //useEffect(() => {
  //  router.push(`/feed`);
  //}, [])

  return (
    <div className="flex flex-col w-full justify-center">
        <Head>
            <title>Oogway | Social - Wisdom of the crowd</title>
        </Head>
        <FeedAPI posts={posts} />
    </div>
  )
}


// Implement server side rendering for posts
export async function getServerSideProps() {
  // Get the posts
  const posts = await db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .get()

  const docs = posts.docs.map((post) => ({
      id: post.id,
      ...post.data(),
      timestamp: null, // DO NOT prefetch timestamp
  }))

  return {
      props: {
          posts: docs, // pass the posts back as docs
      },
  }
}
