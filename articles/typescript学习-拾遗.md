---
title: "typescript学习-拾遗"
tags: "never"
categories: "typescript"
description: ""
createDate: "2021-10-08 13:20:35"
updateDate: "2021-10-08 21:21:44"
---


`never` 类型是 TypeScript 中的底层类型。一些例子：

- 一个从来不会有返回值的函数（如：如果函数内含有 `while(true) {}`）；
- 一个总是会抛出错误的函数（如：`function foo() { throw new Error('Not Implemented') }`，`foo` 的返回类型是 `never`）；

使用场景：详细的返回值检查
``` ts
function foo(x: string | number): boolean {
  if (typeof x === 'string') {
    return true;
  } else if (typeof x === 'number') {
    return false;
  }

  // 如果不是一个 never 类型，这会报错：
  // - 不是所有条件都有返回值 （严格模式下）
  // - 或者检查到无法访问的代码
  // 但是由于 TypeScript 理解 `fail` 函数返回为 `never` 类型
  // 它可以让你调用它，因为你可能会在运行时用它来做安全或者详细的检查。
  return fail('Unexhaustive');
}

function fail(message: string): never {
  throw new Error(message);
}
```

与 `void` 的差异：

`never` 表示一个从来不会优雅的返回的函数时，你可能马上就会想到与此类似的 `void`，然而实际上，`void` 表示没有任何类型，`never` 表示永远不存在的值的类型。

当一个函数返回空值时，它的返回值为 `void` 类型，但是，当一个函数永不返回时（或者总是抛出错误），它的返回值为 `never` 类型。`void` 类型可以被赋值（在 `strictNullChecking` 为 `false`时），但是除了 `never` 本身以外，其他任何类型不能赋值给 `never`