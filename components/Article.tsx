/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-19 11:30:40
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2024-03-25 20:23:31
 */

import { FC } from 'react';

interface IArticleProps extends Omit<IPost, 'body' | 'categories'> {
}

const Article: FC<IArticleProps> = ({
  title,
  createDate,
  updateDate,
  description,
  tags,
}) => (
  <article className="text-skin-base relative flex items-center transition-transform transform group hover:-translate-x-2">
    <div className="flex flex-col flex-grow p-4 space-y-4 text-base rounded md:p-8 shadow-md bg-gray-50">
      <div className="flex flex-col justify-between space-y-2 md:space-y-0 md:flex-row md:items-baseline">
        <h3 className="text-xl font-bold tracking-wider">{ title }</h3>
        <span className="text-skin-muted">{ createDate }</span>
      </div>
      <p className="max-w-3xl leading-8 text-xs text-skin-muted">{ description }</p>
      <div className="flex justify-between align-middle">
        <div>
          {
            tags?.map((tag) => (
              <span key={tag} className="border px-2 py-1 rounded-sm text-xs mb-2 mr-2 cursor-pointer whitespace-nowrap inline-block text-yellow">{ tag }</span>
            ))
          }
        </div>
        <span className="text-sm">
          编辑于
          {updateDate}
        </span>
      </div>
    </div>
    <span className="absolute transition opacity-0 group-hover:opacity-100 -right-8">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </span>
  </article>
);

export default Article;
