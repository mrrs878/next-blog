---
title: "webpack复习-0"
tags: "webpack"
categories: "2021复习"
description: ""
createDate: "2021-05-26 14:54:22"
updateDate: "2021-06-29 18:53:40"
---


## 构建过程

1. 初始化参数。从配置文件和命令行读取参数后合并，得到最终的参数
2. 开始编译。用上一步得到的参数初始化`Compiler`对象，加载所有配置的插件，执行对象的`run`方法开始执行编译
3. 确定入口。根据配置中的`entry`找出所有的入口文件
4. 编译模块。从入口文件出发，调用所有配置的`loader`对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
5. 完成模块编译。在经过第4步使用`loader`翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
6. 输出资源。根据入口和模块之间的依赖关系，组装成一个个包含多个模块的`chunk`，再把每个`chunk`转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
7. 输出完成。在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件内

## Hash&ChunkHash&ContentHash的区别

- `hash`，根据构建目录生成，只要项目中有文件修改，则整个项目构建出来的`hash`都会改变
- `chunkHash`，和webpack打包到chunk有关，不同entry会生成不同的`chunkHash`。chunk之间互不影响（一般用来打包公用js）
- `contentHash`，根据文件内容生成`hash`，只要文件内容不变，生成的`contentHash`就不变（一般用来打包css）

## loader和plugin

loader用来处理非JavaScript文件。webpack将一切文件视为模块，但webpack只能处理JavaScript文件，如果想将其他文件也打包的话就要用到对应的loader

plugin用来扩展webpack的能力。webpack在运行的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的api改变输出结果

## webpack5新特性

- 启动命令变化
    ``` js
    {
        // v4
        "start": "webpack-dev-server"
        // v5
        "start": "webpack serve"
    }
    ```
- 内置持久化缓存
- 资源模块
- moduleIds和chunkIds优化
- 移除Node.js的polyfill
- `tree-shaking`
- `module federation`。主要是用来解决多个应用之间代码共享的问题，可以让我们的更加优雅的实现跨应用的代码共享

## tree shaking

一种优化，可以去除不必要的代码，减小打包后的体积

基于模块静态加载来实现。由于导入了哪些模块是确定的，编译的时候可以正确判断到底加载了哪些模块和变量，可以删除那些未被使用的变量或者引用

## 常用配置

``` js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { DefinePlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const entry = require('./webpack.entry');

const { PORT, MODE, MOCK } = process.env;

function generateHTMLPluginConfig(pages) {
  const items = Reflect.ownKeys(pages).map((item) => (
    new HtmlWebpackPlugin({
      chunks: [item, 'common'],
      template: `./src/html/${item}.html`,
      filename: `${item}.html`,
    })
  ));
  return items;
}

module.exports = {
  mode: MODE,
  entry,
  output: {
    filename: 'static/js/[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...generateHTMLPluginConfig(entry),
    new ProgressBarPlugin({
      format: `${chalk.green('Progressing')}[:bar]${chalk.green(':percent')}(:elapsed seconds)`,
      clear: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[hash:8].css',
      chunkFilename: 'static/css/[id].css',
    }),
    new DefinePlugin({
      'process.env': {
        MODE: JSON.stringify(MODE),
        MOCK,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: ['html-withimg-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
        'eslint-loader'],
        exclude: [/node_modules/, /lib/, /polyfill/],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|svg|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              esModule: false,
              name: 'static/img/[name].[hash:6].[ext]',
              publicPath: MODE === 'development' ? '/' : '/loginfe',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        common: {
          name: 'common',
          test: /.js$/,
          minChunks: 2,
          minSize: 0,
        },
      },
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: PORT,
    disableHostCheck: true,
    host: '0.0.0.0',
    proxy: {
      '/v1/*': {
        target: 'xxx',
        changeOrigin: true,
        secure: false,
        headers: {},
      },
    },
  },
  devtool: MODE === 'production' ? false : 'eval-source-map',
};

```

## 循环引用

在`CommonJS`规范中，当遇到`require()`语句时，会执行`require`模块中的代码，并缓存执行的结果，当下次再次加载时不会重复执行，而是直接取缓存的结果

在`ESM`中，因为`import`是在编译阶段执行的，这样就使得程序在编译时就能确定模块的依赖关系，一旦发现循环依赖，ES6 本身就不会再去执行依赖的那个模块了，所以程序可以正常结束。这也说明了 ES6 本身就支持循环依赖，保证程序不会因为循环依赖陷入无限调用

## 参考

[小红书面试官：介绍一下 tree shaking 及其工作原理](https://segmentfault.com/a/1190000038962700) 

[探索 JavaScript 中的依赖管理及循环依赖](https://zhuanlan.zhihu.com/p/33049803)