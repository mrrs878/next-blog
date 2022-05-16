---
title: "React.js学习-一文梳理 React 18 新特性(转载)"
tags: "React.js学习 React.js18"
categories: "React.js"
description: ""
createDate: "2022-05-16 22:23:31"
updateDate: "2022-05-16 22:38:14"
---

转载自: https://blog.csdn.net/qq_41257129/article/details/123371328

React 的迭代过程

React 从 v16 到 v18 主打的特性包括三个变化：

- v16: Async Mode (异步模式)
- v17: Concurrent Mode (并发模式)
- v18: Concurrent Render (并发更新)

React 中 `Fiber` 树的更新流程分为两个阶段 `render` 阶段和 `commit` 阶段。组件的 `render` 函数执行时称为 `render` （本次更新需要做哪些变更），纯 js 计算；而将 `render` 的结果渲染到页面的过程称为 `commit` （变更到真实的宿主环境中，在浏览器中就是操作 DOM）。

在 Sync 模式下， `render` 阶段是一次性执行完成；而在 `Concurrent` 模式下 `render` 阶段可以被拆解，每个时间片内执行一部分，直到执行完毕。由于 `commit` 阶段有 DOM 的更新，不可能让 DOM 更新到一半中断，必须一次性执行完毕。

- Async Mode: 让 render 变为异步、可中断的。
- Concurrent Mode : 让 commit 在用户的感知上是并发的。
- Concurrent Render : Concurrent Mode 中包含 breaking change，比如很多库不兼容（mobx 等），所以 v18 提出了 Concurrent Render ，减少了开发者的迁移成本。

## React 并发新特性

并发渲染机制（concurrent rendering）的目的：根据用户的设备性能和网速对渲染过程进行适当的调整， 保证 React 应用在长时间的渲染过程中依旧保持可交互性，避免页面出现卡顿或无响应的情况，从而提升用户体验。

v18 正式引入了的并发渲染机制，并基于此给我们带来了很多新特性。这些新特性都是可选的并发功能，使用了这些新特性的组件并能触发并发渲染，并且与其整个子树都将自动开启 `strictMode` 。

## 新 root API

v18 之前 root 节点对用户不透明。

```jsx
import * as ReactDOM from 'react-dom'
import App from './App'
​
const root = document.getElementById('app')
// v18 之前的方法
ReactDOM.render(<App/>,root)
v18 中我们可以通过 createRoot Api 手动创建 root 节点。

import * as ReactDOM from 'react-dom'
import App from './App'
​
const root = ReactDOM.createRoot(document.getElementById('app'))
// v18 的新方法
root.render(<App/>,root)
```

想要使用 v18 中其他新特性 API， 前提是要使用新的 Root API 来创建根节点。

## Automatic batching 自动批处理优化

批处理： React 将多个状态更新分组到一个重新渲染中以获得更好的性能。（将多次 `setState` 事件合并）

在 v18 之前只在事件处理函数中实现了批处理，在 v18 中所有更新都将自动批处理，包括 `promise` 链、 `setTimeout` 等异步代码以及原生事件处理函数。

```JSX
// v18 之前
function handleClick () {

  fetchSomething().then(() => {

      // React 17 及之前的版本不会批处理以下的 state:
      setCount((c) => c + 1) // 重新渲染
      setFlag((f) => !f) // 二次重新渲染
    })
}
// v18下
// 1、promise链中
function handleClick () {

  fetchSomething().then(() => {

      setCount((c) => c + 1)
      setFlag((f) => !f) // 合并为一次重新渲染
    })
}
// 2、setTimeout等异步代码中
setTimeout(() => {

  setCount((c) => c + 1)
  setFlag((f) => !f) // 合并为一次重新渲染
}, 5000)
// 3、原生事件中
element.addEventListener("click", () => {

setCount((c) => c + 1)
  setFlag((f) => !f) // 合并为一次重新渲染
})
```

如果想退出自动批处理立即更新的话，可以使用 `ReactDOM.flushSync()` 进行包裹。

```JSX
import * as ReactDOM from 'react-dom'
​
function handleClick () {

  // 立即更新
  ReactDOM.flushSync(() => {

    setCounter(c => c + 1)
  })
  // 立即更新
  ReactDOM.flushSync(() => {

    setFlag(f => !f)
  })
}
```

## startTransition

可以用来降低渲染优先级。分别用来包裹计算量大的 `function` 和 `value` ，降低优先级，减少重复渲染次数。

举个例子：搜索引擎的关键词联想。一般来说，对于用户在输入框中输入都希望是实时更新的，如果此时联想词比较多同时也要实时更新的话，这就可能会导致用户的输入会卡顿。这样一来用户的体验会变差，这并不是我们想要的结果。

