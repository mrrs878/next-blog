---
title: "JavaScript相关-4"
tags: "JavaScript"
categories: "JavaScript"
description: ""
createDate: "2020-02-17 22:25:05"
updateDate: "10/1/2021, 3:34:43 AM"
---


## 模拟实现call、apply

实现思路：

- 不传入第一个参数，那么默认为`window`
- 改变了`this`指向，让新对象可以执行该函数，那个思路可以变成给新对象添加一个函数，然后在执行完成之后删除

``` javascript
Function.prototype.myCall = function (context) {
  context = context || window
  context.fn = this
  const args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}

Function.prototype.myApply = function(context) {
  context = context || window
  context.fn = this
  const result = arguments[1] ? context.fn(...arguments[1]) : context.fn()
  delete context.fn
  return result
}

Function.prototype.myBind = function(context) {
  if (typeof this !== 'function')
    throw new TypeError("error")
  const that = this
  const args = [...arguments].slice(1)
  return function F() {
    if (this instanceof F) {
      return new that(...args, ...arguments)
    }
    return that.apply(context, args.concat(...arguments))
  }
}

const tom = {
  name: "tom",
  say (tmp1, tmp2) {
    console.log(this.name, tmp1, tmp2);
  }
}
const jack = {
  name: "jack"
}

tom.say.myCall(jack, "111", "222")
tom.say.call(jack, "111", "222")

tom.say.myApply(jack, ["111", "222"])
tom.say.apply(jack, ["111", "222"])

tom.say.myBind(jack)("111", "222")
tom.say.bind(jack)("111", "222")

// jack 111 222
// jack 111 222
// jack 111 222
// jack 111 222
// jack 111 222
// jack 111 222
```

## Promise 实现

`Promise`是ES6新增的语法，解决了回调地狱的问题。可以把`Promise`看作是一个状态机，可以通过函数`resolve`和`reject`将状态转变为`resolved`或`rejected`，状态一旦转变就不能再次变化

`then`函数会返回一个新的`Promise`实例。因为`Promise`规范规定除了`pending`状态，其他状态是不可以改变的，如果返回的是一个相同实例的话，多个`then`调用就失去意义了

对于`then`，本质上可以把它看成是`flatMap`

## Proxy

proxy是ES6中新增的功能，用来定义对象中的操作

``` javascript
function onwatch(obj, setBind, getLogger) {
  const handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value) {
      setBind(target, property, value)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: 1 }
let p = onwatch(obj, (target, property, value) => {
  console.log(`set ${ property } = ${ value }`);
}, (target, property) => {
  console.log(`get ${ property } = ${ target[property] }`);
})

p.a = 2
console.log(p.a);

// set a = 2
// get a = 2
```

## 正则表达式

**元字符**

| 元字符 |             作用             |
| :