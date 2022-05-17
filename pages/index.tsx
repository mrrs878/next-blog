/*
 * @Author: mrrs878@foxmail.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-05-17 21:02:06
*/

import { FC, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from '../components/Link';
import Article from '../components/Article';
import Page from '../components/Page';
import { getPosts } from '../lib/posts';

interface IHomeProps {
  posts: Array<IPost>;
}

const sortPostsByUpdate = (post1: IPost, post2: IPost) => (
  new Date(post2.updateDate).getTime() - new Date(post1.updateDate).getTime()
);

export const getStaticProps = async () => {
  const posts = await getPosts(sortPostsByUpdate);
  return {
    props: { posts },
  };
};

const filterPosts = ({ category, createDate }) => (post: IPost) => (
  post.categories.includes([category].flat().join(''))
  && (post.createDate.slice(0, 4).includes(createDate.slice(0, 4)))
);

const Home: FC<IHomeProps> = ({
  posts,
}) => {
  const [page, setPage] = useState(0);
  const { query: { category = '', createDate = '' } } = useRouter();
  const postsToDisplay = useMemo(
    () => posts.filter(filterPosts({ category, createDate })),
    [category, createDate, posts],
  );
  const isShowLoadMore = useMemo(
    () => postsToDisplay.length > (page + 1) * 5,
    [page, postsToDisplay.length],
  );

  const onMoreClick = () => {
    setPage((pre) => pre + 1);
  };

  return (
    <Page title="首页">
      <ul className="flex flex-col space-y-12">
        {postsToDisplay.slice(0, (page + 1) * 5).map((post) => (
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
      {
        isShowLoadMore && (
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
          (page > 2) && (
            <Link href="/timeline">
              <span className="text-yellow">查看全部</span>
            </Link>
          )
        }
          </div>
        )
      }

    </Page>
  );
};

export default Home;
