---
title: "webpack复习-运行时"
tags: "webpack runtime"
categories: "2024复习"
description: ""
createDate: "2024-04-25 19:34:54"
updateDate: "2024-04-25 20:14:54"
---

研究一下 `webpack` 的 运行时

webpack运行时指在浏览器或Node.js环境中执行打包后的代码时， webpack提供的一些辅助函数和对象。这些对象和函数帮助代码在运行时正确地加载和执行模块、处理依赖关系等。主要包括一下函数和对象

- __webpack_require__ 用来加载模块

- __webpack_modules__ 用来存储各个模块的定义与实现

- __webpack_exports__ 用来保存模块的导出对象

分别讨论 `ESM` 和 `CommonJS` 构建输出

## ESM

## CommonJS
