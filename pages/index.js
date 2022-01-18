/*
 * @Author: mrrs878@foxmail.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-18 21:55:01
 */

import Head from 'next/head'
import Link from 'next/link'
import { getPosts } from '../lib/posts';

export const getStaticProps = async () => {
  const posts = await getPosts();
  return {
    props: { posts },
  };
}

export default function Home({
  posts,
}) {
  return (
    <>
      <Head>
        <title>My Blog</title>
      </Head>
      <main>
        <h1>My Blog</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
