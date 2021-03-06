---
title: "typescript学习-高级概念"
tags: "分发 逆变 协变"
categories: "typescript"
description: ""
createDate: "2022-07-29 20:01:35"
updateDate: "2022-07-31 23:01:35"
---

一些typescript中的概念

## 分发

先上demo

``` ts
type GetSomeType<T extends string | number> = T extends string ? 'a' : 'b';

let one: GetSomeType<string>
// 'a'

let two: GetSomeType<number>
// 'b'

let three: GetSomeType<string | number>
// ?
```

对于 `three` 的类型，感觉会是什么呢？ `a` or `b` or `'a' | 'b'` ？

![类型分发](/img/typescript-high-concept-0.png)

答案是 `'a' | 'b'` !

有点意思， `three`的类型竟然被推导成为了 `'a' | 'b'` 组成的联合类型

**其实这就是所谓分发在捣鬼**

抛开晦涩的概念来解读分发，结合上边的 Demo 来说所谓的**分发简单来说就是分别使用 string 和 number 这两个类型进入 GetSomeType 中进行判断，最终返回两次类型结果组成的联合类型**

那么，什么情况下会产生分发呢？满足分发需要一定的条件

1. 毫无疑问分发一定是需要产生在 extends 产生的类型条件判断中，并且是前置类型

2. 分发一定是要满足联合类型，只有联合类型才会产生分发

3. 分发一定要满足所谓的裸类型中才会产生效果（像 `Array<string>` 就不属于裸类型）

分发的作用/应用：实现一些工具类型，比如内置的 `Exclude` 和 `Extract` 等

```ts
type TypeA = string | number | boolean | symbol

type MyExclude<T, U> = T extends U ? never : T
```

![分发的应用-Exclude](/img/typescript-high-concept-1.png)

## 逆变

## 协变

## 参考

[如何进阶TypeScript功底？一文带你理解TS中各种高级语法](https://juejin.cn/post/7089809919251054628)

