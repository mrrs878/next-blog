/*
 * @Author: mrrs878@foxmail.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-19 20:10:21
 */

import Link from 'next/link';
import Article from '../components/Article';
import Page from '../components/Page';
import { getPosts } from '../lib/posts';

export const getStaticProps = async () => {
  const posts = await getPosts();
  return {
    props: { posts: posts.slice(0, 5) },
  };
}

export default function Home({
  posts,
}) {
  return (
    <Page title='首页'>
      <ul className='flex flex-col space-y-12'>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/post/${post.slug}`}>
              <a>
                <Article 
                  title={post.title}
                  description={post.description}
                  createDate={post.createDate} 
                  tags={post.tags}
                  updateDate={post.updateDate}
                />
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 mb-4">
        <span className="text-yellow cursor-pointer" onClick={() => alert('开发中...')}> 更多文章......</span>
      </div>
    </Page>
  )
}
