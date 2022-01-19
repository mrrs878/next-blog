---
title: "JavaScript复习-异步"
tags: "JavaScript Promise Generator Promise"
categories: "2021复习"
description: ""
createDate: "2021-05-12 10:36:56"
updateDate: "2021-06-24 18:47:28"
---


JavaScript为异步非阻塞，ES6之前主要靠回调函数来实现异步，但由于回调函数容易出现回调地狱等问题，于是ES6+提供了了`Generator`、`Promise`、`async/await`这些API来降低异步编程的难度与复杂度。

## 回调函数

回调函数容易出现回调地狱，可读性差

``` js
function ajax(url, options, onSuccess) {
    // ...
}

ajax('/api/xxx', {}, function () {
    ajax('/api/yyy', {}, function () {
        ajax('/api/zzz', (), function () {
        })
    })
})
```

### Generator

形式上，`generator`函数是一个状态机，封装了多个内部状态。执行`generator`函数会返回一个**遍历器对象**

语法上，`generator`函数是一个普通函数。`function`关键字与函数名之间有一个`*`；函数体内使用`yield`表达式定义不同的内部状态

与普通函数不同，`generator`函数被调用后**并不执行**，返回的是一个指向内部状态的指针对象，也就是**遍历器对象**。下一步，**必须调用遍历器对象的`next`方法**使得指针移向下一个状态，也就是说每次调用`next`方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个`yield`或`return`

``` js
function* gen() {
  const str1 = yield "hello"
  // str1 = 222
  const str2 = yield "world"
  // str2 = 333
  return str2
}

const iter = gen()
console.log(iter.next())
// { value: "hello", done: false }
console.log(iter.next(222))
// { value: "world", done: false }
console.log(iter.next(333))
// { value: 333, done: false }
```

第一次调用，`generator`函数开始执行，直到遇到第一个`yield`表达式为止。`next`方法返回一个对象，它的`value`值就是当前`yield`表达式的值，`done`的值为`false`

第二次调用，`generator`从上次`yield`表达式停下来的地方一直执行到下一个`yield`表达式 👆 ……

第三次调用，`generator`函数从上次`yield`表达式停下来的地方一直执行到`return`语句，`next`返回的`value`值就是`return`后面表达式的值，`done`为`true`

`yield`表达式本身没有返回值（或者说总是返回`undefined`）。`next`方法可以带一个参数，该参数会被当作**上一个**`yield`表达式的返回值

## Promise

ES6提供的一种异步编程方案

一个`Promise`对象必然处于以下三种状态：

- pending，初始状态
- fulfilled，成功
- rejected，失败

`pending`状态的`Promise`对象可以转换为`fulfilled`或`rejected`状态，而且此过程是不可逆的。当状态变更时，`then()`方法注册的回调就会被调用

`then()` 或者 `catch()` 的参数期望是函数，传⼊⾮函数则会发⽣值透传`(value
=> value)`

``` js
Promise.resolve(1)
 .then(2) // .then(1 => 1)
 .then(Promise.resolve(3)) // .then(1 => 1)
 .then(console.log)
// 1
```

``` js
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'GET', url);
    const headers = { 'Content-Type': 'application/json', ...options.headers || {} };
    Reflect.ownKeys(headers)
      .forEach((header) => xhr.setRequestHeader(header, headers[header]));
    xhr.send(options.method === 'POST' ? JSON.stringify(options.data || {}) : null);
    xhr.onerror = (e) => reject(e);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE
        && [200, 201, 301, 302, 304].includes(xhr.status)) {
        resolve(JSON.parse(xhr.responseText));
      }
    };
  });
}
fetch('http://localhost:3004/get').then((res) => {
    console.log(res);
}).catch((e) => {
    console.error(e);
})
```

``` js
new Promise((resolve,reject)=>{
    console.log("1")
    resolve();
}).then(()=>{
    // 外部第1个then
    console.log("2")
    new Promise((resolve,reject)=>{
        console.log("3")
        resolve();
    }).then(()=>{
        // 内部第1个then
        console.log("4")
    }).then(() => {
        // 内部第2个then
        console.log("5")
    })
}).then((res)=>{
    // 外部第2个then
    console.log("6")
})
```

简单来讲就是then回调的注册需要上一个then里面的同步代码执行完毕

拿上面的代码来讲，当外部第1个then里的resovle()执行完毕后，该Promise的状态已经更改，会将内部第1个then回调添加（注册）到微任务队列中；内部第2个then由于上一个then回调没有执行完毕，因此不会注册。此时外部第1个then里的同步代码执行完毕，会注册外部第2个then回调

整理一下：then回调注册的顺序是：外部第1个then --> 内部第1个then --> 外部第2个then --> 内部第2个then

ps: 如果将外部第1个then里的new Promise(xxx)改为return new Promise(xxx)的话内部第2个then的注册将早于* 外部第2个then*

## async/await

目前来讲，最为优秀的一种异步编程方案，与ES2017提出

实现上是`Generator`+`Promise`的语法糖

通过在`onFulFilled()`里调用`next()`、在`next()`里调用`onFulfilled()`形成一个自执行器，只有当全部代码执行完毕后才会终止

``` js
async function fn() {
    try {
        const res = await fetch('http://localhost:3004/get');
        console.log(res);
    } catch (e) {
        console.error(e);
    }
}
```

`async/await`原理: **自动执行generator函数**

``` js
const getData = () =>
  new Promise((resolve) => setTimeout(() => resolve("data"), 1000));

function* testG() {
  // await被编译成了yield
  const data = yield getData();
  console.log("data: ", data);
  const data2 = yield getData();
  console.log("data2: ", data2);
  return "success";
}

function asyncToGenerator(generatorFunc) {
  return function (...args) {
    const gen = generatorFunc.apply(this, args);

    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult;
        try {
          generatorResult = gen[key](arg);
        } catch (error) {
          return reject(error);
        }

        const { value, done } = generatorResult;

        if (done) {
          return resolve(value);
        } else {
          return Promise.resolve(value).then(
            function onResolve(val) {
              step("next", val);
            },
            function onReject(err) {
              step("throw", err);
            }
          );
        }
      }
      step("next");
    });
  };
}

const testGAsync = asyncToGenerator(testG);
testGAsync().then((result) => {
  console.log(result);
});
```

## 参考

[MDN-Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[co-share](https://github.com/imtaotao/co-share)