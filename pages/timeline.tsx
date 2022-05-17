/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-22 15:59:54
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-05-17 23:03:42
 */

import { flatten, groupWith } from 'ramda';
import { FC, useEffect, useState } from 'react';
import throttle from 'lodash.throttle';
import $ from 'jquery';
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

interface ILineProps {
  years: ITimelineProps['years'];
  active: string;
}

const Line = ({ years, active }: ILineProps) => (
  <div className="line-year-c fixed top-1/2 transform -translate-y-1/2 -translate-x-32 left-1/6 transition-all">
    {
      years.map((year) => (
        <div data-year={year} className="line-year relative border-l pt-12">
          <div className={`absolute w-2 h-2 mt-1 -left-1 rounded-full border border-gray transition-all bg-white${active === year ? ' border-yellow bg-yellow w-3 h-3 mt-1.5 -left-1.5' : ''}`} />
          <span className={`transition-all ${active === year ? 'text-yellow text-2xl ' : ''}m-4`}>{year}</span>
        </div>
      ))
    }
  </div>
);

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
    createDate: years[index] || null, title: '', year: '',
  }));
  return {
    props: { posts: flatten(posts), years },
  };
};

const Timeline: FC<ITimelineProps> = ({
  posts,
  years,
}) => {
  const [year, setYear] = useState('2022');

  useEffect(() => {
    let stickyTop = 0;
    const scrollTarget = false;

    const timeline = $('.line-year-c');
    const items = $('.line-year', timeline);
    const milestones = $('.milestone');
    const offsetTop = parseInt(timeline.css('top'), 10);

    $(window).on('resize', () => {
      timeline.removeClass('fixed');

      stickyTop = timeline.offset().top - offsetTop;

      $(window).trigger('scroll');
    }).trigger('resize');

    $(window).scroll(() => {
      if ($(window).scrollTop() > stickyTop) {
        timeline.addClass('fixed');
      } else {
        timeline.removeClass('fixed');
      }
    }).trigger('scroll');

    $(window).on('scroll', throttle(() => {
      const viewLine = $(window).scrollTop() + $(window).height() / 3;
      let active: any = -1;

      if (scrollTarget === false) {
        // eslint-disable-next-line func-names
        milestones.each(function () {
          if ($(this).offset().top - viewLine > 0) {
            return;
          }

          active += 1;
        });
      } else {
        active = scrollTarget;
      }

      items.filter('.active').removeClass('active');

      const item = items.eq(active !== -1 ? active : 0);
      const y = item[0].dataset?.year;
      setYear(y);
    }, 200));
  }, []);

  return (
    <Page title="归档">
      <p className="mb-4 text-3xl">
        不错，目前共计
        {posts.length}
        篇日志，继续努力～
      </p>
      <Line years={years} active={year} />
      {
        posts.map((post) => (
          <div
            key={`${post?.createDate} ${post.title}`}
            data-year={post?.createDate.slice(0, 4)}
            className={`mb-8 pb-2 border-dashed border-b hover:text-yellow hover:cursor-pointer ${post.title === '' ? 'text-2xl' : ''}`}
          >
            {
              post.title !== '' ? (
                <Link href={`/post/${post.title}`}>
                  {post.createDate}
                  {' '}
                  {post.title}
                </Link>
              ) : (
                <div className="milestone">
                  <Link href={`/?createDate=${post.createDate}`}>
                    {post.createDate}
                    {' '}
                    {post.title}
                  </Link>
                </div>
              )
            }
          </div>
        ))
      }
    </Page>
  );
};

export default Timeline;
