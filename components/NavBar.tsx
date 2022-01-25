/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-19 19:28:28
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-25 19:41:24
 */

import Link from './Link';

const NavBar = () => (
  <header className="fixed top-0 py-4 left-0 right-0 h-auto px-10 shadow bg-white z-50">
    <nav>
      <ul className="flex w-auto">
        <li className="mr-4 hover:text-yellow">
          <Link href="/">
            首页
          </Link>
        </li>
        <li className="mx-4 hover:text-yellow">
          <Link href="/categories">
            分类
          </Link>
        </li>
        <li className="mx-4 hover:text-yellow">
          <Link href="/tags">
            标签
          </Link>
        </li>
        <li className="ml-4 hover:text-yellow">
          <Link href="/timeline">
            归档
          </Link>
        </li>
      </ul>
    </nav>
  </header>
);

export default NavBar;
