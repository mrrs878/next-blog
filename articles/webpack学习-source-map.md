---
title: "webpack学习-source-map"
tags: "webpack优化 source-map"
categories: "webpack"
description: ""
createDate: "2022-02-10 21:01:15"
updateDate: "2022-02-10 21:56:03"
---

## WHAT

提供构建后代码到源代码的映射

接收以下值：`[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map`

- `source-map`: 外部

  错误代码准确信息 和 源代码的错误位置

- `inline-source-map`: 内联

  只生成-个内联`source-map`

  错误代码准确信息 和 源代码的错误位置

- `hidden-source-map`: 外部

  错误代码准确信息

  不能追踪源代码错误，只能提示到构建后代码的错误位置

- `eval-source-map`: 内联

  每一个文件都生成对应的`source-map`, 都在`eval`函数内

  错误代码准确信息 和 源代码的错误位置

- `nosources-source-map`: 外部

  错误代码准确信息
  
- `cheap-source-map`: 外部

  错误代码准确信息 和 源代码的错误位置

  只能精确的行

内联和外部的区别: 

1. 外部生成了文件，内联没有
2. 内联构建速度更快

## WHY

方便调试、定位错误位置
	
## HOW

在配置文件`webpack.config.js`中添加`devtool`配置

``` js
// webpack.config.js

module.exports = {
  devtool: 'source-map',
}
```

生产环境和开发环境有不同的配置

开发环境: 速度快，调试更友好

  - 速度快(`eval` > `inline` > `cheap` > `...`)

    - `eval-cheap-source-map`
  
    - `eval-source-map`
    
  - 调试更友好

    - `source-map`
  
    - `cheap-module-source-map`
  
    - `cheap-source-map`

  --> `eval-source-map` / `eval-cheap-module-source-map`

生产环境: 源代码要不要隐藏? 调试要不要更友好?
