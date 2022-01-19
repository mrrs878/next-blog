---
title: "React.js复习-一些理解"
tags: "React.js"
categories: "2021复习"
description: ""
createDate: "2021-06-01 01:47:25"
updateDate: "2021-07-01 13:42:45"
---


## 对React的理解

> 用于构建用户界面的JavaScript库

具有声明式、组件化、跨平台等特点

- 声明式
    React采用声明式来编写UI，语法简洁高效
    ``` jsx
    // 声明式
    const Element = <h1>hello</h1>
    ReactDOM.render(<Element />, document.querySelector("#app"));
    
    // 命令式
    const element = document.createElement("div");
    div.innerText = "hello";
    document.querySelector("#app").appendChild(element);
    ```
- 组件化
    可以编写具有管理自身状态能力的封装组件，然后对其组合以构成复杂的UI。方便复用。由于组件逻辑使用JavaScript编写而非模板，因此你可以轻松地在应用中传递数据，并保持状态与DOM分离
- 跨平台
    `react-dom`用于构建网站应用；`react-native`用于构建移动端原生应用
- jsx
    使用jsx来开发，方便灵活，表达能力强
- 虚拟DOM
    引入虚拟DOM的概念，整合更新视图的方法，使开发者不再去手动更新DOM，操作更高效
- 新的Reconciler（fiber架构）
    最新的的fiber架构使得DOM更新更加流畅、高效。分离出commit和render阶段，使得更新异步可中断，不会长时间阻塞渲染线程，从而避免在一些大型应用中执行一些操作后页面卡死的问题

## 对virtualDOM的理解

一个JavaScript对象，用于描述真实的DOM节点

在react中通过`React.createElement`创建（babel在转译jsx的时候调用）

通过引入虚拟DOM，开发者可以方便得解决浏览器兼容性与跨平台问题。开发者只需要告诉react最新的DOM结构，渲染交由react统一处理，开发者不用再关心不同浏览器下api的兼容性问题；而且通过引入不同的渲染库，可以进行跨平台开发。此外，虚拟DOM在更新的时候可以实现差异化与精准更新，效率更高

但虚拟DOM也有其缺点，首先是引入虚拟DOM会后额外的内存消耗；其次是虚拟DOM在某些情况下的效率也不一定比手动操作DOM高

ps：虚拟DOM一定效率高吗？

答：不一定。比如在初次渲染的时候和手动操作一样，都需要创建节点然后插入，效率并不高。虚拟DOM的真正优势是跨平台、处理兼容性问题、增量更新等

## 对fiber的理解

具有三种不同的含义

- 一种架构。之前React15的`reconciler`采用递归的方式执行更新DOM的操作，数据保存在递归调用栈中，所以被称为`stack Reconciler`。React16的`reconciler`基于Fiber节点实现，被称为`Fiber Reconciler`
- 一种数据结构。每个`Fiber`节点对应一个`React element`，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息
- 一个执行任务。（工作单元） 每个`Fiber`节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）

## 对函数式组件的理解

为了解决类组件在异步时数据一致性的问题

函数式组件vs类组件：

- 编程思想不同。类组件需要创建实例，而函数式组件不需要，接收输入，返回输出，是基于函数式编程的思想写的
- 内存占用。类组件需要实例化，占用一定的内存
- 捕获特性。函数式组件具有值捕获特性
- 可测试性。函数值组件更容易编写测试用例
- 生命周期。类组件具有复杂的生命周期函数，函数式组件可使用`useEffect`来执行副作用
- 逻辑复用。类组件可以使用子组件/继承来实现复用，函数式组件使用自定义`hook`来实现逻辑复用
- 跳过更新。类组件可以使用`shouldComponentUpdate`和`React.PureComponent`来跳过更新。函数式组件可使用`React.memo`
- 发展前景。函数式组件可以更好的解决`this`指向、逻辑复用、时间分片、并发渲染等问题

## 合成事件

React为处理各浏览器兼容性问题所设计的一种时间处理机制。原生DOM事件流分为两种：IE、W3C。IE标准中只有冒泡；W3C分为捕获+冒泡阶段。合成事件基于事件委托机制，统一处理事件绑定。

在React17之前，所有事件均绑定到`document`元素上，17之后绑定到根元素上。这样做有以下几点优势：

- 解决事件触发顺序不一致问题
- 多React版本共存问题