我们将这个场景的状态更新提取出来：一个是用户输入的更新；一个是联想词的更新。这个两个更新紧急程度显然前者大于后者。

以前我们可以使用防抖的操作来过滤不必要的更新，但防抖有一个弊端，当我们长时间的持续输入（时间间隔小于防抖设置的时间），页面就会长时间都不到响应。而 `startTransition` 可以指定 UI 的渲染优先级，哪些需要实时更新，哪些需要延迟更新。即使用户长时间输入最迟 5s 也会更新一次，官方还提供了 hook 版本的 `useTransition` ，接受传入一个毫秒的参数用来修改最迟更新时间，返回一个过渡期的 `pending` 状态和 `startTransition` 函数。

```JSX
import * as React from "react";
import "./styles.css";
​
export default function App() {

  const [value, setValue] = React.useState();
  const [searchQuery, setSearchQuery] = React.useState([]);
  const [loading, startTransition] = React.useTransition(2000);
​
  const handleChange = (e) => {

    setValue(e.target.value);
    // 延迟更新
    startTransition(() => {

      setSearchQuery(Array(20000).fill(e.target.value));
    });
  };
​
  return (
    <div className="App">
      <input value={
    value} onChange={
    handleChange} />
      {
    loading ? (
        <p>loading...</p>
      ) : (
        searchQuery.map((item, index) => <p key={
    index}>{
    item}</p>)
      )}
    </div>
  );
}
```

所有在 `startTransition` 回调中更新的都会被认为是非紧急处理，如果一旦出现更紧急的处理（比如这里的用户输入）， `startTransition` 就会中断之前的更新，只会渲染最新一次的状态更新。

`startTransition` 的原理就是利用了 React 底层的优先级调度模型。

