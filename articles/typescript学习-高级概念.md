---
title: "typescript学习-高级概念"
tags: "分发 逆变 协变"
categories: "typescript"
description: ""
createDate: "2022-07-29 20:01:35"
updateDate: "2022-08-01 20:54:30"
---

一些 typescript 中的概念

## 分发

先上 demo

```ts
type GetSomeType<T extends string | number> = T extends string ? "a" : "b";

let one: GetSomeType<string>;
// 'a'

let two: GetSomeType<number>;
// 'b'

let three: GetSomeType<string | number>;
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
type TypeA = string | number | boolean | symbol;

type MyExclude<T, U> = T extends U ? never : T;
```

![分发的应用-Exclude](/img/typescript-high-concept-1.png)

## 逆变

首先，思考一下如下场景

```ts
let a!: { name: string; age: number };
let b!: { name: string };

b = a;

a = b;
```

对于 `a = b` 这一赋值 ts 是会报错的

![类型安全性](/img/typescript-high-concept-2.png)

我们都清楚 TS 属于静态类型检测，所谓类型的赋值是要保证安全性的。

**通俗来说也就是多的可以赋值给少的**，上述代码因为 a 的类型定义中完全包括 b 的类型定义，所以 a 类型完全是可以赋值给 b 类型，这被称为类型兼容性。

但对于函数而言，刚好相反

```ts
type A = { name: string; age: number };
type B = { name: string };

let fn1 = (a: A) => console.log(a.name);
let fn2 = (b: B) => console.log(b.name);

fn1 = fn2;

// 报错
fn2 = fn1;
```

对于 `fn2 = fn1` 是会报错的，如下

![逆变](/img/typescript-high-concept-3.png)

逆变，描述的是函数之间互相赋值，**参数**之间的类型兼容性，参数少的可以赋值给参数多的，反之则不可

原因可以简单的理解为：函数之间的赋值复制的是指针，但函数调用时该函数的签名（js中并没有函数签名，只是为了方便解释）并没有跟随一起复制过去。

因此，拿上面的例子来讲：假设 `fn2 = fn1` 可以正常执行，在此操作后，执行 `fn2(b: B)` 实际上执行的是 `fn1` ，但入参是 `B` 类型，此时 `fn1` 内部可能会调用 `A` 中存在但 `B` 中不存在的一些属性，可能会报错。为了保证安全性，因此不允许这种赋值

## 协变

协变，描述的是函数之间互相赋值，**返回值**之间的类型兼容性，参数多的可以赋值给参数少的，反之则不可

例如

```ts
type A = { name: string; age: number };
type B = { name: string };

let fn1!: () => A;
let fn2!: () => B;

// 报错
fn1 = fn2;

fn2 = fn1;
```

![协变](/img/typescript-high-concept-4.png)

其实这种现象也很好理解：就像普通变量赋值一样，为保证类型安全性，阻止了该行为

## 参考

[如何进阶 TypeScript 功底？一文带你理解 TS 中各种高级语法](https://juejin.cn/post/7089809919251054628)
