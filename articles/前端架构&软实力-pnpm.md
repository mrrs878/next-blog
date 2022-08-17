---
title: "前端架构&软实力-pnpm"
tags: "pnpm npm"
categories: "前端架构&软实力"
description: ""
createDate: "2022-08-15 19:11:45"
updateDate: "2022-08-17 20:33:45"
---

[pnpm](https://pnpm.io) 全称是 “Performant NPM”，即高性能的 npm。它结合软硬链接与新的依赖组织方式，大大提升了包管理的效率，也同时解决了 “幽灵依赖” 的问题，让包管理更加规范，降低潜在风险发生的可能性

## 安装&使用

```bash
npm i pnpm -g
```

## npm的历史遗留

npm2(Node.js 0.11.14~4.9.1) 是通过**嵌套**的方式管理 `node_modules` 的

![npm2-node-modules-structure](/img/npm2-node-modules-structure.png)

这样的处理方式层级结构非常明显，可以清楚的知道当前安装的包，但是这样也存在不小的问题：

1. 会有依赖下载多次的问题，无法复用

2. 目录层级太深，路径过长，有些操作系统会报错（在 windows 系统中文件路径不能超过 280 个字符）

![heaviest-objects-in-the-universe](/img/heaviest-objects-in-the-universe.png)

npm3+(Node.js 5.0.0+) 是通过**铺平的扁平化**的方式来管理 `node_modules`

![npm3-node-modules-structure](/img/npm3-node-modules-structure.png)

安装时会遍历所有的节点，逐个将模块放在 node_modules 的第一层，当发现有重复模块时，则丢弃， 如果遇到某些依赖版本不兼容的问题，则继续采用 npm 2 的处理方式，前面的放在 node_modules 目录中，后面的放在依赖树中。该方式解决了 npm2 的部分问题，但也引入了其他的问题

1. **幽灵依赖**

2. 同名的包只会提升一个版本的，其余的版本依然会复制多次，而且该特性严重依赖包的**安装顺序**

## pnpm 的优势

简单描述一下 pnpm 的优势：

- 快。安装速度快。安装过的依赖会被精准缓存并拿来复用，基于内容寻址存储（CAS），包版本升级带来的变化都只 diff，绝不浪费一点空间

- 狠。废除幽灵依赖

## 寻址方式

pnpm 的 `node_modules` 结构

![pnpm-node-modules-structure](/img/pnpm-node-modules-structure.jpeg)

- 所有的 package 都安装在全局目录 `~/.pnpm/v3/files` 下，同一版本的包只存储一份内容，甚至不同版本的包也仅存储 diff 内容

- 每个项目的 `node_modules` 下有 `.pnpm` 目录以平级结构管理每个版本的包的源码内容，以**硬连接**方式指向 pnpm-store 中的文件地址

- 每个项目的 `node_modules` 下安装的包结构为树状，以**软链接**的方式将内容指向 `node_modules/.pnpm` 中的包（类似于 npm2）

针对于使用 `pnpm` 管理的包，寻址一般会经历以下步骤：

```js
// index.js
import { something } from "bar";
```

以 `bar` 这个包为例，寻址时的路径大概是这样的：

`node_modules/bar` ->(软链) `node_modules/.pnpm/bar@1.0.0/node_modules/bar` ->(硬链) `~/.pnpm-store/v3/files/00/xxx`

## 幽灵依赖

有些项目中未安装的包（未在 `package.json` 中声明），但仍然可以在项目里使用

产生的原因：在安装的时候， npm/yarn 会通过铺平的扁平化的方式来管理 `node_modules` ，因此项目文件中是可以寻址到这个包的

因为 pnpm 特殊的寻址设计，使得第一层可以仅包含 `package.json` 定义的包，使 `node_modules` 不可能寻址到未定义在 `package.json` 中的包，自然就解决了幽灵依赖的问题

![eslint-no-extraneous-dependencies](/img/eslint-no-extraneous-dependencies.png)

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

全局安装目录，存储所有的包（该目录可通过 `pnpm store path` 查看）

这个硬链接目标文件并不是普通的 NPM 包源码，而是一个哈希文件，这种文件组织方式叫做 content-addressable（基于内容的寻址）。简单来说，基于内容的寻址比基于文件名寻址的好处是，即便包版本升级了，也仅需存储改动 Diff，而不需要存储新版本的完整文件内容，在版本管理上进一步节约了存储空间。

pnpm-store 的组织方式大概是这样的：

```
~/.pnpm-store
- v3
  - files
    - 00
      - e4e13870602ad2922bfc7..
      - e99f6ffa679b846dfcbb1..
      ..
    - 01
      ..
    - ..
      ..
    - ff
      ..
```

之所以能采用这种存储方式，是因为 NPM 包一经发布内容就不会再改变，因此适合内容寻址这种内容固定的场景，同时内容寻址也忽略了包的结构关系，当一个新包下载下来解压后，遇到相同文件 Hash 值时就可以抛弃，仅存储 Hash 值不存在的文件，这样就自然实现了开头说的，pnpm 对于同一个包不同的版本也仅存储其增量改动的能力。


## 总结

不同于npm/yarn，pnpm 采用了一种全新的包管理方式，不再是复制了，而是都从全局 store **硬连接**到 `node_modules/.pnpm` ，然后之间通过**软链接**来组织依赖关系。这样不但节省磁盘空间，也没有幽灵依赖问题，安装速度还快，从机制上来说完胜 npm 和 yarn。

## 参考

[253.精读《pnpm》.md](https://github.com/ascoders/weekly/blob/master/%E5%89%8D%E6%B2%BF%E6%8A%80%E6%9C%AF/253.%E7%B2%BE%E8%AF%BB%E3%80%8Apnpm%E3%80%8B.md)

[Phantom dependencies](https://rushjs.io/pages/advanced/phantom_deps/)

[Node.js version](https://nodejs.org/zh-cn/download/releases/)

[npm 依赖管理中被忽略的那些细节](https://www.infoq.cn/article/qj3z2ygrzdgicqauaffn)

[Here’s what you need to know about npm 5](https://blog.pusher.com/what-you-need-know-npm-5/#:~:text=%24%20npm%20install%20npm%20added%20125%2C%20removed%2032%2C,network%20if%20something%20is%20missing%20from%20the%20cache.)
