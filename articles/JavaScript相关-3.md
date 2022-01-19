---
title: "JavaScript相关-3"
tags: "JavaScript"
categories: "JavaScript"
description: ""
createDate: "2020-02-14 23:22:46"
updateDate: "10/1/2021, 3:34:43 AM"
---

## 执行上下文

### 什么是执行上下文

执行上下文就是当前JavaScript代码被解析和执行时所在环境的抽象概念。JavaScript中任何的代码都是在执行上下文中运行。

执行上下文创建过程中，需要做以下几件事：

1. 创建变量对象：首先初始化函数的参数`arguments`，提升变量声明和函数声明
2. 创建作用域链（`scope chain`）：在执行上下文的创建阶段，作用域链是在变量对象之后创建的
3. 确定`this`的值，即`resolve thisbinding`

每个执行上下文中都有三种重要的属性：

- 变量对象（VO），包含变量、函数声明和函数的形参，该属性只能在全局执行上下文中访问（函数执行上下文中为AO）
- 作用域链（`scope chain`），JavaScript采用词法作用域，也就是说变量的作用域实在定义的时候就决定了，包含自身变量对象和上级变量对象的列表，通过`[[Scope]]`属性查找上级变量
- `this`

### 执行上下文的分类

- 全局执行上下文
- 函数执行上下文

## 执行栈

执行栈，也叫做调用栈，具有LIFO结构，用于存储在代码执行期间创建的所有执行上下文

有如下规则：

- 首次运行JavaScript代码的时候会创建一个全局执行的上下文并push到当前的执行栈中，每当发生函数调用，引擎都会为该函数创建一个新的函数执行上下文并push当前执行栈的栈顶
- 当栈顶的函数运行完成后，其对应的函数执行上下文将会从执行栈中pop，上下文的控制权移动到当前执行栈的下一个执行上下文

## 作用域

作用域负责收集和维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限

作用域有两种工作模型：**词法作用域**和**动态作用域**。JavaScript采用的时**词法作用域**，词法作用域意味着作用域是由书写代码时变量和函数声明的位置决定的。

### 作用域的分类

- 全局作用域
- 函数作用域
- 块级作用域

### 作用域链

作用域链就是从当前作用域开始一层一层向上寻找某个变量，直到全局作用域链

## 变量提升

通俗解释：

将声明的代码移动到了顶部

准确解释：👍

1. 在生成执行上下文时，具体步骤是创建VO，JavaScript解释器会找出需要提升的变量和函数，并且给它们提前在内存中开辟好空间，函数的话会将整个函数存入内存，变量之生命并且赋值为`undefined`
2. 代码执行阶段（可以直接使用变量/函数）

## 防抖

在一定时间多次触发但内只调用一次

``` javascript
function debounce (func, wait = 50, immediate = true) {
  let timer, context, args;

  const later = () => setTimeout(() => {
    timer = null
    if (!immediate) {
      func.apply(context, args)
    }
  }, wait)

  return function (...params) {
    if (timer) {
      clearTimeout(timer)
      timer = later()
    } else {
      timer = later()
      if (immediate) {
        func.apply(this, params)
      } else {
        context = this
        args = params
      }
    }
  }
}
```

## 可迭代对象

ES6规定，默认的`Iterator`接口部署在数据结构的`Symbol.iterator`属性上，换个角度，也可以认为一个数据结构只要具有`Symbol.iterator`属性那么就可以认为其是可迭代的

### 可迭代对象的特点

- 具有`Symbol.iterator`属性，返回的是一个遍历器对象
- 可以使用`for...of`循环遍历
- 可以通过`Array.from`转换为数组

### 原生具有`Iterator`接口的数据结构

- Array
- Map
- Set
- String
- TypedArray
- 函数的arguments对象
- NodeList对象