---
title: "webpack复习-loader"
tags: "webpack loader"
categories: "2024复习"
description: ""
createDate: "2024-04-17 20:18:27"
updateDate: "2024-04-18 20:04:36"
---

## loader

用来处理非 `javascript` 、 `json` 文件

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
  // 当返回值
};
```

## pitch loader 的执行顺序

所有的 `pitch loader` 均在 `normal loader` 之前执行，如下所示

![loader执行顺序](/img/pitch-loader-1.png)

但当某一个 `pitch loader` 的**返回值不为空**时，即发生 `loader` 的**熔断**效应，即**立即中断后续 loader 的执行，并从该 pitch loader 对应的 normal loader 开始执行**

![loader的熔断效应](/img/pitch-loader-2.png)

## 为什么需要 pitch loader

实现一些特殊（取巧）逻辑

正常情况下， `loader` 的执行顺序为从右至左串型执行，且上一个 `loader` 的返回值为下一个 `loader` 的入参，假如要设计这么一个 `cache-loader` ，其作用是缓存上一次 `loader` 构建的结果，因此我们需要将 `cache-loader` 放在最左边，保证其最后执行。按照正常的执行顺序，每次构建时其余 `loader` 都会重新执行，这样就其不到作用。这时候，我们就可以给 `cache-loader` 增加 `pitch` 方法，在 `pitch` 阶段直接根据条件返回缓存的结果直接 **熔断** 其余 `loader` 的执行

## 参考

[多角度解析 Webpack5 之 Loader 核心原理](https://juejin.cn/post/7036379350710616078)

[你不知道的「pitch loader」应用场景](https://juejin.cn/post/7037696103973650463)
