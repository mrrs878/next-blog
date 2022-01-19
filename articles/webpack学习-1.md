---
title: "webpack学习-1"
tags: "webpack"
categories: "webpack"
description: ""
createDate: "2020-04-13 23:19:33"
updateDate: "10/1/2021, 3:34:43 AM"
---


# 模块解析

## 解析规则

- 解析相对路径
  1. 查找相对当前模块的路径下是否有对应文件或文件夹
  2. 是文件则直接加载
  3. 是文件夹则继续查找文件夹下的 `package.json` 文件
  4. 有 package.json 文件则按照文件中 `main` 字段的文件名来查找文件
  5. 无 package.json 或者无 `main` 字段则查找 `index.js` 文件
- 解析模块名
  查找当前文件目录下，父级目录及以上目录下的 `node_modules` 文件夹，看是否有对应名称的模块
- 解析绝对路径（不建议使用）
  直接查找对应路径的文件

在 webpack 配置中，和模块路径解析相关的配置都在 `resolve` 字段下：

```js
module.exports = {
  resolve: {
    // ...
  }
}
```

## 常用配置

- `resolve.alias`， 配置别名

  ```js
  module.exports = {
      resolve: {
          alias: {
              utils$: path.resolve(__dirname, 'src/utils') // 只会匹配 import 'utils'
          }
      }
  }
  ```

- `resolve.extensions`，文件扩展名简写

  ```js
  module.exports = {
      resolve: {
          extensions: {
              extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
          }
      }
  }
  ```

- `resolve.modules`，配置直接声明依赖名的模块的解析路径

  ```js
  module.exports = {
      resolve: {
        modules: [
          path.resolve(__dirname, 'node_modules'), // 指定当前目录下的 node_modules 优先查找
          'node_modules', // 如果有一些类库是放在一些奇怪的地方的，你可以添加自定义的路径或者目录
        ],
      }
  }
  ```

- `resolve.mainFields`，有`package.json`文件入口文件的配置
- `resolve.mainFiles`，没有`package.json`文件时入口文件的配置

# loader

webpack 的 `loader` 相关配置都在 `module.rules` 字段下，我们需要通过 `test`、`include`、`exclude` 等配置好应用 `loader` 的条件规则，然后使用 `use` 来指定需要用到的 `loader`，配置应用的 `loader` 时还需要注意一下 `loader` 的执行顺序。

```js
module.exports = {
    modules: {
        rules: [
            {
                test: //,
                include: [],
        		use: xxx
            }
        ]
    }
}
```

## 规则条件配置

- `{ test: ... }` 匹配特定条件
- `{ include: ... }` 匹配特定路径
- `{ exclude: ... }` 排除特定路径
- `{ and: [...] }`必须匹配数组中所有条件
- `{ or: [...] }` 匹配数组中任意一个条件
- `{ not: [...] }` 排除匹配数组中所有条件

## module type

```js
{
  test: /\.js?$/,
  include: [
    path: path.resolve(__dirname, "src")
  ],
  type: "javascript/esm"
}
```

现阶段webpack支持以下几种模块类型：

- `javascript/auto`，默认类型，支持所有JS代码模块类型：CommonJS、AMD、ESM
- `javascript/esm`，ECMAScript Modules
- `javascript/dynamic`，CommonJS和AMD
- `javascript/json`，JSON格式数据，`require`和`import`都可以引入，是`.json`文件的默认类型
- `javascript/experimental`，WebAeesmbly Modules，是`.wasm`文件的默认类型

## loader应用顺序

- 同一个rule下，**从右往左执行**

- 多个rule匹配同一个模块文件：

  webpack 在 `rules` 中提供了一个 `enforce` 的字段来配置当前 rule 的 loader 类型，没配置的话是普通类型，可以配置 `pre` 或 `post`，分别对应前置类型或后置类型的 loader。

  执行顺序：**前置 -> 行内 -> 普通 -> 后置**

## 使用noParse

除了`module.rules`字段用于配置loader之外，还有一个`module.noParse`字段可以用于配置哪些模块文件的内容不需要进行解析。对于一些不需要解析依赖（即无依赖，没有使用`import`、`require`、`define`等导入机制）的第三方大型类库可以通过这个字段配置以提高整体的构建速度