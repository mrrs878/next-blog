/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-23 17:15:04
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-23 17:48:39
 */

import { GetStaticProps } from 'next';
import { flatten } from 'ramda';
import { FC } from 'react';
import Link from '../components/Link';
import Page from '../components/Page';
import { getPosts } from '../lib/posts';

interface ICategoriesProps {
  categories: Record<string, number>;
}

export const getStaticProps: GetStaticProps<ICategoriesProps> = async () => {
  const posts = await getPosts();
  const data = {};
  const tmp = flatten(posts?.map(({ categories }) => categories.split(' ')));
  tmp?.filter((item) => item !== '').forEach((category) => {
    data[category] = data[category] !== undefined ? data[category] + 1 : 1;
  });

  return {
    props: { categories: data },
    revalidate: parseInt(process.env.REVALIDATE_SECONDS || '', 10),
  };
};

const Categories: FC<ICategoriesProps> = ({
  categories,
}) => (
  <Page title="分类">
    <ul>
      {
        Reflect.ownKeys(categories)?.map((category: string) => (
          <li className="mb-4" key={category}>
            <Link href={`/?category=${category}`}>
              { category }
              (
              {categories[category]}
              )
            </Link>
          </li>
        ))
      }
    </ul>
  </Page>
);

export default Categories;
