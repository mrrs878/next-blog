---

title: "React.js学习-StreamingSSR"
tags: "React.js StreamingSSR SSR"
categories: "React.js"
description: ""
createDate: "2023-02-07 20:41:44"
updateDate: "2023-02-15 21:53:42"

---

流式服务端渲染

## 服务端渲染（SSR）

## 流式渲染（Streaming HTML）

在开始之前，先了解一下流式渲染的基本原理: HTTP分块传输

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

## renderToString

这是本文介绍的第一个 API ，官方释义如下

> 将一个 React 元素渲染成其初始的 HTML。React 将返回一个 HTML 字符串。你可以使用这种方法在服务器上生产 HTML，并在初始请求中发送标记。以加快页面加载速度，并允许搜索引擎以 SEO 为目的抓取你的页面。

简单来说就是可以将一个组件渲染为 HTML 字符串，客户端直接解析字符串

如下所示

```tsx
app.get("/renderToString", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Transfer-Encoding", "chunked");

  res.write(`
  <html>
    <head>
      <meta http-equiv="content-type" content="text/html; charset=utf-8">
    </head>
    <body>
      <div>First segment</div>
  `);

  const html = renderToString(<App />);

  res.write(html);
  res.write("</div></body></html>");
  res.end();
});
```

完整版 demo 看[这里](https://github.com/mrrs878/snippets/blob/7290212d81dd1a290d5930fc55cf6d4c9ecd1797/demos/react-streaming-ssr/index.tsx#L81)

下图是该方式下的请求时间图

![renderToNodeStream timing](/img/streaming-ssr-1.png)

## renderToNodeStream

与 `renderToString` 不同的是， `renderToNodeStream` 会将一个组件渲染称为一个 Node.js 可读流，可通过 `res.write` 将数据传递给客户端

如下所示

```tsx
import { renderToNodeStream } from "react-dom/server";

const App: FC = () => (
  <div>
    {new Array(10).fill(0).map(() => (
      <Table dataSource={dataSource} columns={columns} />
    ))}
  </div>
);

app.get("/renderToString", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Transfer-Encoding", "chunked");

  res.write(`
  <html>
    <head>
      <meta http-equiv="content-type" content="text/html; charset=utf-8">
    </head>
    <body>
      <div>First segment</div>
  `);

  const html = renderToString(<App />);

  res.write(html);
  res.write("</div></body></html>");
  res.end();
});
```

完整版 demo 看[这里](https://github.com/mrrs878/snippets/blob/7290212d81dd1a290d5930fc55cf6d4c9ecd1797/demos/react-streaming-ssr/index.tsx#L57)

下图是该方式下的请求时间图

![renderToNodeStream timing](/img/streaming-ssr-0.png)

可以看出，相较于 `renderToString` , `renderToNodeStream` 的 TTFB 更快

![renderToString VS renderToNodeStream](/img/streaming-ssr-5.png)

## renderToPipeableStream

虽然 `renderToNodeStream` 相对于 `renderToString` 有一定的性能提升，但还存在一个问题**需要等服务端将整个页面渲染完毕后才会开始传输数据**，复杂情况下，如果某个组件内有耗时的操作，这样就会阻塞 HTML 的生成。对此，React18 提供了一个新的 API `renderToPipeableStream` ，相较于 `renderToNodeStream` 该方法可以分段传输 HTML 到浏览器，这样浏览器就可以更快地启动 HTML 的渲染，提高性能

该 API 的使用方式如下所示

```tsx
app.get("/renderToPipeableStream", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Transfer-Encoding", "chunked");

  res.write(`
  <html>
    <head>
      <meta http-equiv="content-type" content="text/html; charset=utf-8">
    </head>
    <body>
      <div>First segment</div>
  `);

  let didError = false;
  const stream = renderToPipeableStream(<App />, {
    bootstrapScripts: ["main.js"],
    onShellReady() {
      res.statusCode = didError ? 500 : 200;
      stream.pipe(res);
    },
    onShellError() {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  });
});
```

完整版 demo 看[这里](https://github.com/mrrs878/snippets/blob/7290212d81dd1a290d5930fc55cf6d4c9ecd1797/demos/react-streaming-ssr/index.tsx#L101)

# Ref

- [分块传输编码](https://zh.wikipedia.org/wiki/%E5%88%86%E5%9D%97%E4%BC%A0%E8%BE%93%E7%BC%96%E7%A0%81)

- [rendertonodestream](https://zh-hans.reactjs.org/docs/react-dom-server.html#rendertonodestream)

- [浅析 React 18 Streaming SSR（流式服务端渲染）](https://juejin.cn/post/7064759195710521381)

- [React Streaming SSR 原理解析](https://mp.weixin.qq.com/s?__biz=Mzg2ODQ1OTExOA==&mid=2247501565&idx=1&sn=b9488bb90455e33eb94ec379c46ce42b&chksm=cea971fcf9def8ea0f176bb06ab65ab4bcf20bfc605f8d728ca382a9de8e72cdfd7c1d1b0930&token=805012839&lang=zh_CN#rd)
