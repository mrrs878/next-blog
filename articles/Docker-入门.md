---
title: "Docker-入门"
tags: "Docker入门"
categories: "Docker"
description: ""
createDate: "2020-08-10 22:16:00"
updateDate: "2020-10-16 15:19:50"
---


# 什么是Docker

## 简介

[百科](https://baike.baidu.com/item/docker/13344470)：Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布到任何流行的 Linux或Windows 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。

## 核心概念

- 镜像

镜像是一个文件，它是用来创建容器的。Docker镜就好比“Win7纯净版.iso”文件

- 容器

像一个虚拟机，容器中运行着一个完整的操作系统。可以在容器中装Nodejs，可以执行`npm install`，可以做一切你当前操作系统能做的事情

# Docker能用来做什么

快速部署应用（DevOps），较虚拟机系统性能消耗低、应用启停高效

[Docker-实战之基于Travis、Github搭建CI/CD自动化部署](/article/Docker-实战之基于Travis、Github搭建CI&CD自动化部署)

# 怎么使用Docker

1. [安装docker(CentOS)](https://www.cnblogs.com/sky-k/p/11507441.html)
2. 拉取/打包镜像

```shell script
# 拉取镜像
docker pull mrrs878/blog:latest

# 打包镜像
docker build -t mrrs878/blog:latest .
```

3. 根据镜像创建容器

```shell script
docker container create --name blog -p 8081:80 mrrs878/blog:latest
# container id
```

4. 启动容器

```shell script
docker container start xxx(container id)
```

# docker-compose

## service name和container name的关系

如果`container_name`没有定义，运行`docker-cmpose up -d`后，docker-compose自动给container分配了一个名字，其格式为：`<当前工作路径名>/<servicename>_<sequencenumber>`