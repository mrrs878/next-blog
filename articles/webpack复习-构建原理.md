---
title: "webpack复习-构建原理"
tags: "webpack"
categories: "2021复习"
description: ""
createDate: "2021-06-04 06:58:05"
updateDate: "2024-04-19 20:07:22"
---

## 初始化

从配置文件、配置对象、命令行参数、默认配置中计算得到最终的参数，创建`Compiler`初始化编译环境：包括注入内置插件、注册各种模块工厂、初始化`RuleSet`等

## 确定入口

根据配置中的`entry`找到所有入口文件，调用`compilation.addEntry`将入口文件转化为`dependence`对象

## 构建

根据`entry`对应的`dependence`创建`module`对象，调用`loader`将模块转译为标准 JavaScript 内容，调用 JavaScript 解释器将内容转换为 AST 对象，从中找出该模块依赖的模块，再递归本步骤直到所有入口依赖文件都经过本步骤的处理。递归完成之后就得到了模块间的依赖关系图

这个过程中数据流大致是**module => ast => dependencies => module**，先转 AST 再从 AST 找依赖。这就要求`loaders`处理完的最后结果必须是可以被`acorn`处理的标准 JavaScript 语法，比如说对于图片，需要从图像二进制转换成类似于`export default "data:image/png;base64,xxx"`这类 base64 格式或者`export default "http://xxx"`这类 url 格式

## 生成

构建阶段围绕`module`展开，生成阶段则围绕`Chunks`展开。经过构建阶段后，webpack 已经得到足够的模块内容与模块关系信息，根据入口和模块之间的依赖关系，组装成一个个包含多个模块的`Chunk`，再把每个`Chunk`转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会。在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

webpack 内置的`chunk`封装规则：

- entry 及 entry 能触及到的模块，组成一个`chunk`
- 使用动态引入语句的模块，各自组合成一个`chunk`
- 通过`optimization.splitChunks`来强制设定公用模块导出为一个`chunk`

## 资源形态流转

![webpack转换过程](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/webpack-transform.png)

- `compiler.make`，将`entry`以`dependence`对象形式加入`compilation`的依赖列表，`dependence`对象记录有`entry`的类型、路径等信息。根据`dependence`调用对应的工厂函数创建`module`对象，之后读入`module`对应的文件内容，调用`loader-runner`对内容转化，转化结果若有其他依赖则继续读入依赖资源，重复此过程直到所有依赖均被转化为`module`
- `compilation.seal`，遍历`module`集合，根据`entry`配置及引入资源的方式，将`module`分配到不同的`chunk`，遍历`chunk`集合，调用`compilation.emitAsset`方法标记`chunk`的输出规则，即转化为`assets`集合
- `compiler.emitAssets`，将`assets`写入文件系统

## 参考

[[万字总结] 一文吃透 Webpack 核心原理](https://xie.infoq.cn/article/ddca4caa394241447fa0aa3c0)
