/*
* @Author: mrrs878@foxmail.com
* @Date: 2022-01-19 20:07:46
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2024-04-10 19:30:49
*/

/* eslint-disable @next/next/no-img-element */

const Footer = () => (
  <footer className="flex flex-col items-center justify-center leading-8 text-sm w-full py-2 border-t text-skin-muted">
    <p>
      Designed &amp; developed by
      <a className="ml-1 text-yellow" target="_blank" href="https://github.com/mrrs878" rel="noreferrer">Mr.RS</a>
    </p>
    <p>
      {new Date().getFullYear()}
    </p>
    {/* <div className="flex items-center justify-center">
      <span>本网站由 </span>
      <a className="cdn-logo-c" href="https://www.upyun.com/?utm_source=lianmeng&amp;utm_medium=referral">
        <img
          className="call-me"
          src="https://blog.mrrs.top/img/cdn_logo.png"
          style={{ width: '40px' }}
          alt=""
        />
      </a>
      <span>提供CDN加速/云存储服务</span>
    </div> */}
  </footer>
);

export default Footer;
