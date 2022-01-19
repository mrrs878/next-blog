---
title: "JavaScript复习-手写题"
tags: "JavaScript 手写题"
categories: "2021复习"
description: ""
createDate: "2021-05-27 02:07:18"
updateDate: "2021-07-05 23:25:14"
---


## map、reduce、flatten函数

``` js
function myMap(src, cb) {
  if (!Array.isArray(src)) throw new TypeError('src must be an array');
  const tmp = [];
  src.forEach((item) => tmp.push(cb(item)));
  return tmp;
}

function myReduce(src, cb, initialValue) {
  if (!Array.isArray(src)) throw new TypeError('src must be an array');
  let init = initialValue || src[0];
  const tmp = initialValue ? src : src.slice(1);
  tmp.forEach((item, index) => {
    init = cb(init, item, index, tmp);
  });
  return init;
}

const flatten = (arr, dep = 1) => (dep > 0
  ? arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? flatten(cur, dep - 1) : cur), [])
  : arr.slice());
```

## curry函数

``` js
function myCurry(fn) {
  return (...args) => (fn.length === args.length
    ? fn.call(null, ...args)
    : fn.bind(null, ...args));
}
```

## 异步求和

原文地址: [一道字节笔试题，实现一个异步求和函数](https://mp.weixin.qq.com/s/RBk-cLUU-ZT4ylqIR2XdJg)
提供一个异步 add 方法如下，需要实现一个`await sum(...args)`函数

``` js
function asyncAdd(a, b, callback) {
  setTimeout(() => {
    callback(null, a + b);
  }, 1000);
}

function sum2(a, b) {
  return new Promise((resolve, reject) => {
    asyncAdd(a, b, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

function sum(...args) {
  if (args.length === 0) return Promise.resolve(0);
  if (args.length === 1) return Promise.resolve(args[0]);
  return new Promise((resolve) => {
    args.reduce(
      (pre, cur) => pre.then((total) => sum2(total, cur)),
      Promise.resolve(0),
    ).then(resolve);
  });
}

async function sumTmp(...args) {
  if (args.length === 1) return Promise.resolve(args[0]);
  const res = args.reduce(async (a, b) => sum2(await a, b), Promise.resolve(0));
  return res;
}

async function performanceSum(...args) {
  const tmp = JSON.parse(JSON.stringify(args));
  const { length } = tmp;
  if (length === 1) return Promise.resolve(tmp[0]);
  const resultArray = [];
  if (length % 2) tmp.push(0);
  for (let i = 0; i < tmp.length / 2; i += 1) {
    resultArray.push([tmp[i * 2], tmp[i * 2 + 1]]);
  }
  const res = await Promise.all(resultArray.map(([a, b]) => sum2(a, b)));
  return performanceSum(...res);
}
```

## rgb(255, 255, 255)转#ffffff

``` js
function rgb2hex(rgb) {
  const [r, g, b] = rgb.match(/\d+/g);
  return `#${
    [r, g, b].map((item) => (+item).toString(16).padStart(2, '0')).join('')
  }`;
}
```

## Promise.all

``` js
function promiseAll(promises) {
  if (!promises[Symbol.iterator]) throw new TypeError('promises must be iterable');
  return new Promise((resolve, reject) => {
    const resolvedPromises = [];
    promises.forEach((promise) => Promise.resolve(promise).then((res) => {
      resolvedPromises.push(res);
      if (resolvedPromises.length === promises.length) resolve(resolvedPromises);
    }, reject));
  });
}
```

## Promise.allSettled

``` js
const PromiseStatus = {
  resolved: 'fulfilled',
  rejected: 'rejected',
};
function promiseAllSettled1(promises) {
  if (!promises[Symbol.iterator]) throw new TypeError('promises must be iterable');
  const onResolve = (value) => ({ status: PromiseStatus.resolved, value });
  const onReject = (reason) => ({ status: PromiseStatus.rejected, reason });
  return Promise.all(promises.map((promise) => Promise.resolve(promise).then(onResolve, onReject)));
}

function promiseAllSettled2(promises) {
  if (!promises[Symbol.iterator]) throw new TypeError('promises must be iterable');
  return new Promise((resolve) => {
    const res = [];
    promises.map((promise) => Promise.resolve(promise).then((value) => {
      res.push({ status: PromiseStatus.resolved, value });
      if (res.length === promises.length) resolve(res);
    }, (reason) => {
      res.push({ status: PromiseStatus.rejected, reason });
      if (res.length === promises.length) resolve(res);
    }));
  });
}
```

## Promise.any

``` js
function promiseAny(promises) {
  if (!promises[Symbol.iterator]) throw new TypeError('promises must be iterable');
  return new Promise((resolve, reject) => {
    const { length } = promises;
    const rejectedPromises = [];
    promises.forEach((promise) => Promise.resolve(promise).then(resolve, (err) => {
      rejectedPromises.push(err);
      if (rejectedPromises.length === length) reject(rejectedPromises);
    }));
  });
}
```

## shallowEqual

``` js
function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 !== 'object'
    || obj1 === null
    || typeof obj2 !== 'object'
    || obj2 === null
  ) return false;

  if (Reflect.ownKeys(obj1).length !== Reflect.ownKeys(obj2).length) return false;
  const keys = Reflect.ownKeys(obj1);
  for (let i = 0; i < keys.length; i += 1) {
    if (obj1[keys[i]] !== obj2[keys[i]]) return false;
  }
  return true;
}
```

## shuffle

``` js
const shuffle = (list) => list.sort(() => Math.random() - 0.5)
```