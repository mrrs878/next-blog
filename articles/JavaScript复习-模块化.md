---
title: "JavaScript复习-模块化"
tags: "JavaScript 模块化"
categories: "2021复习"
description: ""
createDate: "2021-05-12 04:30:39"
updateDate: "2021-06-21 23:26:16"
---


## 模块化解决的问题

- 外部模块的管理
- 内部模块的组织
- 模块源码到目标代码的编译和转换

## 时间线

|  生态  |  诞生时间  |
| -- | -- |
|Node.js|2009|
|NPM|2010|
|requireJS(AMD)|2010|
|seaJS(cmd)|2011|
|browserify|2011|
|webpack|2012|
|grunt|2012|
|gulp|2013|
|react|2013|
|vue|2014|
|angular|2016|
|vite|2020|
|snowpack|2020|

## 外部模块的管理

### script标签

如果我们要在项目里使用某个外部模块，最简单的方法就是去官网把相关的js文件下载下来放在项目目录，在要使用的html页面里通过script标签引用。这样简单粗暴的方法缺点明显：

- 使用上缺乏便利性
- 难以跟踪各个外部模块的来源
- 没有统一的版本管理机制

### npm

2010年，npm伴随着Node.js的新版本一起发布。此后，外部模块管理从原始社会进入现代社会。

- npm是一个远程的JavaScript代码仓库，所有的开发者都可以向这里提交可共享的模块，供其他开发者下载使用
- npm还包含一个命令行工具，开发者通过运行`npm publish`将自己写的模块发布到npm仓库，通过运行`npm install xxx`可以将别人的模块下载到自己项目根目录下一个叫`node_modules`的文件夹里

## 内部模块的组织

### script标签

同引入外部模块一样，通过IIFE去组织内部模块并通过`script`标签引用

``` js
// a.js
var moduleA = (function () {
    // ...
})(window);

// b.js
var moduleB = (function () {
    // ...
})(window);
```

``` html
<script src"/path/to/a.js"></script>
<script src"/path/to/b.js"></script>
```

这种简单粗暴的方式缺点比较明显：

- 随着项目扩大，html文件中会包含大量`script`标签
- 模块间的复杂依赖关系仅靠`script`标签引用顺序来组织
- 污染全局环境，可能存在命名冲突

### AMD&CMD&CommonJS&ESM

AMD/CMD只是一种设计规范，而不是实现。AMD的主要实现有两个(RequireJS和curl.js)，CMD的主要实现有(sea.js)

#### AMD(Asynchronous Module Define)主要包含两个API：**define**和**require**

define方法用于定义一个模块，接收两个参数：

- 第一个参数是数组表示这个模块所依赖的其他模块
- 第二个参数是一个回调函数，通过入参的方式将所依赖模块的输出依次取出，并在方法内使用，返回值将作为其他依赖模块的引用

``` js
define(['Module1'], function (module) {
    return {
    }
}); 

require(['math'], function (math) {
　 math.sqrt(15)
});
```

`define`能自定义模块而`require`只能引用其他模块，`require`的真正作用是执行模块加载

AMD规范去除了纯粹用script便签顺组组织模块带来的问题

1. 通过依赖数组的方式声明依赖关系，具体依赖关系交给具体的AMD框架处理
2. 避免生命全局变量带来的环境污染和变量冲突问题
3. 模块异步加载，防止JS加载阻塞页面渲染

#### CMD(Common Module Definition)

有一个`define`API,接收一个`factory`回调函数，有三个参数：

- require：一个方法标识符，调用它可以动态的获取一个依赖模块的输出
- exports：一个对象，用于对其他模块提供输出接口，例如`exports.name = xxx`
- module：一个对象，存储了当前模块相关的一些属性和方法，其中`module.exports`等同于`exports`

``` js
define(function(require, exports, module) {
    var moduleA = require('/path/to/ModuleA');
    module.exports = {}
})
```

#### CMD&AMD的区别

一方面，在依赖的处理上

- AMD依赖前置，即通过依赖数组的方式提前声明当前模块的依赖
- CMD依赖就近，在需要用到的时候通过调用`require`方法动态导入

另一方面，在本模块的输出上

- AMD通过返回值的方式对外输出
- CMD通过给`module.exports`赋值的方式对外输出

### CommonJS&ESM

`CommonJS`是Node.js使用的模块化方式

``` js
const ramda = require('ramda');

module.exports = {}
```

`ESM`是`ES6`提出的模块化方案

``` js
impot { clone } from 'ramda';

export default {}
```

|          | CommonJS     | ESM            |
| -- | -- | -- |
| 加载时间 | 运行时加载   | 编译时输出接口 |
| 输出方式 | 值的拷贝     | 值的引用       |

#### 输出方式比对
``` js
// CommonJS
let a = 1;
function increaseA() {
    a += 1;
}
module.exports = { a, increaseA };

console.log(a); // 1
increaseA();
console.log(a); // 1

// ESM
let b = 1;
function increaseB() {
    b += 1;
}
export { b, increaseB };

console.log(b); // 1
increaseB();
conosle.log(b); // 2
```

### webpack/browserify

AMD/CMD可以看作在线编译模块的方法，也就是等浏览器下载了这些js文件后才进行模块依赖分析，确定加载顺序和执行顺序，带来了一些问题

- 增加代码加载时间，影响用户体验
- http请求过多，降低页面性能

于是有以下对应方法去解决：

- 提前将模块组织好
- 进行代码合并，把多个`script`的代码合并到少数几个文件中减少http请求个数

具有代表性的是`webpack`和`browserify`

![webpack](http://mrrsblog.oss-cn-shanghai.aliyuncs.com/webpack.png)

打包工具面临的问题&&解决方案

**打包后的文件体积过大**

代码打包的初衷是减少AMD/CMD等框架造成的加载脚本数量过多的问题，但也带来了打包后单个文件体积过大的问题：如此一来，首屏加载时间缓慢，体验较差

于是webpack引入了代码拆分的功能(Code Splitting)来解决这个问题, 从全部打包后退一步：可以打包成多个包

- 第三方库和业务代码的分离：业务代码更新频率快，而第三方库代码更新频率是比较慢的。分离之后可利用浏览器缓存机制加载第三方库，从而加快页面访问速度
- 按需加载: 例如我们经常通过前端路由分割不同页面，除了首页外的很多页面(路由)可能访问频率较低，我们可将其从首次加载的资源中去掉，而等到相应的触发时刻再去加载它们。这样就减少了首屏资源的体积，提高了页面加载速度。

### bundleless(snowpack/vite)

利用现代浏览器对ES6普遍支持良好的现状，开发环境下不进行打包。借助浏览器 ESM 的能力，一些代码基本可以做到无需构建直接运行。代表性工具是vite和snowpack

为什么要打包？

对于早期的 web 应用而言，打包模块既能够处理 JS 模块化，又能将多个模块打包合并网络请求。使用这类构建工具打包项目的确是个不错的选择。时至今日基本上主流的浏览器版本都支持 ESM，并且并发网络请求带来的性能问题，在 HTTP/2 普及下不像以前那么凸显的情况下，大家又将目光转向了 ESM。就目前的体验而言，基于原生 ESM 在开发过程中的构建速度似乎远远优于 webpack 之类的打包工具的。

## 参考

[前端模块化的十年征程](https://zhuanlan.zhihu.com/p/265632724)

[ESM vs Webpack 面向高性能构建的探索](https://juejin.cn/post/6947890290896142350)