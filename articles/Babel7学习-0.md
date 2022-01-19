---
title: "Babel7学习-0"
tags: "Babel"
categories: "Babel"
description: ""
createDate: "2021-01-25 15:00:40"
updateDate: "2021-03-24 22:06:07"
---


## WHAT

一个JS库，转化JS**高级语法**，处理浏览器间的兼容性。

默认是**只会去转化js语法**的，**不会去转换新的API**，比如像Promise、Generator、Symbol这种全局API对象，babel是不会去编译的。

共有三个必备库：

- `@babel/core`，对代码进行转换的核心方法
- `@babel/cli`，babel带有的内置cli，可以用来让我们从命令行来编译我们的文件
- `@babel/plugin*`/`@babel/preset-env`，需要工作的babel插件

## WHY

兼容性

## HOW

- 安装必备库：

`yarn add @babel/core @babel/cli @babel/preser-env -D`

`yarn add `

- 根目录创建`babel.config.js`

``` js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ],
  ]
};
```

- 入口文件引入