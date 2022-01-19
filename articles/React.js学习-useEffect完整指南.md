---
title: "React.js学习-useEffect完整指南"
tags: "React.js Hooks"
categories: "React.js"
description: ""
createDate: "2020-10-27 15:21:38"
updateDate: "2020-10-30 18:03:54"
---


> 原文链接：https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/

# 每一次渲染都有它自己的...

``` jsx
const Counter = () => {
	const [count, setCount] = useState(0)
    
    return (
    	<button onClick={() => setCount(count+1)}>click me</button>
    	<span>${ count }</span>
        // 没做任何特殊事件绑定，只是在渲染时拿取独立的count状态
    )
}
```

- 每一次渲染都有它自己的`data`和`props`
- 每一次渲染都有它自己的事件处理函数
- 每一次渲染都有它自己的Effects
- 每一个组件内的函数（包括事件处理函数，effects，定时器或者API调用等等）会捕获某次渲染中定义的`props`和`state`
- 当更新状态时，React会重新渲染组件。每一次渲染都能拿到独立的`count`状态，这个状态值是函数中的一个常量
- 在单次渲染的范围内，`props`和`state`始终保持不变

> 如果`props`和`state`在不同的渲染中是相互独立的，那么使用到它们的任何值也是独立的（包括事件处理函数）。它们都“属于”一次特定的渲染。即便是事件处理中的异步函数调用“看到”的也是这次渲染中的`count`值。

# 组件不要将接收到的参数本地化，或者说使组件完全受控

如果需要对 props 进行加工，可以利用 useMemo 对加工过程进行缓存，仅当依赖变化时才重新执行

```js
const textColor = useMemo(
  () => slowlyCalculateTextColor(color),
  [color] // ✅ Don’t recalculate until `color` changes
);
```




