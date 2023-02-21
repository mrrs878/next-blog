---

title: "React.js学习-StreamingSSR"
tags: "React.js StreamingSSR SSR"
categories: "React.js"
description: ""
createDate: "2023-02-07 20:41:44"
updateDate: "2023-02-17 19:57:42"

---

流式服务端渲染

首先，让我们看一下 React18 之前是怎么实现 SSR 的

## HTTP分块传输

不过在此之前，我们可能需要先了解一下**HTTP分块传输**

> 分块传输编码（Chunked transfer encoding）是超文本传输协议（HTTP）中的一种数据传输机制，允许 HTTP 由网页服务器发送给客户端应用（ 通常是网页浏览器）的数据可以分成多个部分。分块传输编码只在 HTTP 协议 1.1 版本（HTTP/1.1）中提供。

当 HTTP 的响应头设置 `Transfer-Encoding: chunked` 时，服务器端就可以将 Response 分段返回

如下示例

```js
app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Transfer-Encoding", "chunked");

  res.write("<html><body><div>First segment</div>");
  res.write("<div>Second segment</div></body></html>");

  res.end();
});
```

完整版 demo[看这里](https://github.com/mrrs878/snippets/tree/main/demos/node-streaming)

在使用 telnet 测试时，可以清楚地看到响应报文中的 `chunked` 数据格式: 先是一行 16 进制数据（表示接下来数据的长度），然后是数据；然后再是 16 进制长度和数据，如此重复，最后是 0 长度分块结束

![renderString timing](/img/streaming-ssr-4.png)

这样，针对于页面渲染，**浏览器就可以先渲染部分，而后持续接收服务端返回的数据来继续渲染**

## renderToString & renderToNodeStream

这是 React18 之前提供的用于 SSR 的 API ，两个方法都可用于在服务端渲染组件，两者的区别在于 `renderToString` 会将一个组件渲染为 HTML 字符串， 而 `renderToNodeStream` 会将一个组件渲染称为一个 Node.js 可读流，可通过 `res.write` 将数据传递给客户端

这是一个典型的SSR应用架构。在用户访问页面时，先在服务端使用一些 React 提供的 API 将将组件渲染为 html 发送给客户端，这样客户端能够在 javascript 执行完毕前展示基本的 html 内容，减少白屏等待时间。然后在 javascript 加载完毕后对现有的 html 元素进行事件绑定（注水），注水完毕后才是一个正常的 React 应用

虽然可以实现 SSR ，但存在一些弊端： 

1. **存在大量的阻塞性行为：服务端需要等待组件全部渲染完毕后才能发送给客户端；客户端需要等待所有组件的 javascript 加载完毕后才能进行注水操作（渲染逻辑复杂时，页面首次渲染到可交互之间可能存在较长的不可交互时间）**

2. **不支持懒加载/代码分割**

好消息是 React18 中的 [Fizz](https://github.com/facebook/react/pull/14144) 架构带来了两个新的特性可以完美解决这些问题，即**Streaming HTML（流式渲染）**和**Selective Hydration（选择性注水）**

接下来让我们看看 React18 是如何解决这些问题的

## 流式渲染（Streaming HTML）

### renderToPipeableStream

虽然 `renderToNodeStream` 相对于 `renderToString` 有一定的性能提升，但还存在一个问题**需要等服务端将整个页面渲染完毕后才会开始传输数据**，复杂情况下，如果某个组件内有耗时的操作，这样就会阻塞 HTML 的生成。对此，React18 提供了一个新的 API `renderToPipeableStream` ，相较于 `renderToNodeStream` 该方法可以分段传输 HTML 到浏览器，这样浏览器就可以更快地启动 HTML 的渲染，提高性能

## 选择性注水 （Selective Hydration）

## Ref

- [分块传输编码](https://zh.wikipedia.org/wiki/%E5%88%86%E5%9D%97%E4%BC%A0%E8%BE%93%E7%BC%96%E7%A0%81)

- [rendertonodestream](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertonodestream)

- [浅析 React 18 Streaming SSR（流式服务端渲染）](https://juejin.cn/post/7064759195710521381)

- [React Streaming SSR 原理解析](https://mp.weixin.qq.com/s?__biz=Mzg2ODQ1OTExOA==&mid=2247501565&idx=1&sn=b9488bb90455e33eb94ec379c46ce42b&chksm=cea971fcf9def8ea0f176bb06ab65ab4bcf20bfc605f8d728ca382a9de8e72cdfd7c1d1b0930&token=805012839&lang=zh_CN#rd)
