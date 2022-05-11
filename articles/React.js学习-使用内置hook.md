---
title: "React.js学习-使用内置hook"
tags: "React.js学习 hook"
categories: "React.js"
description: ""
createDate: "2020-09-07 10:48:54"
updateDate: "2022-05-11 22:19:50"
---

# 什么是 hook

组件自身能够通过某种机制再触发状态的变更并且引起**re-render**，而这种“机制”就是 Hooks！

# useEffect

- 默认情况下，它在第一次渲染之后和每次更新之后都会执行。React 确保了每次运行`effect`的同时，DOM 都已经更新完毕

- 每次重新渲染，都会生成新的`effect`，替换掉之前的。某种意义上讲，`effect`更像是渲染结果的一部分 —— 每个`effect` “属于”一次特定的渲染。

- 每个`effect`都可以返回一个清除函数。如此可以将添加和移除订阅的逻辑放在一起。他们都属于`effect`的一部分

# 自定义 hook 的 state 是否共享

在两个组件中使用相同的`hook`不会共享`state`，自定义`hook`是一种重用状态逻辑的机制，所以每次使用自定义`hook`时其中的所有`state`和副作用是完全隔离的

# hook 原理

初次渲染的时候，按照 useState，useEffect 等 hook 的顺序，把 state，deps 等按顺序塞到 memoizedState 数组中。

更新的时候，按照顺序，从 memoizedState 中把上次记录的值拿出来。

# state 和 useState 的对应关系

`React`靠`hook`的调用顺序来知道`state`和`useState`的对应关系，所以不能在条件/循环中调用`hook`

# useEffect 的执行时机

`useEffect`会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行

# useCallback 和 useMemo

```js
useCallback(fn, deps) == useMemo(() => fn(), deps);
```

# 使用过多 hook 后性能问题

hook 不会因为在渲染时创建函数而变慢，在现代浏览器中闭包和类的原始性能只有在极端场景下才会有明显的差别

# useState 惰性求值

如果初始化`state`需要通过复杂计算获得，那么可以传入一个函数，在函数中计算并返回初始的`state`，此函数只在初始渲染时被调用

```js
const [count, setCount] = useState(() => calState());
```

# hook 使用必须要遵循的规则

在函数值组件主体内（指 React 渲染阶段）改变`DOM`、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性。使用`useEffect`完成副作用操作赋值给`useEffect`的函数会在组件渲染到屏幕后执行。

# useRef

通过`useRef`来拥有一个在**所有帧**中**共享**的变量

# useReducer

- state 逻辑较复杂且包含多个子值

- 下一个 state 依赖于之前的 state

# useImperativeHandle

简单来讲: useImperativeHandle 赋予函数式组件使用 ref 的特权, 通常和 forwardRef 成对出现,

使用方式:

```jsx
const { useImperativeHandle, forwardRef, useRef } = React;

const Modal = forwardRef((props, ref) => {
  const open = () => {
    console.log("open");
  };
  useImperativeHandle(ref, () => ({
    open,
  }));

  return <span>modal</span>;
});

const App = () => {
  const modalRef = useRef(null);

  return (
    <div>
      <Modal ref={modalRef} />
      <button onClick={() => modalRef.current.open()}>click me</button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<App />);
```
