/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-18 21:44:10
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-18 21:52:14
 */

import { readdir, readFile } from 'fs/promises';
import matter from 'gray-matter';
import { marked } from 'marked';

console.log('marked', marked);

export async function getPost(slug) {
  const source = await readFile(`articles/${slug}.md`, 'utf8');
  const { data: { tags, title, category }, content } = matter(source);
  const body = marked(content);
  return { tags, title, body, category };
}

export async function getPosts() {
  const slugs = await getSlugs();
  const posts = [];
  for (const slug of slugs) {
    const post = await getPost(slug);
    posts.push({ slug, ...post });
  }
  return posts;
}

export async function getSlugs() {
  const suffix = '.md';
  const files = await readdir('articles');
  return files.filter((file) => file.endsWith(suffix))
    .map((file) => file.slice(0, -suffix.length));
}

