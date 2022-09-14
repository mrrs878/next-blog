/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-19 19:25:20
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-09-14 22:48:01
 */

import { FC } from 'react';
import Page from '../../components/Page';
import { getPost, getSlugs } from '../../lib/posts';

interface IPostProps {
  post: IPost;
}

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
  const post = await getPost(title);
  return {
    props: { post },
    revalidate: parseInt(process.env.REVALIDATE_SECONDS || '', 10),
  };
};

const Post: FC<IPostProps> = ({
  post,
}) => (
  <Page title={post.title}>
    <div className="mx-auto lg:max-w-5xl md:max-w-3xl">
      <article className="flex flex-col justify-around pb-16 px-4 mx-auto space-y-10 text-base">
        <div className="flex flex-col space-y-4">
          <h1 className="inline pt-10 text-4xl text-skin-primary">{post.title}</h1>
          <div className="text-sm space-x-2 text-skin-muted grid grid-cols-5">
            <span className="flex align-middle">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.createDate}
            </span>
            <span className="flex align-middle">
              <svg className="w-5 h-5 inline-block mr-1" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1903" width="20" height="20">
                <path d="M257.7 752c2 0 4-0.2 6-0.5L431.9 722c2-0.4 3.9-1.3 5.3-2.8l423.9-423.9c3.9-3.9 3.9-10.2 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2c-1.9 11.1 1.5 21.9 9.4 29.8 6.6 6.4 14.9 9.9 23.8 9.9z m67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" p-id="1904" />
              </svg>
              {post.updateDate}
            </span>
            {
              false && (
                <span className="flex align-middle">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  44
                </span>
              )
            }
          </div>
        </div>
        <div className="mt-8 flex">
          <div className="w-full flex-auto custom-markdown-body">
            <div
              className="markdown-body"
              id="write"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>
        </div>
      </article>
    </div>
  </Page>
);

export default Post;
