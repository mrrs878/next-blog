---
title: "typescript学习-Utility Types"
tags: "typescript UtilityTypes"
categories: "typescript"
description: ""
createDate: "2021-02-25 15:22:38"
updateDate: "2021-02-25 23:22:43"
---


## Partial<Type>

返回一个所有 property 都可选的 type
  
``` ts
type Partial<T> = {
    [P in keyof T]?: T[P]
}
// 使用
interface Todo {
  title: string;
  description: string;
}
const newTodo: Partial<Todo> = {
    title: 'title'
}
```
  
## Required< Type >

使 Type 中所有属性必选。
  
## Pick<Type, Keys>
  
从 Type 中挑选出 Keys 中指定 key 在 Type 中存在的类型，组成一个新类型

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}
```
  
## Omit<Type, Keys>

从排除 Type 的 property 中排除 keys 中指定的 property。Type 中剩下的 properties 形成一个新类型。

## Extract<Type, Union>

取两个联合类型的交集

## Parameters< Type >

返回一个函数类型的参数的类型，值为元祖类型
