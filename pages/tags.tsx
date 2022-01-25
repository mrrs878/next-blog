/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-25 19:41:33
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-25 19:57:52
 */

import { GetStaticProps } from 'next';
import { flatten } from 'ramda';
import { FC } from 'react';
import Page from '../components/Page';
import { getPosts } from '../lib/posts';

interface ITagsProps {
  tags: Record<string, number>;
}

const TEXT_SIZES = [
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl',
  'text-5xl',
  'text-6xl',
  'text-7xl',
  'text-8xl',
  'text-9xl',
];

export const getStaticProps: GetStaticProps<ITagsProps> = async () => {
  const res = await getPosts();
  const data: Record<string, number> = {};
  const tmp = flatten(res?.map(({ tags }) => tags));
  tmp?.filter((item) => item !== '').forEach((tag) => {
    data[tag] = data[tag] !== undefined ? data[tag] + 1 : 0;
  });
  return {
    props: { tags: data },
    revalidate: parseInt(process.env.REVALIDATE_SECONDS || '', 10),
  };
};

const Tags: FC<ITagsProps> = ({
  tags,
}) => (
  <Page title="标签">
    <div className="flex flex-wrap">
      {
        Reflect.ownKeys(tags).map((tag: string) => (
          <span className={`${TEXT_SIZES[tags[tag]]} p-4 break-words`}>{ tag }</span>
        ))
      }
    </div>
  </Page>
);

export default Tags;
