/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-19 19:28:28
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-19 20:24:11
 */

import Link from "next/link";

const NavBar = () => (
  <header className='fixed top-0 py-4 left-0 right-0 h-auto px-10 shadow bg-white z-50'>
    <nav>
      <ul className='flex w-auto'>
        <li className='mr-4 hover:text-yellow'>
          <Link href="/">
            <a>首页</a>
          </Link>
        </li>
        <li className='mx-4 hover:text-yellow'>
          <Link href="/">
            <a>分类</a>
          </Link>
        </li>
        <li className='ml-4 hover:text-yellow'>
          <Link href="/">
            <a>归档</a>
          </Link>
        </li>
      </ul>
    </nav>
  </header>
);

export default NavBar;
