---
title: "webpack学习-chunk分包"
tags: "webpack chunk"
categories: "webpack"
description: ""
createDate: "2022-05-31 21:41:47"
updateDate: "2022-05-31 21:41:47"
---

学习 webpack5 中 chunk 分包规则

## module vs chunk

在 webpack 中，原始的资源模块以 Module 对象形式存在、流转、解析处理。而 Chunk 则是输出产物的基本组织单位，在生成阶段 webpack 按规则将 entry 及其它 Module 插入 Chunk 中，之后再由 SplitChunksPlugin 插件根据优化规则与 ChunkGraph 对 Chunk 做一系列的变化、拆解、合并操作，重新组织成一批性能(可能)更高的 Chunks 。运行完毕之后 webpack 继续将 chunk 一一写入物理文件中，完成编译工作。

综上，Module 主要作用在 webpack 编译过程的前半段，解决原始资源“「如何读」”的问题；而 Chunk 对象则主要作用在编译的后半段，解决编译产物“「如何写」”的问题，两者合作搭建起 webpack 搭建主流程。

## 默认分包规则

简单总结下:

- 同一个 `entry` 下可触达的模块组织成一个 chunk

- 异步模块单独划分为一个 chunk

- `entry.runtime`单独划分为一个 chunk

### entry

**seal 阶段遍历 entry 对象，为每一个 entry 单独生成 chunk，之后再根据模块依赖图将 entry 触达到的所有模块打包进 chunk 中。**

对于如下打包配置和文件依赖

```js
module.exports = {
  mode: "development",
  entry: {
    index: "./src/chunk/index.js",
    main: "./src/chunk/main.js",
  },
  optimization: {
    usedExports: true,
  },
  devtool: false,
};
```

![webpack entry划分chunk-文件依赖](/img/webpack-chunk-1.png)

在示例中， `index.js`和 `main.js` 分别静态引入了几个文件

在 `npx webpack --json > info.json` 打包后的输出结果是这样的

![webpack entry划分chunk-打包结果](/img/webpack-chunk-0.png)

可以看到，一共生成了两个 chunk

### 异步模块

**每次遇到异步模块都会为之创建单独的 Chunk 对象，单独打包异步模块。**

还以上述配置和代码为例，只是将 `a.js` 改为动态引入，即`import('a.js')`

![webpack 动态import分包](/img/webpack-chunk-2.png)

此时重新执行`npx webpack --json > info.json` 打包后的输出结果是这样的

![webpack 动态import分包](/img/webpack-chunk-3.png)

可以看到新增了一个 chunk

### entry.runtime

**Webpack 5 之后还能根据 entry.runtime 配置单独打包运行时代码。**

除了 entry、异步模块外，webpack 5 之后还支持基于 runtime 的分包规则。除业务代码外，Webpack 编译产物中还需要包含一些用于支持 webpack 模块化、异步加载等特性的支撑性代码，这类代码在 webpack 中被统称为 runtime。虽然每段运行时代码可能都很小，但随着特性的增加，最终结果会越来越大，特别对于多 entry 应用，在每个入口都重复打包一份相似的运行时代码显得有点浪费，为此 webpack 5 专门提供了 entry.runtime 配置项用于声明如何打包运行时代码。用法上只需在 entry 项中增加字符串形式的 runtime 值，例如：

```js
module.exports = {
  mode: "development",
  entry: {
    index: {
      import: "./src/chunk/index.js",
      runtime: "solid-runtime",
    },
    main: {
      import: "./src/chunk/main.js",
      runtime: "solid-runtime",
    },
  },
  optimization: {
    usedExports: true,
  },
  devtool: false,
};
```

此时再次执行 `npx webpack --json > info.json`，打包结果如下

![webpack runtime分包](/img/webpack-chunk-4.png)

可以看到，此时又新增了一个包，而且对比一下输出文件的大小，大部分文件输出到 `solid-runtime.js` 中， `index.js` 和 `main.js` 已经缩短到 30 行左右

> ps: 此时网站中需要单独引入 solid-runtime.js 文件

## SplitChunk

// TODO

## 参考

[有点难的知识点： Webpack Chunk 分包规则详解](https://mp.weixin.qq.com/s?__biz=Mzg3OTYwMjcxMA==&mid=2247484029&idx=1&sn=7862737524e799c5eaf1605325171e32&chksm=cf00bf04f8773612682f4650be2f78255912d0ca8ecafff1bd647a8a692ae28098436975908f&scene=178&cur_album_id=1856066636768722949#rd)
