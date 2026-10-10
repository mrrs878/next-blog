/*
 * @Author: mrrs878@foxmail.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-05-12 22:43:41
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  reactStrictMode: true,
  basePath,
  // GitHub Pages 项目站点部署在子路径下，生产环境需要给 /_next 静态资源加前缀
  assetPrefix: isProd ? basePath : '',
  images: {
    // next export 静态导出不支持默认的图片优化，需关闭
    unoptimized: true,
  },
};