``` jsx
const App = () => {
  React.useEffect(() => {
    const node = document.querySelector("#parent");
    const handler = () => {
      console.log('native clickPropagation');
    };
    const handlerCapture = () => {
      console.log('native clickCapture');
    };
    node.addEventListener("click", handler);
    node.addEventListener("click", handlerCapture, true);
    return () => {
      node.removeEventListener("click", handler);
      node.removeEventListener("click", handlerCapture, true);
    }
  })

  function onClick() {
    console.log('react clickPropagation');
  }
  function onClickCapture() {
    console.log('react clickCapture');
  }
  return (
    <div id="parent" onClick={onClick} onClickCapture={onClickCapture}>hello</div>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'))

// v16
// native clickCapture
// native clickPropagation
// react clickCapture
// react clickPropagation

// v17
// react clickCapture
// navive clickCapture
// native clickPropagation
// react clickPropagation
```

源码层面分别给`root`添加一个冒泡事件和捕获事件，在捕获事件里模拟合成事件的捕获，在冒泡事件里模拟合成事件的冒泡

``` js
root.addEventListener("click", (e) => dispatchEvent(e, true), true);
root.addEventListener("click", (e) => dispatchEvent(e, false));

function dispatchEvent(event, useCapture) {
    // ...
    if (useCapture) {
        // 模拟合成事件的捕获
    } else {
        // 模拟合成事件的冒泡
    }
    // ...
}
```

## 对DOM-diff的理解

简单来讲就是拿新的jsx(数组)与fiber(链表)进行比对，生成副作用数组和新的fiber树的过程，发生在`reconciler`阶段。比较时会进行遍历，根据`type`和`key`来判断节点是否有更新以及更新的类型（新增？修改？删除？移动？），给老fiber节点添加对应的标记

有三个预设限制：

- 同层比较
- 元素类型不同时不再去比较子树，直接生成新的
- 可为元素添加key来指示哪些元素在更新时保持稳定

根据同级节点不同有两种不同的diff算法

1. 当newChild类型为object、number、string，代表同级只有一个节点
2. 当newChild类型为Array，同级有多个节点

对于单节点，根据`key`和`type`来决定元素是否复用

对于多节点，会发生两轮遍历

1. 处理更新的节点
2. 处理删除、添加、位置发生变化的节点

第一轮循环过程中当节点不能复用时或遍历完成后开启第二轮循环

## React.js对比Vue.js

都是用来开发现代前端应用的库/框架，两者都采用了一种叫做虚拟DOM的机制来方便开发者来操作真实的DOM

### 设计思想
Vue.js是一个渐进式框架，采用自底向上增量开发的模式。

所谓渐进式就是把框架分层。最核心的部分是视图层渲染，然后往外是组件系统，在这个基础上再加入路由机制，再加入状态管理，最外层是构建工具。所谓分层，就是说既可以只用最核心的视图层渲染功能快速开发一些需求，也可以使用一整套全家桶来开发大型应用。Vue.js由足够的灵活性来适应不同的需求，所以开发者可以根据自己的需求选择不同的层级。

React.js是用来构建界面的JavaScript库。具有声明式、组件化、跨平台的特点。可以编写具有管理自身状态能力的封装组件，然后对其组合以构成复杂的UI。方便复用。由于组件逻辑使用JavaScript编写而非模板，因此你可以轻松地在应用中传递数据，并保持状态与DOM分离。通过引入虚拟DOM来整合更新视图的方法，使开发者不再去手动更新DOM，操作更高效

### 响应式
Vue.js通过使用`Object.defineProperty`和`Proxy`来劫持数据变化，当更新数据的时候进行DOM-DIFF，更新视图。此外，Vue.js通过`v-model`这一语法糖指令可实现双向数据绑定功能

React.js在接收到用户状态改变通知后，会根据当前渲染树，结合最新的状态改变，通过Diff算法，计算出树中变化的部分，然后只更新变化的部分，从而避免整棵树重构，提高性能

### 组件间数据交互
Vue.js中父组件通过props传递数据给子组件，子组件使用$emit触发自定义事件，父组件中监听子组件的自定义事件获取子组件传递来的数据

React.js中父组件使用props传递数据和回调函数给子组件，子组件通过props传下来的回调函数返回数据，父组件通过回调函数获取子组件传递上来的数据