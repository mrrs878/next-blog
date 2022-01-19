---
title: "前端架构&软实力-发布自己的npm包"
tags: "npm"
categories: "前端架构&软实力"
description: ""
createDate: "2020-08-23 22:24:12"
updateDate: "2021-02-20 17:13:58"
---


# 发布前准备

- 安装npm

- 注册npm账号

- package.json相关配置

```json
{
    "name": "@mrrs878/blog",
    "version": "0.0.1",
    "private": false,
    "repository": "https://github.com/mrrs878/blog"
}
```

- 更改仓库地址(之前更改过为淘宝镜像)

```shell
# 查看
npm config get registry

# 设置
npm config set registry https://registry.npmjs.org
```

# 发布

```shell

npm login

npm publish --access publish

```

可能遇到的错误：

```shell
npm ERR! path c:\Temp\npm-20936-b98f84c8\tmp\fromDir-02dd5394\package.tgz
npm ERR! code EPERM
npm ERR! errno -4048
npm ERR! syscall unlink
npm ERR! Error: EPERM: operation not permitted, unlink 'c:\Temp\npm-20936-b98f84c8\tmp\fromDir-02dd5394\package.tgz'
npm ERR!     at Error (native)
npm ERR!  { Error: EPERM: operation not permitted, unlink 'c:\Temp\npm-20936-b98f84c8\tmp\fromDir-02dd5394\package.tgz'
npm ERR!     at Error (native)
npm ERR!   cause:
npm ERR!    { Error: EPERM: operation not permitted, unlink 'c:\Temp\npm-20936-b98f84c8\tmp\fromDir-02dd5394\package.tgz'
npm ERR!        at Error (native)
npm ERR!      errno: -4048,
npm ERR!      code: 'EPERM',
npm ERR!      syscall: 'unlink',
npm ERR!      path: 'c:\\Temp\\npm-20936-b98f84c8\\tmp\\fromDir-02dd5394\\package.tgz' },
npm ERR!   isOperational: true,
npm ERR!   stack: 'Error: EPERM: operation not permitted, unlink \'c:\\Temp\\npm-20936-b98f84c8\\tmp\\fromDir-02dd5394\\package.tgz\'\n    at Error (native)',
npm ERR!   errno: -4048,
npm ERR!   code: 'EPERM',
npm ERR!   syscall: 'unlink',
npm ERR!   path: 'c:\\Temp\\npm-20936-b98f84c8\\tmp\\fromDir-02dd5394\\package.tgz' }
npm ERR!
npm ERR! Please try running this command again as root/Administrator.
```

或：

![npm报错](https://img-blog.csdn.net/20180112190805599?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvY3ZwZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

**重新登录npm**

# 更新

更改`package.json`中的`version`，重新运行`npm publish --access public`
