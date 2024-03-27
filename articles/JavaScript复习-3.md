---
title: "JavaScript复习-3"
tags: "JavaScript"
categories: "2024复习"
description: ""
createDate: "2024-03-26 19:32:19"
updateDate: "2024-03-27 20:24:37"
---

## Reflect

`Reflect` 本质上是一个提供了一种更标准、更规范的方式 **(函数式)** 来操作对象的内置对象。

```js
// 旧方式
'prop' in obj
delete obj.prop
Object.defineProperty(...)

// Reflect方式
Reflect.has(obj, 'prop')
Reflect.deleteProperty(obj, 'prop')
Reflect.defineProperty(...)
```

`Reflect` 一般和 `Proxy` 配套使用
