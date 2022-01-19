---
title: "网络-websocket"
tags: "websocket"
categories: "网络"
description: ""
createDate: "2021-05-06 14:12:47"
updateDate: "2021-05-07 10:49:52"
---


## 什么是websocket

- HTML5提出的一种应用层网络协议

- 全双工通信

## 如何建立连接

websocket服用了http的握手通道：客户端通过http请求与websocket服务端协商升级协议，协议升级完成后，后续的数据交换则遵照websocket协议

1. 客户端发送协议升级请求

首先，客户端发起协议升级`GET`请求

``` http
GET / HTTP/1.1
Host: localhost:8080
```

2. 服务端响应协议升级

## 数据帧格式

## 如何维持连接

