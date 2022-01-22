/*
 * @Author: mrrs878@foxmail.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-22 15:58:00
*/

/* eslint-disable no-alert */

import { FC, useState } from 'react';
import Link from '../components/Link';
import Article from '../components/Article';
import Page from '../components/Page';
import { getPosts } from '../lib/posts';

interface IHomeProps {
  posts: Array<IPost>;
}

export const getStaticProps = async () => {
  const posts = await getPosts();
  return {
    props: { posts },
  };
};

const Home: FC<IHomeProps> = ({
  posts,
}) => {
  const [page, setPage] = useState(0);

  const onMoreClick = () => {
    setPage((pre) => pre + 1);
  };

  return (
    <Page title="首页">
      <ul className="flex flex-col space-y-12">
        {posts.slice(0, (page + 1) * 5).map((post) => (
          <li key={post.title}>
            <Link href={`/post/${post.title}`}>
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
          onKeyDown={onMoreClick}
          className="text-yellow cursor-pointer mr-4"
          onClick={onMoreClick}
        >
          更多文章......
        </button>
        {
          (page > 3) && (
            <Link href="/timeline">
              <span className="text-yellow">查看全部</span>
            </Link>
          )
        }
      </div>
    </Page>
  );
};

export default Home;
