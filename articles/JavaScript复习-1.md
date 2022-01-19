---
title: "JavaScript复习-1"
tags: "JavaScript"
categories: "2021复习"
description: ""
createDate: "2021-05-11 14:27:01"
updateDate: "2021-06-15 23:15:37"
---


## Proxy和Reflect

可以给目标对象定义一个关联的对象，而这个代理对象可以作为抽象的目标对象来使用。默认情况下，在代理对象上执行的所有操作都会无障碍地传播到目标对象。使用`new Proxy(target, handler)`来创建

`handler`对象中所有可以捕获的方法都有对应的反射`Reflect` API方法，这些方法与捕获器拦截的方法具有相同的名称，也具有与被拦截方法相同的行为

``` js
const target = {
    name: 'tom';
}

const proxy = new Proxy(target, {
    get: Reflect.get,
})
```

`Proxy.prototype`为`undefined`，因此不能使用`instanceof`操作符，会抛出`TypeError`

`Proxy.revocable`方法会返回一个`revoke`方法，用来撤销代理。撤销代理的操作是不可逆、幂等的，撤销后再次访问代理会抛出`TypeError`

``` js
const revocableProxy = Proxy.revocable({
  name: 'tom'
}, {
  get: Reflect.get,
  set: Reflect.set,
});

revocableProxy.proxy.name; // tom
revocableProxy.revoke();
revocableProxy.proxy.name; //TypeError
```

## instanceof原理

**原型链**。通过检测构造函数的`prototype`属性是否出现在某个实例对象的原型链上，运算符左侧是实例对象，右侧是构造函数

``` js
function myInstanceof(instance, object) {
  const proto = Reflect.getPrototypeOf(instance);
  if (proto === null) return false;
  if (object.prototype === proto) return true;
  return myInstanceof(proto, object);
}
```

## 防抖、节流

一种性能优化手段，避免函数过多执行（多用来优化滑动/点击事件回调）

防抖:：在规定的时间内若再次触发则重新及时

节流：在规定的时间内若再次触发(触发间隔大于规定的时间)只会执行一次

``` js
function debounce(cb, timeout) {
  let timer = null;
  let canceled = false;
  function _denounce(...args) {
    let res;
    clearTimeout(timer);
    if (canceled) {
      res = cb.apply(this, args);
    } else {
      timer = setTimeout(() => {
        res = cb.apply(this, args);
      }, timeout);
    }

    return res;
  }

  _denounce.cancel = function () {
    canceled = true;
  };

  return _denounce;
}
```

``` js
function throttle(cb, timeout) {
  let lastTime = 0;
  let canceled = false;

  function _throttle(...args) {
    const now = Date.now();
    let res;
    if (canceled) {
      res = cb.apply(this, args);
    } else if (lastTime + timeout < now) {
      lastTime = now;
      res = cb.apply(this, args);
    }

    return res;
  }

  _throttle.cancel = () => {
    canceled = true;
  };

  return _throttle;
}
```

##  函数的name属性

es6所有的函数都会暴露出一个`name`属性，其中包含关于函数的信息。多数形况下这个属性是一个字符串化的变量名，等于该函数的名字。

如果使用`Function`构造函数创建的，则会标识成`anonymous`

如果函数是一个`get`、`set`或使用`bind()`实例化，那么标识符前会加一个前缀

## 箭头函数的特性

- 不能使用`arguments`、`super`、`new.target`
- 不能用作构造函数
- 没有`prototype`属性
- 没有`this`

## 函数重载

JavaScript中没有函数重载。因为ECMAScript函数**没有签名**，函数的参数在内部表现为一个包含零个或多个值的数组。

## new.target

ES6新增了检测函数是否使用`new`关键字调用的`new.target`属性。如果函数是正常调用的`new.target`的值是`undefined`；如果是使用`new`关键字调用的，则`new.target`将引用被调用的构造函数

``` js
function User() {
  if (!new.target) {
    throw new Error(errorMessage);
  }
  console.log(successMessage);
}
```

## arguments.callee

~~`arguments`对象有一个`callee`属性，是一个指向`arguments`对象所在函数的指针。使用`arguments.callee`可以让函数逻辑与函数名解耦：~~

不推荐使用`arguments`（VSCode+eslint使用时会报错），因为**访问arguments是个很昂贵的操作，它是个很大的对象**，每次递归调用时都需要重新创建，影响现代浏览器的性能，还会影响闭包。推荐创建临时函数+闭包实现

``` js
function factorial(num) {
  let tmp = num;
  if (tmp < 1) return 1;
  let res = 1;
  function fn() {
    res *= tmp;
    tmp -= 1;
    if (tmp !== 0) return fn();
    return res;
  }
  return fn();
}
```

## 尾调用优化

ES6新增了一项内存管理机制，让JavaScript引擎在满足响应条件时可以重用栈帧。具体来说这项优化非常适合*尾调用*即**外部函数的返回值是一个内部函数的返回值**

尾调用优化的条件：

1. 代码在严格模式下运行
2. 外部函数的返回值是对尾调函数的引用
3. 尾调用函数返回后不需要执行额外的操作
4. 尾调用函数没有产生闭包(无法释放外部函数的栈帧)

