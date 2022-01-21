/*
 * @Author: mrrs878@foxmail.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-21 11:54:06
*/

/* eslint-disable no-alert */

import { FC } from 'react';
import Link from '../components/Link';
import Article from '../components/Article';
import Page from '../components/Page';
import { getPosts } from '../lib/posts';

interface IHomeProps {
  posts: Array<any>;
}

export const getStaticProps = async () => {
  const posts = await getPosts();
  return {
    props: { posts: posts.slice(0, 5) },
  };
};

const Home: FC<IHomeProps> = ({
  posts,
}) => (
  <Page title="首页">
    <ul className="flex flex-col space-y-12">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/post/${post.slug}`} title="">
            <Article
              title={post.title}
              description={post.description}
              createDate={post.createDate}
              tags={post.tags}
              updateDate={post.updateDate}
            />
          </Link>
        </li>
      ))}
    </ul>
    <div className="mt-4 mb-4">
      <button
        type="button"
        onKeyDown={() => alert('开发中...')}
        className="text-yellow cursor-pointer"
        onClick={() => alert('开发中...')}
      >
        更多文章......
      </button>
    </div>
  </Page>
);

export default Home;
