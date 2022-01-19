/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-01-19 19:25:39
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-01-19 20:23:39
 */

import Head from "next/head";
import Footer from "./Footer";
import NavBar from "./NavBar";

const Page = ({
  title,
  children,
}) => (
  <>
    <Head>
      <title>Mr.RS的个人博客-{title}</title>
    </Head>
    <NavBar />
    <main className="mt-20 mb-4 mx-auto justify-center w-2/3">
      {children}
    </main>
    <Footer />
  </>
);

export default Page;
