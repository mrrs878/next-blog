/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-21 11:25:29
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-05-17 21:00:42
 */

interface IPost {
  title: string;
  tags: Array<string>;
  categories: string;
  description: string;
  createDate: string;
  updateDate: string;
  body: string;
}

type SortPosts = (post1: IPost, post2: IPost) => number;
