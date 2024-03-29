---
title: "ETag"
tags: "ETag"
categories: "网络"
description: ""
createDate: "2022-11-09 21:13:46"
updateDate: "2022-11-09 21:36:41"
---

![编译](/img/etag.png)

## 什么是ETag

http响应头，服务端根据返回的资源生成，有两种语法—强/弱

有两种用途: 缓存、乐观并发控制

## 缓存

可用来实现协商缓存，大致流程如下

![协商缓存](/img/etag-1.png)

1. 浏览器首次访问时，服务端基于返回的数据，根据「合适的算法」计算出一个hash串 ，并在响应头中携带进 `ETag` 头部

2. 浏览器「根据情况」适当缓存响应数据

3. 浏览器再次访问时，请求头中携带 `If-None-Match` ，服务端会判断该值是否是最新的，如果是，服务器则返回304状态码，浏览器直接使用本次已缓存的数据；否则返回200和最新的 `ETag`

## 实现乐观并发控制

> 在关系数据库管理系统里，乐观并发控制（又名“乐观锁”，Optimistic Concurrency Control，缩写“OCC”）是一种并发控制的方法。它假设多用户并发的事务在处理时不会彼此互相影响，各事务能够在不产生锁的情况下处理各自影响的那部分数据。在提交数据更新之前，每个事务会先检查在该事务读取数据后，有没有其他事务又修改了该数据。如果其他事务有更新的话，正在提交的事务会进行回滚。乐观事务控制最早是由孔祥重（H.T.Kung）教授提出。乐观并发控制多数用于数据竞争(data race)不大、冲突较少的环境中，这种环境中，偶尔回滚事务的成本会低于读取数据时锁定数据的成本，因此可以获得比其他并发控制方法更高的吞吐量。    -- wiki

简单来讲就是对产生冲突的情况持一种「乐观」的态度，乐观并发控制将重点放在事务提交**冲突检查**上，而不是直接锁住数据不让访问

实现原理: 提交时带上 `If-Match` 头部，值为获取资源接口响应头中的`ETag` ，服务端判断如果该值是否为最新的，如果不匹配，则意味着数据已经被修改，抛出 `412` 前提条件失败错误

## Q&A

在实际使用过程中，有以下收获/踩过以下坑

### 强/弱两种语法到底意味着什么

现在还是不知道 🤷‍♂️

### ETag如何计算/生成

并未规定算法，各web服务器实现方式不一，以下为 Node.js 的实现 [etag](https://github.com/jshttp/etag#readme)

- 资源文件

![stattag](/img/etag-3.png)

使用文件长度+mtime

- string/Buffer

![stattag](/img/etag-2.png)

内容长度+内容hash

ps: mtime(modified time, 指文件内容改变的时间戳)

### ETag改变，是否意味着资源一定发生变动

不。当编辑文件却未更改文件内容时，或者 touch file，mtime 也会改变，此时 etag 会发生改变，但是文件内容没有更改

### ETag代表的协商缓存在POST请求中能使用吗

不可以。尽管rfc规定在设置合适的响应头(`content-location`)后或合适的操作(先POST后GET，此时GET会使用缓存的POST数据)，浏览器可以缓存POST请求，但实验证明浏览器并没有实现该特性；并且，对于相同的url，POST请求会使GET请求的缓存失效

## 参考

[ETag](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/ETag)

[乐观并发控制](https://zh.m.wikipedia.org/zh-hans/%E4%B9%90%E8%A7%82%E5%B9%B6%E5%8F%91%E6%8E%A7%E5%88%B6)

[Is it possible to cache POST methods in HTTP?](https://stackoverflow.com/a/59569451/12241567)
