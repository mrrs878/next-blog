---
title: "React.js学习-useContext性能优化"
tags: "React.js useContext"
categories: "React.js"
description: ""
createDate: "2022-05-19 21:41:41"
updateDate: "2022-05-19 23:07:41"
---

`useContext`在 React 中主要作为`useState`的替代品，用于在复杂组件间传递数据，但错误地使用也会导致一些性能问题

先说结论：由于`Context`的限制，每当`Context`中的数据发生变化时，通过`useContext`使用该`Context`的组件及其子组件都会触发重渲。对此，可通过拆分`Context`，减少`Context`的作用域，减少重渲的范围

下面会以一个简单的计数器作为示例

## 一个简单的 🌰

在这里，我们创建了一个`CounterContext`，全局共享了`state`和一些`action`，页面中`Header`组件和`Counter`组件中都使用了`CounterContext`来取值，而且`Header`和`Counter`分别有一个`Headerer`和`Counterer`子组件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script
      src="https://cdn.jsdelivr.net/npm/react@18.1.0/umd/react.development.js"
      crossorigin
    ></script>
    <script
      src="https://cdn.jsdelivr.net/npm/react-dom@18.1.0/umd/react-dom.development.js"
      crossorigin
    ></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
  </head>

  <body>
    <div id="app"></div>
    <script type="text/babel">
      const {
        useContext,
        useReducer,
        createContext,
        useCallback,
        useState,
        memo,
        useMemo,
      } = React;

      const initialState = {
        count: 0,
      };

      const initialDispatch = {};

      const StateContext = createContext(initialState);

      const Store = ({ children }) => {
        const [state, setState] = useState({ count: 0 });

        const increment = useCallback(() => {
          setState((state) => ({
            ...state,
            count: state.count + 1,
          }));
        }, []);

        const decrement = useCallback(() => {
          setState((state) => ({
            ...state,
            count: state.count - 1,
          }));
        }, []);

        const value = useMemo(
          () => ({ state, decrement, increment }),
          [state, increment, decrement]
        );

        return (
          <StateContext.Provider value={{ state, increment, decrement }}>
            {children}
          </StateContext.Provider>
        );
      };

      const Header = () => {
        const { state } = useContext(StateContext);

        console.log("rerender Header");

        return (
          <div>
            <span>{state.count}</span>
            <Headerer />
          </div>
        );
      };

      const Counter = () => {
        const { increment, decrement } = useContext(StateContext);

        console.log("rerender Counter");

        return (
          <div className="counter">
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
            <Counterer />
          </div>
        );
      };

      const Headerer = () => {
        console.log("rerender Headerer");

        return <span>Headerer</span>;
      };

      const MHeaderer = memo(Headerer);

      const Counterer = () => {
        console.log("rerender Counterer");

        return <span>Counterer</span>;
      };

      const App = () => (
        <Store>
          <Header />
          <Counter />
        </Store>
      );

      const root = ReactDOM.createRoot(document.querySelector("#app"));
      root.render(<App />);
    </script>
  </body>
</html>
```

代码跑起来后页面显示正常，操作后数据也正常更新，但当我们打开控制台后，会发现打印的数据有点不正常

刷新页面，初次渲染时打印数据是正常的

```sh
rerender Header
rerender Headerer
rerender Counter
rerender Counterer
```

点击 ➕ 或 ➖ 后

```sh
rerender Header
rerender Headerer
rerender Counter
rerender Counterer
# <------点击按钮------->
rerender Header
rerender Headerer
rerender Counter
rerender Counterer
```

发现`Header`和`Counter`及其子组件都触发更新了，好家伙，直呼好家伙

针对这个简单的 demo，我的`Counter`只是想用来渲染可更新数据的两个按钮，没必要重渲吧。我的`Headerer`和`Counterer`也只是想展示两个 UI，为啥也更新了

原因开头已经表述过了，但具体的解决方（代）案（码）是什么呢

> talk is cheap, show me the code

## 未使用到 Context 的

对于像`Headerer`和`Counterer`这种没有直接使用到`Context`的，可通过寻常的解法：`memo`搞定

```jsx
const MHeaderer = memo(Headerer);

const Header = () => {
  return (
    <div>
      <MHeaderer />
    </div>
  );
};
```

这样当再次重渲时就会跳过`Headerer`和`Counterer`

## 使用到 Context 的

针对于像`Counter`这种直接使用到`Context`的，`memo`已经搞不定了，不过由于`state`和`setState`并不强制绑定，我们可通过将其拆分到两个`Context`来避免不必要的重渲，即：

分别创建两个`Context`，来将`state`和`setState`共享到全局

```jsx
const StateContext = createContext(initialState);
const DispatchContext = createContext(initialDispatch);

const Store = ({ children }) => {
  const dispatch = useMemo(
    () => ({ decrement, increment }),
    [increment, decrement]
  );

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
```

在这里，`DispatchContext`的`value`必须使用`useMemo`缓存一下：`value`是一个对象，触发`state`更新后`Store`组件会重渲，如果不缓存，`value`也会改变，导致使用到`DispatchContext`的组件也会重渲，拆分了个寂寞。。。因此拆分后一定要记得打印一下日志，看有没有效果
