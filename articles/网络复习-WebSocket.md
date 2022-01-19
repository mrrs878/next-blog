---
title: "网络复习-WebSocket"
tags: "WebSocket"
categories: "2021复习"
description: ""
createDate: "2021-05-10 05:04:10"
updateDate: "2021-05-10 18:53:03"
---


## WebSocket是什么

HTML5开始提供的一种浏览器与服务器进行**全双工通讯**的网络技术，属于**应用层协议**、基于**TCP**、**复用HTTP的握手通道**

## 和长轮训的区别

长轮训就是客户端发起一个请求，服务器收到客户端发送的请求后，服务端不会直接进行响应，而是先将这个请求挂起，然后判断请求的数据是否有更新，如果有更新，则进行更新，如果一直没有数据，则等待一定的时间后返回

## 如何建立连接

`WebSocket`复用了`HTTP`的握手通道。客户端通过`HTTP`请求与`WebSocket`服务器协商**升级协议**，协议升级完成后，后续的数据交换则按照`WebSocket`的协议。

首先，客户端发起协议升级请求

``` http
GET ws://localhost:8080/ HTTP/1.1
Connection: Upgrade
Host: localhost:8080
Origin: http://localhost:3000
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
Sec-WebSocket-Key: wXE7gVKUV5flJWEnJLr8pw==
Sec-WebSocket-Version: 13
Upgrade: websocket
```

然后服务端响应协议升级

``` http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: DeY5PvpKJhTquRvvA7TPBcinVBk=
```

代码演示：

服务端(使用`ws`库)：

``` js
const express = require("express");
const ws = require("ws");

const app = express();
const wsServer = new ws.Server({ port: 8080 });

wsServer.on("connection", (ws) => {
  console.log("server: connected to a client");
  ws.on("message", (msg) => {
    console.log(`server: message receive from client--${msg}`);
  });
  ws.send("hello client");
  ws.ping("", false, () => {});
});

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
})

app.listen(3000);
```

客户端：

``` html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <main class="container">
    <button onclick="sendMessage()">sendMessage</button>
  </main>
  <script>
    const wsClient = new WebSocket("ws://localhost:8080");
    wsClient.onopen = () => {
      console.log("client: connected to server");
    }
    wsClient.onmessage = (msg) => {
      console.log(`client: receive from server--${msg.data}`);
    }

    function sendMessage() {
      wsClient.send("hello server");
    }
  </script>
</body>
</html>
```

运行结果：

``` shell
# 客户端
client: connected to server
client: receive from server--hello client

# 服务端
server: connected to a client
```

## 数据交换

一旦`WebSocket`客户端、服务端建立连接后，后续的操作都是基于**数据帧**的传递

`WebSocket`根据`opcode`来区分操作的类型。比如`0x8`表示断开连接，`0x0-0x2`表示数据交互

数据分片：

`WebSocket`的每条消息可能被切分成多个数据帧。当`WebSocket`的接收方接收到一个数据帧时，会根据FIN的值进行判断，是否已经收到消息的最后一个数据帧

``` http
# 一个完整的消息(FIN=1且opcode != 0x0)
Client: FIN=1, opcode=0x1, msg="hello"
Server: (process complete message immediately) Hi.

# 文本消息且消息还没发送完成
Client: FIN=0, opcode=0x1, msg="and a"
Server: (listening, new message containing text started)
# 延续帧
Client: FIN=0, opcode=0x0, msg="happy new"
Server: (listening, payload concatenated to previous message)
# 最终帧
Client: FIN=1, opcode=0x0, msg="year!"
Server: (process complete message) Happy new year to you too!
```

## 心跳

在Websocket中定义了**心跳ping(0x9)** 和 **心跳pong(0xA)** 的控制帧

## 参考

[WebSocket：5分钟从入门到精通
](https://juejin.cn/post/6844903544978407431)
