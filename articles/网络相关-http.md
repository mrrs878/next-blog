---
title: "网络相关-http"
tags: "网络相关 http"
categories: "网络"
description: ""
createDate: "2020-04-16 21:00:05"
updateDate: "10/1/2021, 3:34:43 AM"
---


# HTTP协议

**超文本传输协议（HTTP）** 是一个用于传输超媒体文档（例如 HTML）的[应用层](https://en.wikipedia.org/wiki/Application_Layer)协议。它是为 Web 浏览器与 Web 服务器之间的通信而设计的，但也可以用于其他目的。HTTP 遵循经典的[客户端-服务端模型](https://en.wikipedia.org/wiki/Client–server_model)，客户端打开一个连接以发出请求，然后等待它收到服务器端响应。HTTP 是[无状态协议](http://en.wikipedia.org/wiki/Stateless_protocol)，这意味着服务器不会在两个请求之间保留任何数据（状态）。该协议虽然通常基于 TCP/IP 层，但可以在任何可靠的[传输层](https://zh.wikipedia.org/wiki/传输层)上使用；也就是说，不像 UDP，它是一个不会静默丢失消息的协议。[RUDP](https://en.wikipedia.org/wiki/Reliable_User_Datagram_Protocol)——作为 UDP 的可靠化升级版本——是一种合适的替代选择。

# HTTP版本

## HTTP/1.0

最初的http只是使用在一些较为简单的网页和请求上，所以比较简单，每次请求都打开一个新的TCP连接，收到响应后立即断开连接

## HTTP/1.1

- HTTP/1.1引入了更多的缓存控制策略，如Entity tag、If-Unmidified-Since、If-Match、If-None-Match等
- HTTP/1.1允许范围请求，即在请求头中加入`Range`头部
- HTTP/1.1的请求消息和响应消息都必须包含`Host`头部，以区分同一个物理主机中的不同虚拟终极的域名
- HTTP/1.1默认开启持久连接，在一个TCP连接上可以传输多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟

## HTTP/2.0

在HTTP/2.0中，有两个非常重要的概念，帧（frame）和流（stream），理解这两个概念是理解下面多路复用的前提。帧代表数据传输的最小单位，每个帧都又序列标识表明该帧属于哪个流，流也就是多个帧组成的数据流，每个流表示一个请求。

- 新的二进制格式
  HTTP/1.x的解析是基于文本的。基于文本协议的解析存在天然缺陷，文本的表现形式有多样性，要做到全面性考虑的场景 必然很多。二进制则不同，只识别0和1的组合。基于这种考虑HTTP/2.0的协议解析采用二进制格式，方便且强大
- 多路复用
  HTTP/2.0支持多路复用，这是HTTP/1.1持久连接的升级版。多路复用，就是在一个TCP连接中可以存在多条流，也就是可以发送多个请求，服务端则可以通过帧中的标识知道该帧属于哪个流（即请求），通过重新排序还原请求。多路复用允许并发地发起多个请求，每个请求及该请求地响应不需要等待其他地请求和响应，避免了线头阻塞问题。这样某个请求任务好事严重并不会影响到其他连接地正常执行，极大地提高了传输性能
- 头部压缩
  HTTP/1.x的请求和响应头部带有大量信息，并且每次请求都要重新发送，HTTP/2.0使用encoder来减少需要传输的头部大小，通讯双方各自cache一份头部fields表，既避免了重复头部的传输，又减小了需要传输的大小
- 服务端推送
  这里的服务端推送指的是和把客户端需要的css/js/img资源伴随着html一起发送到客户端，省去了客户端重复请求的步骤

# HTTP报文

用户HTTP协议交互的信息被称为HTTP报文。客户端的HTTP报文称为请求报文，服务端的HTTP报文称为响应报文

请求报文是由请求行（请求方法、协议版本）、请求首部（请求URI、客户端信息）和内容实体（用户信息和资源信息，可为空）构成

响应报文是由状态行（协议版本、状态码）、响应首部（服务器名称、资源标识等）和内容实体（服务端返回的资源信息）构成

## 请求方法

- GET
  GET方法请求一个指定资源的表示形式，使用GET请求应该之被用于获取数据
- POST
  POST方法用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用
- PUT
  PUT方法用请求有效载荷替换目标的所有当前表示
- DELETE
  DELETE方法删除指定的资源
- HEAD
  HEAD方法请求一个与GET请求的响应相同的响应，但没有响应体
- OPTIONS
  OPTIONS方法用于描述目标资源的通信选项

## 状态码

响应分为五类：信息响应(`100`–`199`)，成功响应(`200`–`299`)，重定向(`300`–`399`)，客户端错误(`400`–`499`)和服务器错误 (`500`–`599`)

[具体参照](https://www.jianguoyun.com/static/stackedit/[https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status))

## 首部字段

根据不同上下文，可将消息头分为：

- [General headers](https://developer.mozilla.org/en-US/docs/Glossary/General_header): 同时适用于请求和响应消息，但与最终消息主体中传输的数据无关的消息头。
- [Request headers](https://developer.mozilla.org/en-US/docs/Glossary/Request_header): 包含更多有关要获取的资源或客户端本身信息的消息头。
- [Response headers](https://developer.mozilla.org/en-US/docs/Glossary/Response_header): 包含有关响应的补充信息，如其位置或服务器本身（名称和版本等）的消息头。
- [Entity headers](https://developer.mozilla.org/en-US/docs/Glossary/Entity_header): 包含有关实体主体的更多信息，比如主体长(Content-Length)度或其MIME类型。

[具体参照](https://www.jianguoyun.com/static/stackedit/[https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers))