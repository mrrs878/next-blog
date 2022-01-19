---
title: "JavaScript复习-JavaScript的执行过程"
tags: "JavaScript的执行过程"
categories: "2021复习"
description: ""
createDate: "2021-05-28 02:22:06"
updateDate: "2021-05-28 16:36:52"
---


JavaScript代码在执行时，首先创建一个**全局可执行上下文（`GlobalContext`）**，每当执行到一个函数调用时都会创建一个**可执行上下文（`ExecutionContext`）EC**。当然程序可能存在很多函数调用，那么就会创建很多EC，所以JavaScript引擎创建了**执行上下文栈（`ExecutionConetxtStack`）ECS**来管理执行上下文。当函数调用完成，JavaScript会退出这个执行环境并把这个环境销毁，回到上一个执行环境...。这个过程反复执行，直到执行栈中的代码全部执行完毕。

执行上下文的创建阶段主要负责三件事：

1. `this`
2. Lexical Environment
3. Variable Environment

## 词法环境

词法环境（Lexical Environment）：作用于词法分析阶段。包含两部分：

1. Environment Record（环境记录）是一个以全部局部变量为属性的对象（以及其他如 this 值的信息）。
2. 对 outer lexical environment（外部词法环境）的引用，通常关联词法上的外面一层代码（花括号外一层）。

词法环境是在代码定义的时候决定的，跟代码在哪⾥调⽤没有关系

``` js
// 全局执⾏上下⽂
GlobalExectionContext = {
  // 词法环境
  LexicalEnvironment: {
    // 环境记录
    EnvironmentRecord: {
      Type: "Object", // 全局环境
      // ... 标识符绑定在这⾥
      outer: <null>, // 对外部环境的引⽤
    }
  }
}
// 函数执⾏上下⽂
FunctionExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",// 函数环境
      // ... 标识符绑定在这⾥
      // 对全局环境或外部函数环境的引⽤
      outer: <Global or outer function environment reference>,
    }
  }
}
```

## 词法环境与闭包

> 一个函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包（closure） --MDN

## 变量环境

为了继续去适配早期JavaScript的`var`等，ES6增加了**变量环境（Variable Environment）**。变量环境也是一个词法环境，其环境记录器包含有变量声明语句

在ES6中，词法环境和变量环境的区别在于前者用于存储函数声明和变量(`let`和`const`)绑定，而后者仅用于存储变量(`var`)绑定

``` js
let a = 20;
const b = 30;
var c;
function multiply(e, f){
  var g = 20;
  return e*f*g;
}
c = multiply(20, 30);
```

词法构成

``` js
// 全局执⾏上下⽂
GlobalExectionContext = {
  ThisBinding: < Global Object > ,
  // 词法环境
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 标识符绑定，let、const、函数声明
      a: < uninitialized > ,
      b: < uninitialized > ,
      multiply: < func >
    }
    outer: < null >
  },
  // 变量环境
  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 标识符绑定，var 声明
      c: undefined,
    }
    outer: < null >
  }
}

// 函数执⾏上下⽂
FunctionExectionContext = {
  ThisBinding: < Global Object > ,
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 标识符绑定
      Arguments: {
        0: 20,
        1: 30,
        length: 2
      },
    },
    outer: < GlobalLexicalEnvironment >
  },
  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这⾥绑定标识符
      g: undefined
    },
    outer: < GlobalLexicalEnvironment >
  }
}

```

## 参考

[MDN-闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

[JS | 执行调度过程](https://hondrytravis.github.io/docs/typescript/javascript_workflow/)