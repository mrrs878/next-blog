---
title: "JavaScript相关-0"
tags: "JavaScript"
categories: "JavaScript"
description: ""
createDate: "2020-02-10 23:18:10"
updateDate: "10/1/2021, 3:34:43 AM"
---


## 事件委托 （event delegation）
事件委托是将事件监听器添加到父元素，而不是每个子元素单独设置事件监听器，当触发子元素时，事件会冒泡到父元素，监听器就会触发，这种技术的好处是：

1. 内存占用少，因为只需要一个父元素的事件处理程序，而不必为每个后代都添加事件处理程序。
2. 无需从已删除的元素中解绑处理程序，也无需将处理程序绑定到新元素上。

## JavaScript中的this指向
简单来讲，`this`的指向取决于函数的调用方式

0. 如果是箭头函数，`this`被设置为调用时的上下文
1. 如果使用`new`，函数内的`this`是一个全新的对象
2. 如果`apply、call、bind`方法用于调用/创建一个函数，函数内的`this`就是作为参数传入这些方法的对象
3. 当函数作为对象里的方法被调用时，函数内的`this`是调用该函数的对象，比如当`obj.method()`被调用时，函数内的`this`将绑定到`obj`对象
4. 如果不符合上述规则，那么`this`的值指向全局对象`global object`，浏览器环境下`this`的值指向`window`对象，但在严格模式下`use strict`，`this`的值为`undefined`
5. 如果符合上述多个规则，从上到下权重依次递减

## 原型继承 `prototypal inheritance`
所有的JS对象都有一个`prototype`对象，指向它的原型对象，当试图访问一个对象的属性时，如果没有在该对象上找到它还会搜索该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或达到原型链的末尾。这种行为是在模拟经典的继承，但与其说时继承还不如说是委托`delegation`

读取对象的属性值时，会自动到原型链中查找

设置对象的属性值时，不会查找原型链，如果当前对象中没有此属性，直接添加此属性并设置其值

![原型](./imgs/1581317824537.png)

## JavaScript的模块化机制

- AMD

  **Asynchronous Module Definition 异步模块加载机制**，ReqireJS实现了AMD规范

  ```javascript
  //a.js
  //define可以传入三个参数，分别是字符串-模块名、数组-依赖模块、函数-回调函数
  define(function(){
      return 1;
  })
  
  // b.js
  //数组中声明需要加载的模块，可以是模块名、js文件路径
  require(['a'], function(a){
      console.log(a);// 1
  });
  ```

  特点：

  对于依赖的模块，AMD推崇**依赖前置，提前执行**，也就是说，在`define`方法里传入的依赖模块（数组）会在一开始就下载并执行。适合在**浏览器端**使用

- CommonJS

  CommonJS规范为CommonJS小组所提出，目的是弥补JavaScript在服务器端缺少模块化机制，**NodeJS、webpack**都是基于该规范来实现的。

  ``` javascript
  //a.js
  module.exports = function () {
    console.log("hello world")
  }
  
  //b.js
  var a = require('./a');
  
  a();//"hello world"
  
  //或者
  
  //a2.js
  exports.num = 1;
  exports.obj = {xx: 2};
  
  //b2.js
  var a2 = require('./a2');
  
  console.log(a2);//{ num: 1, obj: { xx: 2 } }
  ```

  特点：

  - 所有代码都运行在**模块作用域**，不会污染全局作用域
  - 模块是**同步加载**的，即只有加载完成才能执行后面的操作
  - 模块在首次执行后就会**缓存**，再次加载只返回缓存结果，如果想要再次执行，可清除缓存
  - `require`返回的是被输出的**值的拷贝**，模块内部的变化也不会影响这个值

- ES6 Module

  ES6 Module是**ES6**中规定的模块体系

  ``` javascript
  //a.js
  var name = 'lin';
  var age = 13;
  var job = 'ninja';
  
  export { name, age, job};
  
  //b.js
  import { name, age, job} from './a.js';
  
  console.log(name, age, job);// lin 13 ninja
  
  //或者
  
  //a2.js
  export default function () {
    console.log('default ');
  }
  
  //b2.js
  import customName from './a2.js';
  customName(); // 'default'
  ```

  特点（对比CommonJS）：

  |          | CommonJS     | ES6 Module     |
  | 