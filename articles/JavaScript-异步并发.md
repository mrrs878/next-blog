---
title: "JavaScript-异步并发"
tags: "异步 并发 队列 Promise.all"
categories: "JavaScript"
description: ""
createDate: "2022-05-08 21:58:54"
updateDate: "2022-05-08 22:39:51"
---

来源于一道面试题

_请实现如下的函数：可以批量请求数据，所有的 URL 地址在 urls 参数中，同时可以通过 max 参数控制请求的并发度，当所有请求结束后，需要执行 callback 回调函数。发送请求的函数直接使用 fetch 即可_

划出重点：请求数据、控制请求的并发度

## Promise.all

第一眼想到 `Promise.all` 实现，于是开写，但写着写着发现不对劲，这样貌似不算并发，或者说没有达到要求的并发度控制: `Promise.all`只能在当前所有`promises`请求完毕后才能开启下一次请求，这样并不能吃满 `max` 并发度，需要变换策略

## 闭包 + 循环 + 递归

可以使用闭包+循环+递归来解决：循环控制并发度，递归来发送所有请求

```js
const request = (...args) => fetch(...args).then((res) => res.json());
const minIn2 = (a, b) => (a > b ? b : a);

const macAddresses = new Array(10)
  .fill("")
  .map((_, index) => `http://localhost:8080/${index}`);

function sendRequest(urls, max, callback) {
  const res = [];
  let i = 0;

  async function doRequest(url) {
    try {
      const r = await request(url);
      res.push(r);
    } catch (e) {
      res.push(e);
    } finally {
      if (res.length === urls.length) {
        callback(res);
      }
      if (i === urls.length) {
        return;
      }
      doRequest(urls[i++]);
    }
  }

  for (; i < minIn2(max, urls.length); i += 1) {
    doRequest(urls[i]);
  }
}

sendRequest(macAddresses, 3, (res) => {
  console.log(res);
});
```

这里面有个关键的变量`i`，该变量维护了当前完成到哪个请求

这个回答在面试时应该可以应付第一波攻势，但如果对方进一步发问，如果我的 urls 不是预先制定好的，我可以通过调用多次 `sendRequest` 来发送请求，那这应该怎么实现呢

## 队列

针对于进一步发问，这时候就没有那么简单了，因为我们同时还要维护所有urls，这样的话我们可以引入队列来解决，即：相较于上面的`i`，这里使用一个队列来维护当前完成到哪个请求

1. 使用一个`queue`来保存所有的请求

2. 入队后立即出队

3. 在出队过程中先判断有没有达到最大并发度，如果有直接退出出队逻辑，若没有，则执行当前节点，完毕后继续出队即重复当前逻辑


```js
class Queue {
  constructor({ concurrency = 1, onCompleted } = {}) {
    this.queue = [];
    this.pendingPromises = [];
    this.concurrency = concurrency;
    this.onCompleted = onCompleted;
  }

  enqueue(promise) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise,
        resolve,
        reject,
      });
      this.dequeue();
    });
  }

  dequeue() {
    if (this.pendingPromises.length === this.concurrency) {
      return;
    }

    const item = this.queue.shift();
    if (!item) {
      return;
    }

    try {
      this.pendingPromises.push(item.promise);
      item
        .promise()
        .then((value) => {
          this.pendingPromises.shift();
          item.resolve(value);
          this.dequeue();
        })
        .catch((e) => {
          this.pendingPromises.shift();
          item.reject(e);
          this.dequeue();
        });
    } catch (e) {
      this.pendingPromises.shift();
      item.reject(e);
      this.dequeue();
    }
  }
}
```

该队列每个节点为一个返回 Promise 的函数，因此使用时需要注意一下

使用的话可以这样：

```js
const request = (...args) => fetch(...args).then((res) => res.json());

const macAddresses = new Array(10)
  .fill("")
  .map((_, index) => `http://localhost:8080/${index}`);

const queue = new Queue({
  concurrency: 3,
  onCompleted: () => {
    console.log("completed");
  },
});

macAddresses.forEach((address) => {
  queue.enqueue(async () => {
    const res = await request(address);
    console.log(address, res);
  });
});
```

## p-queue

上面实现的 Queue 还不够完善，npm 上有个非常完善的库[p-queue](https://www.npmjs.com/package/p-queue)
