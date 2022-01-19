---
title: "JavaScript相关-骚操作"
tags: "JavaScript 骚操作"
categories: "JavaScript"
description: ""
createDate: "2020-12-02 15:08:45"
updateDate: "2021-05-06 16:08:46"
---


## 自定义事件

```js
const event = new Event('build');
// Listen for the event.
elem.addEventListener('build', function (e) { ... }, false);
// Dispatch the event.
elem.dispatchEvent(event);
```

## sleep函数

```js
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

// 使用
async function test() {
	await sleep(5000);		// sleep 5s
}
```

## 判断事件触发源

使用`HTMLElement.contains`函数，判断所给元素和指定元素是不是父子关系

事件代理中非常有用

## const关键字定义的常量对象不够'常量'的解决办法

使用`Object.freeze()`，这样虽然再给属性负值时不回报错，但会静默失败

## 取cookie

``` js
const getCookie = (name) =>`; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();
```