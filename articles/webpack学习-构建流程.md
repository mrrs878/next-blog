---
title: "webpack学习-构建流程"
tags: "webpack 构建流程"
categories: "webpack"
description: ""
createDate: "2022-06-08 22:53:56"
updateDate: "2022-06-09 22:41:47"
---

学习 webpack5 的构建流程

## 构建的核心流程

分为三步

1. 初始化

2. 构建

3. 输出文件

### 初始化

从配置文件、 shell 命令行中读取参数，与默认配置结合得出最终的配置，而后根据该配置创建出 compiler 对象并根据配置中的 entry 找出所有的入口文件，调用 compilation.addEntry 将入口文件转换为 dependence 对象，同时初始化编译环境（包括注入插件、注册各种模块等）

### 构建

根据初始化阶段创建的 dependence 创建 module 对象，调用合适的 loader 将 module 转为标准的 js 内容，接着调用 js 解释器将内容转为 ast 对象，从中找出该模块依赖的模块，创建 dependence，而后递归此过程，直到所有入口依赖的文件都经过了本步骤的处理

在经过递归处理所有能触达到的模块后，得到了每个模块被翻译后的内容以及它们之间的**依赖关系图**

### 输出文件

主要完成 module 到 chunk 的转化

根据入口和模块之间的依赖关系，组装成一个个包含多个 module 的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，最后根据配置好的输出路径和文件名将文件内容写入到文件系统中

chunk 分包规则：

- 同一个 `entry` 下可触达的模块组织成一个 chunk

- 异步模块单独划分为一个 chunk

- `entry.runtime`单独划分为一个 chunk

## 资源形态流转

如图

![webpack 资源形态流转](/img/webpack-core-0.png)

从 entry 文件开始，将其转为 dependence ，而后雕工对应的工厂函数创建 module 对象，之后读取 module 对应的文件内容，将其解析为 ast ，如果该文件有其他依赖，则重复此步骤。至此，所有的文件均为转化为 module

接着，遍历 module 集合，按照内置的分包规则将不同的 module 整合到一个 chunk 中；遍历 chunk 集合，将其转为 assets 集合

最后，将 assets 写入文件系统

## loader 与 plugin

## 参考

[[万字总结] 一文吃透 Webpack 核心原理](https://mp.weixin.qq.com/s/SbJNbSVzSPSKBe2YStn2Zw)
