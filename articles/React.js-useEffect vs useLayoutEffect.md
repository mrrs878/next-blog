---
title: "React.js-useEffect vs useLayoutEffect"
tags: "React.js useEffect useLayoutEffect"
categories: "React.js"
description: ""
createDate: "2022-05-10 21:49:31"
updateDate: "2022-05-10 22:49:31"
---

大部分情况下不需要明确区分 `useEffect` 和 `useLayoutEffect`

（至少我还没遇到过 😂，不过有必要了解一下，没准哪天就遇到了）

两者唯一的区别在于执行时机的不同

## useEffect

一般看来，对于 `useEffect` ，为了防止浏览器渲染卡顿，其回调函数会在浏览器 `paint` 之后执行，这看起来很正常，下面是一个正常的组件渲染流程：

1. 做一些准备工作（渲染 `VDOM` 、调度 `effects` 等）

2. React 将控制权交由浏览器以 `paint`

3. 执行 `useEffect` 回调

确实，大部分情况下是这样，只不过凡事都有例外，且看官网的描述:

> 虽然 `useEffect` 会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。在开始新的更新前，React 总会先清除上一轮渲染的 `effect` 。

官网的介绍**会保证在任何新的渲染前执行**，并没有说一定会在浏览器 `paint` 之后执行，因此是不是有一些场景 `effect` 会在 `paint` 之前执行？🤔

如果在 `useEffect` 的回调触发之前，React 组件又进行了一次状态更新，React 会先将之前的 Passive Effect 都处理掉。例如在 `useLayoutEffect` 中更新状态，在这种情况下，`useEffect`的回调 会在 paint 之前执行

![useLayoutEffect-useEffect](https://blog.thoughtspile.tech/images/forced-le-flush-chart-5dc51705d5854315a6fa5e0be1464f7d.png)

## useLayoutEffect

和 `useEffect` 的唯一区别在于**执行时机不同**， `useLayoutEffect` 一定会保证回调函数会在 paint 之前执行，下面是一个正常的组件渲染流程：

1. 做一些准备工作（渲染 `VDOM` 、调度 `effects` 等）

2. 执行 `useLayoutEffect` 回调

3. React 将控制权交由浏览器以 `paint`

4. 执行 `useEffect` 回调

这个区别的体现场景在于使用 useEffect 更新数据时，界面会闪烁一下

```tsx
const { useState, useEffect, useLayoutEffect } = React;

const App = () => {
  const [value, setValue] = useState(-1);

  useEffect(() => {
    let i = 0;
    while (i <= 900000000) {
      i++;
    }
    if (value === 0) {
      const tmp = Math.random() * 100;
      console.log("setValue", tmp);
      setValue(() => tmp);
    }
  }, [value]);

  console.log("render", value, Date.now());

  return <div onClick={() => setValue(0)}>{value}</div>;
};
```

可以看到有一个明显的闪烁

![useEffect-blink](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/useEffect-%20blink.gif)

改用 `useLayoutEffect` 后就不会出现这种情况了
