---
title: "JavaScript复习-2"
tags: "JavaScript"
categories: "2021复习"
description: ""
createDate: "2021-05-31 14:58:19"
updateDate: "2024-03-28 21:53:18"
---


## Array.prototype.sort算法

> sort() 方法用原地算法对数组的元素进行排序，并返回数组。默认排序顺序是在将元素转换为字符串，然后比较它们的UTF-16代码单元值序列时构建的， **会改变原数组**

## Array修改原数组 VS 返回新数组的API

会改变原数组的API

- `push`: 在数组末尾添加一个或多个元素,并返回新的长度

- `pop`: 删除并返回数组的最后一个元素

- `shift`: 删除并返回数组的第一个元素

- `unshift`: 在数组的开头添加一个或多个元素,并返回新的长度

- `splice`: 添加/删除数组中的元素,并返回被删除的元素

- `reverse`: 颠倒数组中元素的顺序

- `sort`: 对数组的元素进行排序

- `fill`: 用一个固定值填充一个数组中从起始索引到终止索引内的全部元素

## Symbol用处

1. 表示一个独一无二的变量防止命名冲突

2. 提供一些特殊的属性 `[Symbol.iterator]` (可通过 `Reflect.ownKeys(Symbol)` 查看)

## 工程化

通过一系列工具构建和维护有效的、实用的、高质量的前端应用

## 参考

[MDN-Array.prototype.sort](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
