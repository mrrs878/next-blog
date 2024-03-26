---
title: "JavaScript复习-迭代器"
tags: "JavaScript 迭代器 Iterator"
categories: "2021复习"
description: ""
createDate: "2021-05-12 14:32:07"
updateDate: "2024-03-26 20:30:44"
---

> 迭代器是一个可以由任意对象实现的接口，支持连续获取对象产出的每一个值。任何实现 `Iterable` 接口的对象都有一个 `Symbol.iterator` 属性，这个属性引用默认迭代器。默认迭代器就像一个迭代器 工厂，也就是一个函数，调用之后会产生一个实现 `Iterator` 接口的对象。 --<<JS 高程 4>>

## 可迭代协议

数据结构必须暴露一个属性作为**默认迭代器**，而且这个属性必须使用特殊的`Symbol.iterator`作为键，以一个迭代器工厂函数作为值（调用其会返回一个一个新迭代器）

可迭代对象可使用的语言特性包括：

- `for-of`循环
- 数组解构
- 扩展操作符
- `Array.from()`
- 创建集合
- 创建映射
- `Promise.all()`接收由`Promise`组成的可迭代对象
- `Promise.race()`接收由`Promise`组成的可迭代对象
- `yield* `操作符，在生成器中使用

## 迭代器协议

- 迭代器是一次性使用的对象
- 迭代器 API 使用 `next` 方法在可迭代对象中遍历数据。每次成功调用 `next` ，都会返回一个 `IteratorResult` 对象，其中包含迭代器返回的下一个值。
- 每个迭代器都表示对可迭代对象的一次性有序遍历。不同迭代器的实例相互之间没有关系，只会独立地遍历可迭代对象
- 迭代器并不与可迭代对象某个时刻的快照绑定，而仅仅是使用游标来标记遍历可迭代对象的历程。如果可迭代对象在遍历期间被修改了，那么迭代器也会反应相应地变化

```js
class Counter {
  constructor(limit) {
    this.limit = limit;
  }
  [Symbol.iterator]() {
    let count = 0;
    return {
      next: () => {
        count += 1;
        return {
          done: count > this.limit,
          value: count,
        };
      },
      return: () => {
        console.log("Exiting early");
        return { done: true, value: undefined };
      },
    };
  }
}

const counter = new Counter(6);
for (const value of counter) {
  console.log(value);
  if (value >= 4) break;
}

// 1
// 2
// 3
// 4
// Exiting early
```

## 提前终止迭代器

- `for-of`循环通过`break`、`continue`、`return`、`throw`提前退出
- 解构操作并未消费的值

并非所有迭代器都是可关闭的，比如数组，因此可以**实现从上次迭代结束的位置继续执行**

```js
const arr = [1, 2, 3, 4, 5];
const iter = arr[Symbol.iterator]();
for (const value of iter) {
  console.log(value);
  if (value >= 3) {
    break;
  }
}

for (const value of iter) {
  console.log(value);
}

// 1
// 2
// 3
// ###########
// 4
// 5
```
