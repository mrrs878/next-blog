/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-18 21:44:10
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-05-20 10:29:29
 */

import { readdir, readFile } from 'fs/promises';
import matter from 'gray-matter';
import { marked } from 'marked';
import hljs from 'highlight.js';

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

marked.use({
  renderer: {
    heading: (text, level) => (`
      <h${level}>
        <span class="prefix"></span>
        <span class="content">${text}</span>
        <span class="suffix"></span>
      </h${level}>
    `),
  },
});

export async function getPost(slug: string) {
  const source = await readFile(`articles/${slug}.md`, 'utf8');
  const {
    data,
    content,
  } = matter(source);
  const body = marked.parse(content);
  return ({
    ...data,
    body,
    tags: data.tags?.split(' '),
    description: (data.description || content.slice(0, 200))?.trim(),
  }) as IPost;
}

export async function getSlugs() {
  const suffix = '.md';
  const files = await readdir('articles');
  return files.filter((file) => file.endsWith(suffix))
    .map((file) => file.slice(0, -suffix.length));
}

const sortPostsByCreate = (post1: IPost, post2: IPost) => (
  new Date(post2.createDate).getTime() - new Date(post1.createDate).getTime()
);

export async function getPosts(sortPosts = sortPostsByCreate) {
  const slugs = await getSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPost(slug)));
  const sortedPosts = posts.sort(sortPosts);
  return sortedPosts;
}
