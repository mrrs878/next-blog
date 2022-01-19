/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-18 21:44:10
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-19 19:58:53
 */

import { readdir, readFile } from 'fs/promises';
import matter from 'gray-matter';
import { marked, Renderer } from 'marked';
import hljs from 'highlight.js';

const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, lang) {
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
  xhtml: false
});

export async function getPost(slug) {
  const source = await readFile(`articles/${slug}.md`, 'utf8');
  const { 
    data, 
    content,
  } = matter(source);
  const body = marked.parse(content);
  return {
    ...data,
    body,
    tags: data.tags?.split(' '),
    description: (data.description || content.slice(0, 200))?.trim(),
  };
}

export async function getPosts() {
  const slugs = await getSlugs();
  const posts = [];
  for (const slug of slugs) {
    const post = await getPost(slug);
    posts.push({ slug, ...post });
  }
  const sortedPosts = posts.sort((post1, post2) => new Date(post2.createDate).getTime() - new Date(post1.createDate).getTime())
  return sortedPosts;
}

export async function getSlugs() {
  const suffix = '.md';
  const files = await readdir('articles');
  return files.filter((file) => file.endsWith(suffix))
    .map((file) => file.slice(0, -suffix.length));
}

