---
title: "前端架构&软实力-pnpm"
tags: "pnpm"
categories: "前端架构&软实力"
description: ""
createDate: "2022-08-15 19:11:45"
updateDate: "2022-08-15 20:11:45"
---

[pnpm](https://pnpm.io) 全称是 “Performant NPM”，即高性能的 npm。它结合软硬链接与新的依赖组织方式，大大提升了包管理的效率，也同时解决了 “幽灵依赖” 的问题，让包管理更加规范，降低潜在风险发生的可能性

## 安装

```bash
npm i pnpm -g
```

## pnpm 在管理 package 时的区别

npm2 是通过嵌套的方式管理 `node_modules` 的，会有依赖复制多次的问题。

npm3+ 和 yarn 是通过铺平的扁平化的方式来管理 `node_modules` ，解决了嵌套方式的部分问题，但是引入了幽灵依赖的问题，并且同名的包只会提升一个版本的，其余的版本依然会复制多次。

pnpm 则是用了另一种方式，不再是复制了，而是都从全局 store 硬连接到 `node_modules/.pnpm` ，然后之间通过软链接来组织依赖关系。

这样不但节省磁盘空间，也没有幽灵依赖问题，安装速度还快，从机制上来说完胜 npm 和 yarn。

## pnpm 的优势

简单描述一下 pnpm 的优势：

- 快。安装速度快

- 准。安装过的依赖会被精准缓存并拿来复用，甚至包版本升级带来的变化都只 diff，绝不浪费一点空间，逻辑上也严丝合缝

- 狠。废除幽灵依赖，提升包管理的效率

pnpm 的 `node_modules` 结构

![pnpm-node-modules-structure](/img/pnpm-node-modules-structure.jpeg)

- 所有的 package 都安装在全局目录 `~/.pnpm/v3/files` 下，同一版本的包只存储一份内容，甚至不同版本的包也仅存储 diff 内容

- 每个项目的 `node_modules` 下有 `.pnpm` 目录以平级结构管理每个版本的包的源码内容，以**硬连接**方式指向 pnpm-store 中的文件地址

- 每个项目的 `node_modules` 下安装的包结构为树状，以**软链接**的方式将内容指向 `node_modules/.pnpm` 中的包（类似于npm2）

## 寻址方式

针对于使用 `pnpm` 管理的包，寻址一般会经历以下步骤：

```js
// index.js
import { something } from "bar";
```

针对于 `bar` 这个包，寻址时的路径大概是这样的：

`node_modules/bar` ->(软链) `node_modules/.pnpm/bar@1.0.0/node_modules/bar` ->(硬链) `~/.pnpm-store/v3/files/00/xxx`

## 幽灵依赖

有些项目中未安装的包（未在 `package.json` 中声明），但仍然可以在项目里使用

产生的原因：在安装的时候， npm/yarn 会通过铺平的扁平化的方式来管理 `node_modules` ，因此在项目文件中是可以寻址到这个包的

因为 pnpm 特殊的寻址设计，使得第一层可以仅包含 `package.json` 定义的包，使 `node_modules` 不可能寻址到未定义在 `package.json` 中的包，自然就解决了幽灵依赖的问题

## 硬链接/软链接

硬链接通过 `ls originFilePath sourceFilePath` 创建，这样创建出来的两个文件都指向同一个文件存储地址，因此无论修改哪个文件，都相当于直接修改了原始地址的内容，导致两个文件内容同时变化。进一步说，通过硬链接创建的文件都是等效的，通过 `ls li ./` 查看文件属性时，可看到该文件有几个硬链接引用

```bash
# 创建源文件
touch t.txt

# 编辑源文件（输入rererererere）
vim t.txt

# 创建硬链接
ln t.txt t_h.txt

# 查看源/目文件内容
cat t.txt # rererererere

cat cat t_h.txt # rererererere

# 查看源/目文件信息
ls -li ./t_h.txt ./t.txt

# 25881318 -rw-r--r--  2 echo  staff  13  8 15 19:41 ./t.txt
# 25881318 -rw-r--r--  2 echo  staff  13  8 15 19:41 ./t_h.txt

# 2 则表示该文件有几个硬链接引用
```

软链接通过 `ls -s originFilePath sourceFilePath` 创建，可以认为是指向文件地址指针的指针，相当于常见的*快捷方式*

```bash
# 创建软链接
ln -s t.txt t_s.txt

# 查看文件内容
cat t_s.txt # rererererere

# 查看文件信息
ls -li ./t_s.txt ./t.txt

# 25881318 -rw-r--r--  2 echo  staff  13  8 15 19:41 ./t.txt
# 25881568 lrwxr-xr-x  1 echo  staff   5  8 15 19:46 ./t_s.txt -> t.txt
```

源文件被删除后，软链接会失效，但硬链接不会，软链接可以对文件夹生效。软链接本身只占很小的存储空间，硬链接 0 占用

## pnpm-store

该目录可通过 `pnpm store path` 查看

TODO

## 参考

[253.精读《pnpm》.md](https://github.com/ascoders/weekly/blob/master/%E5%89%8D%E6%B2%BF%E6%8A%80%E6%9C%AF/253.%E7%B2%BE%E8%AF%BB%E3%80%8Apnpm%E3%80%8B.md)

[幽灵依赖](https://zhuanlan.zhihu.com/p/412419619)
