/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-22 15:59:54
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-23 18:00:56
 */

import { flatten, groupWith } from 'ramda';
import { FC } from 'react';
import Link from '../components/Link';
import Page from '../components/Page';
import { getPosts } from '../lib/posts';

interface ITimelineProps {
  posts: Array<{
    createDate: IPost['createDate'],
    title: IPost['title'],
    year: string;
  }>;
  years: Array<string>;
}

export const getStaticProps = async () => {
  const res = await getPosts();
  let years = [];
  const articles = res?.map(({ title, createDate }) => {
    const tmp = createDate.split(' ')[0];
    const year = tmp.slice(0, 4);
    years.push(year);
    return ({
      title, createDate: tmp, year,
    });
  });
  years = Array.from(new Set(years));
  const posts = groupWith((a, b) => a.year === b.year, articles);
  posts.forEach((item, index) => item.unshift({
    createDate: years[index], title: '', year: '',
  }));
  return {
    props: { posts: flatten(posts), years },
  };
};

const Timeline: FC<ITimelineProps> = ({
  posts,
}) => (
  <Page title="归档">
    <p className="mb-4 text-3xl">
      不错，目前共计
      {posts.length}
      篇日志，继续努力～
    </p>
    {
      posts.map((post) => (
        <div
          key={`${post.createDate} ${post.title}`}
          className={`mb-8 pb-2 border-dashed border-b hover:text-yellow hover:cursor-pointer ${post.title === '' ? 'text-2xl' : ''}`}
        >
          <Link href={post.title === '' ? `/?createDate=${post.createDate}` : `/post/${post.title}`}>
            {post.createDate}
            {' '}
            {post.title}
          </Link>
        </div>
      ))
    }
  </Page>
);

export default Timeline;
