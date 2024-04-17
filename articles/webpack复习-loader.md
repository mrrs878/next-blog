---
title: "webpack复习-loader"
tags: "webpack loader"
categories: "2024复习"
description: ""
createDate: "2024-04-17 20:18:27"
updateDate: "2024-04-17 20:37:36"
---

## normal loader VS pitch loader

`normal loader` 就是 `loader` 本身

`pitch loader` 就是`loader`上一个名为 `pitch` 的属性，也是个函数

```js
function styleLoader(data) {
  return data;
}

styleLoader.pitch = (remainingRequest, previousRequest, data) => {
  // remainingRequest 表示剩余需要处理的loader的绝对路径和资源文件以!分割组成的字符串
  // previousRequest 它表示pitch阶段已经迭代过的loader按照!分割组成的字符串
  // data 处理normalLoader与pitchLoader的交互
  /**
   *
   * {
   *    test: /\.css$/,
   *    use: ["style-loader", "css-loader"],
   * },
   *
   * remainingRequest: xxx/node_modules/.pnpm/css-loader@7.1.1_webpack@5.91.0/node_modules/css-loader/dist/cjs.js!xxx/src/index.css
   */
};
```

## pitch loader 的执行顺序

所有的 `pitch loader` 均在 `normal loader` 之前执行，如下所示

![loader执行顺序](/img/pitch-loader-1.png)

但当某一个 `pitch loader` 的**返回值不为空**时，即发生 `loader` 的**熔断**效应，即**立即中断后续 loader 的执行，并从该 pitch loader 对应的 normal loader 开始执行**

![loader的熔断效应](/img/pitch-loader-2.png)

## 为什么需要 pitch loader

// TODO

## 参考

[多角度解析 Webpack5 之 Loader 核心原理](https://juejin.cn/post/7036379350710616078)

[你不知道的「pitch loader」应用场景](https://juejin.cn/post/7037696103973650463)
