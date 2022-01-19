---
title: "typescript学习-命名空间&模块"
tags: "namespace"
categories: "typescript"
description: ""
createDate: "2021-10-08 03:28:30"
updateDate: "2021-10-08 16:36:57"
---


## 模块

TypeScript 与 ES6 一样，任何包含顶级 `import` 或者 `export` 的文件都被当成一个模块。相反地，如果一个文件不带有顶级的 `import` 或者 `export` 声明，那么它的内容被视为全局可见的。

例如我们在在一个 TypeScript 项目下任意文件中（不带有 `export` / `import` ）声明一个变量 `a` 。然后在另一个文件同样声明一个变量 `a` ，这时候会出现错误信息：

![重复声明](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/namespace-0.png)

如果需要解决这个问题，则通过import或者export引入模块系统即可，具体不再赘述。

## 命名空间

命名空间一个最明确的目的就是解决重名问题

命名空间定义了标识符的可见范围，一个标识符可在多个名字空间中定义，它在不同名字空间中的含义是互不相干的

这样，在一个新的名字空间中可定义任何标识符，它们不会与任何已有的标识符发生冲突，因为已有的定义都处于其他名字空间中

TypeScript 中命名空间使用 `namespace` 来定义，语法格式如下：

``` ts
namespace Util {
  export const sum = (a: number, b: number) => a + b;
}

namespace Tools {
  export const sub = (a: number, b: number) => a - b;
}

console.log(Tools.sub(3, 4));
```

命名空间本质上是一个对象，作用是将一系列相关的**全局变量**组织到一个对象的属性，上述代码编译后如下：

``` js
var Util;
(function (Util) {
    Util.sum = function (a, b) { return a + b; };
})(Util || (Util = {}));
var Tools;
(function (Tools) {
    Tools.sub = function (a, b) { return a - b; };
})(Tools || (Tools = {}));
```

## 区别

- 命名空间是位于全局命名空间下的一个普通的带有名字的  JavaScript  对象，使用起来十分容易。但就像其它的全局命名空间污染一样，它**很难去识别组件之间的依赖关系**，尤其是在大型的应用中

- 像命名空间一样，模块可以包含代码和声明。不同的是模块可以声明它的依赖

- 在正常的TS项目开发过程中并不建议用命名空间，但**通常在通过 d.ts 文件标记 js 库类型**的时候使用命名空间，主要作用是给编辑器/IDE编写代码的时候参考使用