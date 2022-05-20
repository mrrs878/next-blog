/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-05-16 22:46:35
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-05-20 15:38:15
 */

import {
  Html, Head, Main, NextScript,
} from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg" />
        <script async src="/js/L2Dwidget.min.js" />
        <script async src="/js/initL2D.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
