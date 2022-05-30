---
title: "webpack学习-tree shaking"
tags: "webpack Tree-Shaking"
categories: "webpack"
description: ""
createDate: "2022-05-30 11:27:17"
updateDate: "2022-05-30 21:38:52"
---

学习 webpack5 中 tree shaking 原理

## WHAT

一种优化技术

使用方式：

1. 使用 ESM 编写代码

2. 启用标记功能。配置 webpack 的 `optimization.useExports = true`

3. 启用清除功能。有多种配置方式

- 配置 `mode = production`
- 配置 `optimization.minimize = true`
- 提供 `optimization.minimizer`

## WHY

减少打包文件体积，提升网站性能

## HOW

基于 ESM，静态分析哪些模块没有被用到，借助于一些 DCI 工具，删除没用到的代码

过程分为两步

1. 基于两个插件，标记没有用到的模块（代码）导出，并删除没用到的导出

2. 删除

### 标记

其中标记过程又可分为三步，标记的效果就是**删除没有被其它模块使用的导出语句**，但并**没有删除源码**

1. make 阶段

使用 `FlagDependencyExportsPlugin` 收集模块导出变量并记录到 `module.ExportInfo` 变量中

2. seal 阶段

使用 `FlagDependencyUsagePlugin` 遍历 `module.ExportInfo` ，修改 `module.exportInfo._usedInRuntime` 记录使用到的变量

3. 生成阶段

若变量没有被其它模块使用则删除对应的导出语句，并打上标记

![webpack tree-shaking](/img/webpack-tree-shaking-0.png)

### 删除

将由 Terser、UglifyJS 等 DCE 工具“摇”掉这部分无效代码，构成完整的 Tree Shaking 操作

## 总结

综上所述，Webpack 中 Tree Shaking 的实现分为如下步骤：

1. 在 `FlagDependencyExportsPlugin` 插件中根据模块的 `dependencies` 列表收集模块导出值，并记录到 ModuleGraph 体系的 `exportsInfo` 中

2. 在 `FlagDependencyUsagePlugin` 插件中收集模块的导出值的使用情况，并记录到 `exportInfo._usedInRuntime` 集合中

3. 在 `HarmonyExportXXXDependency.Template.apply` 方法中根据导出值的使用情况生成不同的导出语句
   使用 DCE 工具删除 Dead Code，实现完整的树摇效果

## 参考

[Webpack 原理系列九：Tree-Shaking 实现原理](https://mp.weixin.qq.com/s?__biz=Mzg3OTYwMjcxMA==&mid=2247484579&idx=1&sn=f687adfc6a7ea155c0fdf504defb65b5&chksm=cf00b9daf87730cc2bf7934f6fd40c50ad28ef4e418922740aedacc998f2fa62388d4c81649c&scene=178&cur_album_id=1856066636953272321#rd)