优化`factorial`

``` js
function factorialPerform(num) {
  function fn(m, n) {
    if (n === 1) return m;
    return fn(m * n, n - 1);
  }

  return fn(num, num - 1);
}
```

优化`fib`

``` js
function fib(num) {
  if (num < 2) return num;
  return fib(num - 1) + fib(num - 2);
}

function fibPerform(num) {
  function fibImpl(m, n, x) {
    if (x === 0) return m;
    return fibImpl(n, m + n, x - 1);
  }

  return fibImpl(0, 1, num);
}
```

## JSON.stringify

`JSON.stringify(value[, replacer [, space]])`，将一个JavaScript对象或值转换为JSON字符串，如果指定了`replacer`，则可以选择性地替换值，或将指定的`replacer`是数组，则可选择性地仅包含数组指定的属性

注意：

- 当在`value`存在循环引用时会抛出异常`TypError("cyclic object value")`
- 当尝试去转换`BigInt`类型的值会抛出`TypeError("BigInt value can't be serialized in JSON")`
- 如果`vaule`存在`toJSON()`方法，则返回该函数返回值
- 非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中
- `Boolean`、`Number`、`String`包装对象会在序列化过程中自动转换为原始值
- 非数组对象的属性值为`undefined`、任意的函数、`symbol`会在序列化中被忽略，数组对象则会转换成`null`
- `Map`、`Set`、`WeakMap`、`WeakSet`仅会序列化可枚举属性
- 函数、`undefined`被单独转换时会返回`undefined`
- `Date`类型会转化为`Date.toISOString()`返回的值

`replacer`为函数时：

- 如果返回一个`Number`，转换为相应地字符串作为属性值被添加到JSON字符串
- 如果返回一个`String`，该字符串作为属性值被添加入JSON字符串
- 如果返回一个`Boolean`，`true`或`false`作为属性值被添加到JSON字符串
- 如果返回其他对象，该对象递归地序列化为JSON字符串，对每个属性调用`replacer`方法。如果该对象是一个函数，则忽略
- 如果返回`undefined`则忽略

## jsonp

``` js
function jsonp(url) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    window.jsonpCallback = (data) => {
      resolve(data);
      document.body.removeChild(script);
    }
    script.src = `${url}${url.includes('?') ? '&' : '?'}cb=jsonpCallback`;
    document.body.appendChild(script);
  })
}
```

## 取消网络请求

根据所使用的API的不同，有不同的解决方案：

- `XMLHttpRequest`
    使用`XMLHttpRequest.abort()`
    ``` js
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'url', true);
    xhr.send(null);
    xhr.abort();
    ```
- `fetch`
    使用`AbortController`
    ``` js
    const controller = new AbortController();
    const signal = controller.signal;
    fetch('url', { signal });
    controller.abort();
    ```
- `axios`
    使用`CancelToken`
    ``` js
    const source = axiox.CancelToken.source();
    const cancelToken = source.token;
    
    axios.get('url', { cancelToken });
    source.cancel();
    ```
    
## findIndex和indexOf

`findIndex`根据所给函数进行匹配，`indexOf`使用`===`进行匹配

``` js
const students = [{ name: 'tom', age: 23 }, { name: 'jerry', age: 32 }]

students.indexOf({ name: 'tom', age: 23 }) // -1
students.findIndex((item) => item.name === 'tom' && item.age === 23) // 0
```

## TDZ(暂时性死区)

在JavaScript中，当控制流进入到它们出现的范围内，所有绑定都会被实例化。传统的`var`和`function`声明允许在实际声明之前访问那些绑定，并且值（`value`）为`undefined`。这种遗留行为被称为**变量提升（hosting）**。`let`和`const`声明也会被实例化，但**运行到实际声明之前禁止访问**。这称为**暂时性死区(TDZ)**

## WeakMap

在JavaScript中，map API可以通过使用其四个API方法共用两个数组（一个存放key，一个存放value）来实现。给这种map设置value时会同时将key和value添加到这两个数组的尾部。从而使得key和value的索引在两个数组中相对应。当从该map取值的时候，需要遍历所有的key，然后再使用索引从存储value的数组中检索出相应的value

但这样的实现会有两个很大的缺点，首先赋值和搜索操作都是O(n)的时间复杂度。另一个缺点是可能导致内存泄漏，因为数组会一直引用着每个key和value。这种引用使得垃圾回收算法不能回收处理它们，即使没有其他引用存在了

相比之下，原生的WeakMap持有的是每个键对象的**弱引用**，这意味着没有其他引用存在时垃圾回收能正确进行。原生的WeakMap的结构是特殊且**有效**的，其用于映射的key只有在其没有被回收时才是有效的

正由于这样的弱引用，WeakMap的key是**不可枚举**的（没有办法给出所有的key，key取决于垃圾回收器的状态，是不可预知的）。如果key是可枚举的，其列表将会受垃圾回收机制的影响，从而得到不确定的结果。

## 参考

[mdn-JSON.stringify()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

[如何取消请求的发送](https://github.com/shfshanyue/Daily-Question/issues/502)

[mdn-WeakMap](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)