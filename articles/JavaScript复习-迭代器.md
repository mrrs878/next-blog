---
title: "JavaScript复习-迭代器"
tags: "JavaScript 迭代器 Iterator"
categories: "2021复习"
description: ""
createDate: "2021-05-12 14:32:07"
updateDate: "2021-06-10 11:06:19"
---


在软件开发领域，迭代的意思是按照顺序反复多次执行一段程序，通常会有明确的终止条件

任何实现Iterable接口的数据结构都可以被实现Iterator接口的结构消费。迭代器是按需创建的一次性对象。每个迭代器都会关联一个可迭代对象，而迭代器会暴露迭代其关联可迭代对象的API。迭代器无需了解与其关联的可迭代对象的结构，只需要知道如何取得连续的值。

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
- 迭代器API使用next()方法在可迭代对象中遍历数据。每次成功调用next()，都会返回一个IteratorResult对象，其中包含迭代器返回的下一个值。
- 每个迭代器都表示对可迭代对象的一次性有序遍历。不同迭代器的实例相互之间没有关系，只会独立地遍历可迭代对象
- 迭代器并不与可迭代对象某个时刻的快照绑定，而仅仅是使用游标来标记遍历可迭代对象的历程。如果可迭代对象在遍历期间被修改了，那么迭代器也会反应相应地变化

``` js
const iterable = {
  [Symbol.iterator]: () => {
    let count = 0;
    return {
      next() {
        count += 1;
        if (count <= 2) return { done: false, value: count };
        return { done: true, value: undefined };
      },
      return() {
        console.log('exiting early');
        return { done: true, value: undefined };
      },
    };
  },
};
```

## 提前终止迭代器：

- `for-of`循环通过`break`、`continue`、`return`、`throw`提前退出
- 解构操作并未消费的值

并非所有迭代器都是可关闭的，比如数组