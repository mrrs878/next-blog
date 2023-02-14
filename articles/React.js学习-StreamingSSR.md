---

title: "React.js学习-StreamingSSR"
tags: "React.js 学习 StreamingSSR SSR"
categories: "React.js"
description: ""
createDate: "2023-02-07 20:41:44"
updateDate: "2023-02-14 22:39:00"

---

流式服务端渲染

## 流式渲染（Streaming HTML）

HTTP 支持以 `stream` 格式进行数据传输。当 HTTP 的 Response header 设置 `Transfer-Encoding: chunked` 时，服务器端就可以将 Response 分段返回

如下示例

```js
app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Transfer-Encoding", "chunked");

  res.write("<html><body><div>First segment</div>");

  await sleep(3000);

  res.write("<div>Second segment</div></body></html>");
  res.end();
});
```

完整版demo[看这里](https://github.com/mrrs878/snippets/tree/main/demos/node-streaming)

在使用 telnet 测试时，可以清楚地看到响应报文中的 `chunked` 数据格式: 先是一行16进制数据（表示接下来数据的长度），然后是数据；然后再是16进制长度和数据，如此重复，最后是0长度分块结束

![renderString timing](/img/streaming-ssr-4.png)

## 服务端渲染（SSR）

## renderToNodeStream

![renderString timing](/img/streaming-ssr-1.png)

![renderToNodeStream timing](/img/streaming-ssr-0.png)

## renderToPipeableStream

# Ref

- [浅析 React 18 Streaming SSR（流式服务端渲染）](https://juejin.cn/post/7064759195710521381)

- [React Streaming SSR 原理解析](https://mp.weixin.qq.com/s?__biz=Mzg2ODQ1OTExOA==&mid=2247501565&idx=1&sn=b9488bb90455e33eb94ec379c46ce42b&chksm=cea971fcf9def8ea0f176bb06ab65ab4bcf20bfc605f8d728ca382a9de8e72cdfd7c1d1b0930&token=805012839&lang=zh_CN#rd)