更多例子： [真实世界示例：为慢速渲染添加 startTransition](https://github.com/reactwg/react-18/discussions/65)

## SSR 下的 Suspense 组件

`Suspense` 的作用： 划分页面中需要并发渲染的部分。

`hydration`[水化]：ssr 时服务器输出的是字符串（html），客户端（一般是浏览器）根据这些字符串并结合加载的 JavaScript 来完成 React 的初始化工作这一阶段为水化。

React v18 之前的 SSR， 客户端必须一次性的等待 HTML 数据加载到服务器上并且等待所有 JavaScript 加载完毕之后再开始 `hydration` ， 等待所有组件 `hydration` 后，才能进行交互。即整个过程需要完成从获取数据（服务器）→ 渲染到 HTML（服务器）→ 加载代码（客户端）→ 水合物（客户端）这一套流程。这样的 SSR 并不能使我们的完全可交互变快，只是提高了用户的感知静态页面内容的速度。

React v18 在 SSR 下支持了 `Suspense` ，最大的区别是什么呢？

1. 服务器不需要等待被 Suspense 包裹组件是否加载到完毕，即可发送 HTML，而代替 suspense 包裹的组件是 fallback 中的内容，一般是一个占位符（spinner），以最小内联<script>标签标记此 HTML 的位置。等待服务器上组件的数据准备好后，React 再将剩余的 HTML 发送到同一个流中。

2. hydration 的过程是逐步的，不需要等待所有的 js 加载完毕再开始 hydration，避免了页面的卡顿。

3. React 会提前监听页面上交互事件（如鼠标的点击），对发生交互的区域优先级进行 hydration。

https://github.com/reactwg/react-18/discussions/37

## useSyncExternalStore

这个 API 可以防止在 `concurrent` 模式下，任务中断后第三方 `store` 被修改，恢复任务时出现 `tearing` 从而数据不一致问题。用户一般很少使用，大多情况下提供给像 Redux 这样的状态管理库使用，通过 `useSyncExternalStore` 可以使 React 在 `concurrent mode` 下，保持自身 `state` 和来自 Redux 的状态同步。

```JSX
import * as React from 'react'
​
// 基础用法，getSnapshot 返回一个缓存的值
const state = React.useSyncExternalStore(store.subscribe, store.getSnapshot)
​
// 根据数据字段，使用内联的 getSnapshot 返回缓存的数据
const selectedField = React.useSyncExternalStore(store.subscribe, () => store.getSnapshot().selectedField)
```

- 第一个参数是一个订阅函数，订阅触发时会引起该组件的更新。
- 第二个函数返回一个 immutable 快照， 返回值是我们想要订阅的数据，只有数据发生变化时才需要重新渲染。

## useInsertionEffect

这个 hook 对现有的专为 React 设计的 css-in-js 库有着很大的作用，可以动态生成新规则与`<style>`标签一起插入到文档中。

假设现在我们要插入一段 css ，并且将这个操作放在渲染期间去执行。

```JSX
function css(rule) {

  if (!isInserted.has(rule)) {

    isInserted.add(rule)
    document.head.appendChild(getStyleForRule(rule))
  }
  return rule
}
function Component() {

  return <div className={
    css('...')} />
}
```

这样会导致每次修改 css 样式时，react 需要在渲染的每一帧中对所有的节点重新计算所有 CSS 规则，这并不是我们想要的结果。

那我们是不是可以在所有 DOM 生成前就插入这些 css 样式，此时我们可能会想到 `useLayoutEffect` ，但 `useLayoutEffect` 中可以访问 DOM，如果在这个 hook 中访问了某个 DOM 的布局样式（比如`clientWidth`），这样会导致我们读取的信息是错误的。

```JSX
useLayoutEffect ( ( )  =>  {

  if  ( ref.current.clientWidth  <  100 )  {

    setCollapsed ( true ) ;
  }
} ) ;
useInsertionEffect 可以帮助我们避免上述问题 ，既可以满足在所有 DOM 生成前插入并且不访问 DOM。其工作原理大致与 useLayoutEffect 相同，只是此时没法访问 DOM节点的引用。我们可以在这个 hook 中插入全局的DOM节点，比如如<style> ，或SVG<defs> 。

const useCSS: React.FC = (rule) => {

  useInsertionEffect(() => {

    if (!isInserted.has(rule)) {

      isInserted.add(rule)
      document.head.appendChild(getStyleForRule(rule))
    }
  })
  return rule
}
const Component: React.FC = () => {

  let className = useCSS(rule)
  return <div className={
    className} />
}
```

https://github.com/reactwg/react-18/discussions/110

## useId

React 一直在向着 SSR 的领域发展，但 SSR 渲染必须保证客户端与服务端生成的 HTML 结构相匹配。我们平时使用的如 `Math.random()` 在 SSR 面前是没法保证客户端与服务端之间的 `id` 唯一性。

React 为了解决这个问题，提出来 `useOpaqueIdentifier` 这个 hook, 不过它在不同环境会产生不同的结果.

- 在服务端会生成一个字符串

- 在客户端会生成一个对象，必须直接传递给 DOM 属性

这样一来，在客户端如果需要生成多个标识，就需要调多次这个 hook，因为它不支持转化为字符串，就无法使用字符串拼接。

```jsx
const App: React.FC = () => {

  const tabIdOne = React.unstable_useOpaqueIdentifier();
  const panelIdOne = React.unstable_useOpaqueIdentifier();
  const tabIdTwo = React.unstable_useOpaqueIdentifier();
  const panelIdTwo = React.unstable_useOpaqueIdentifier();
​
  return (
    <React.Fragment>
      <Tabs defaultValue="one">
        <div role="tablist">
          <Tab id={
    tabIdOne} value="one">
            One
          </Tab>
          <Tab id={
    tabIdTwo} value="one">
            One
          </Tab>
        </div>
        <TabPanel id={
    panelIdOne} value="one">
          Content One
        </TabPanel>
        <TabPanel id={
    panelIdTwo} value="two">
          Content Two
        </TabPanel>
      </Tabs>
    </React.Fragment>
  );
}
```

而 `useId` 可以生成客户端与服务端之间的唯一 `id` ，并且返回一个字符串。这样一个组件可以只需调用一次 `useId` ，并将其结果作为整个组件所需的标识符基础（比如拼接不同的字符串），以便生成唯一 `id` 。

```jsx
const App: React.FC = () => {
  const id = React.useId();
  return (
    <React.Fragment>
      <Tabs defaultValue="one">
        <div role="tablist">
          <Tab id={`${id}tab1`} value="one">
            One
          </Tab>
          <Tab id={`${id}tab2`} value="one">
            One
          </Tab>
        </div>
        <TabPanel id={`${id}panel1`} value="one">
          Content One
        </TabPanel>
        <TabPanel id={`${id}panel2`} value="two">
          Content Two
        </TabPanel>
      </Tabs>
    </React.Fragment>
  );
};
```

## useDefferdValue

React 可以通过 `useDefferdValue` 允许变量延时更新，同时接受一个可选的延迟更新的最大值。React 将尝试尽快更新延迟值，如果在给定的 `timeoutMs` 期限内未能完成，它将强制更新。

```jsx
const defferValue = useDeferredValue(value, {
  timeoutMs: 1000,
});
```

`useDefferdValue` 能够很好的展现并发渲染时优先级调整的特性，可以用于延迟计算逻辑比较复杂的状态，让其他组件优先渲染，等待这个状态更新完毕之后再渲染。
