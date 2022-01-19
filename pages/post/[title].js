/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-19 19:25:20
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-19 19:53:11
 */

import Page from "../../components/Page";
import { getPost, getSlugs } from "../../lib/posts";

export async function getStaticPaths() {
  const titles = await getSlugs();
  return {
    paths: titles.map((title) => ({
      params: { title },
    })),
    fallback: false,
  };
}

export const getStaticProps = async ({ params: { title } }) => {
  console.log('[Post] getStaticProps()');
  const post = await getPost(title);
  return {
    props: { post },
    revalidate: parseInt(process.env.REVALIDATE_SECONDS || '', 10),
  };
}

const Post = ({
  post,
}) => (
  <Page title={post.title}>
    <div className="mx-auto lg:max-w-5xl md:max-w-3xl">
      <article className="flex flex-col justify-around pb-16 px-4 mx-auto space-y-10 text-base">
        <div className="flex flex-col space-y-4">
          <h1 className="inline pt-10 text-4xl text-skin-primary">{post.title}</h1>
          <div className="text-sm space-x-2 text-skin-muted">
            <span>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {post.createDate}
            </span>
            <span>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              44
            </span>
          </div>
        </div>
        <div className="mt-8 flex">
          <div className="w-full flex-auto custom-markdown-body">
            <div className="markdown-body" id="write" dangerouslySetInnerHTML={{ __html: post.body }}></div>
          </div>
        </div>
      </article>
    </div>
  </Page>
);

export default Post;
