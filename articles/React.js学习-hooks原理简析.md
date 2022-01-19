---
title: "React.js学习-hooks原理简析"
tags: "hooks"
categories: "React.js"
description: ""
createDate: "2021-12-23 11:25:20"
updateDate: "2021-12-23 21:56:54"
---


让我们从实现两个简单的hook入手来探究hooks原理

> [示例代码](https://github.com/mrrs878/review)

## useState

`useState`用于在函数式组件中声明并保存一个变量，`useState`的使用是这样的：

``` ts
const [count, setCount] = useState(0);

console.log(count);

setCount(1);

setCount((pre) + pre + 1);
```

有几个特点：

1. 接受一个函数或值作为变量的初始值
2. 返回一个数组(元组)，第一个参数是变量值，第二个参数是一个函数，可用来更新变量值
3. 返回的更新函数支持传入一个函数，改函数的参数是当前的变量值

据此，可以实现一版简单的`useState`

``` ts
function useState(initialState) {
    // 没有考虑传入一个函数的情况
    let state = initialState;
    
    const setState = (newState) => {
        state = newState;
    }
    
    return [state, setState];
}
```

但在使用的时候会发现，当调用`setCount`的时候，`count` 并不会变化，这是因为我们没有存储`state`，导致每次渲染组件的时候，`state`都会重新设置

为解决这个问题，会自然而然地想到，把`state`提取出来，存在`useState`外面：

``` ts
let _state;

function useState(initialState) {
  _state = _state || initialState;

  const setState = (newState) => {
    _state = typeof newState === 'function' ? newState(_state) : newState;
  };

  return [
    _state,
    setState,
  ];
}
```

测试用例

``` ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useState } from './useState_simple';

describe('useState_simple', () => {
  it('useState should be defined', () => {
    expect(useState).toBeDefined();
  });

  it('When the update function is called, the data is updated normally', () => {
    const { result, rerender } = renderHook(() => useState(1));

    const [, setState] = result.current;

    act(() => {
      setState(2);
      rerender();
    });

    const [state] = result.current;

    expect(state).toBe(2);
  });
});
```

至此，实现了一个简单的`useState`，后边会进一步完善

## useEffect

`useEffect`的使用是这样的

``` ts
useEffect(() => {
    // do something
});

useEffect(() => {
    // do something
}, [])

useEffect(() => {
    // do something
}, [deps])
```

`useEffect`的使用有几个特点：

1. 有两个参数`callback`和`deps`数组
2. 如果`deps`不存在，那么`callback`在每次`render`时都会执行
3. 如果`deps`存在，只有当它发生了变化，`callback`才会执行

根据使用方法和特点，可以做一个简单地实现：

``` tsx
let _deps;

function useEffect(callback, deps) {
  const hasNoDeps = !deps;
  const hasChangeDeps = _deps
    ? !deps?.every((dep, index) => _deps[index] === dep)
    : true;

  if (hasNoDeps || hasChangeDeps) {
    callback();
    _deps = deps;
  }
}
```

测试用例

``` ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useEffect } from './useEffect_simple';

describe('useEffect_simple', () => {
  it('useEffect should be defined', () => {
    expect(useEffect).toBeDefined();
  });

  it('When deps is empty, every rendering callback should be executed', () => {
    const callback = jest.fn();
    const { rerender } = renderHook(() => useEffect(callback));

    expect(callback).toBeCalledTimes(1);

    act(() => {
      rerender();
    });

    expect(callback).toBeCalledTimes(2);
  });

  it('When deps is an empty array, render multiple times but callback should only be called once', () => {
    const callback = jest.fn();
    const { rerender } = renderHook(() => useEffect(callback, []));

    expect(callback).toBeCalledTimes(1);

    act(() => {
      rerender();
    });

    expect(callback).toBeCalledTimes(1);
  });

  it('When deps is changed, callback should be called', () => {
    const callback = jest.fn();
    const { rerender } = renderHook(({ name }) => useEffect(callback, [name]), {
      initialProps: {
        name: 'tom',
      },
    });

    expect(callback).toBeCalledTimes(1);

    act(() => {
      rerender({
        name: 'jerry',
      });
    });

    expect(callback).toBeCalledTimes(2);
  });
});
```

到这里，我们又实现了一个可以工作的丐版`useEffect`，hook貌似没有那么难

## 优化

我们上边实现的两个简单的hook存在一个致命缺点，在一个组件内只能使用一次，对此，我们可以将`_state`和`_deps`保存至一个全局数组`memoizedState `中，并用一个变量存储当前`memoizedState`下标

``` ts
let memoizedStates = []; // hooks存放在这个数组
let cursor = 0; // 当前memoizedState下标

function useState(initialState) {
  memoizedStates[cursor] = memoizedStates[cursor] || initialState;

  const currentCursor = cursor;
  const setState = (newState) => {
    memoizedStates[currentCursor] = typeof newState === 'function'
      ? newState(memoizedStates[currentCursor])
      : newState;
  };

  const res = [memoizedStates[cursor], setState];
  cursor += 1;

  return res;
}

function useEffect(callback, deps) {
  const hasNoDeps = deps === undefined;
  const preDeps = memoizedStates[cursor];
  const hasChangedDeps = preDeps
    ? !deps.every((dep, index) => dep === preDeps[index])
    : true;

  if (hasNoDeps || hasChangedDeps) {
    callback();
    memoizedStates[cursor] = deps;
  }

  cursor += 1;
}

function resetCursor() {
  cursor = 0;
}

function resetMemoizedStates() {
  memoizedStates = [];
}
```

**Not Magic, just Arrays**

测试用例

``` ts
import { act, renderHook } from '@testing-library/react-hooks';
import {
  resetCursor, useEffect, useState, resetMemoizedStates,
} from './useState_useEffect';
describe('useState_simple', () => {
  it('useState should be defined', () => {
    expect(useState).toBeDefined();
  });

  it('When the update function is called, the data is updated normally', () => {
    const usePeople = () => {
      const [age, setAge] = useState(1);
      const [name, setName] = useState('tom');

      return [age, setAge, name, setName];
    };
    const { result, rerender } = renderHook(() => usePeople());

    expect(result.current[0]).toBe(1);
    expect(result.current[2]).toBe('tom');

    act(() => {
      result.current[1]((pre) => pre + 1);
      resetCursor();
      rerender();
    });

    expect(result.current[0]).toBe(2);
    expect(result.current[2]).toBe('tom');

    act(() => {
      result.current[3]('tom&jerry');
      resetCursor();
      rerender();
    });

    expect(result.current[0]).toBe(2);
    expect(result.current[2]).toBe('tom&jerry');
  });
});

describe('useEffect_simple', () => {
  beforeEach(() => {
    resetCursor();
    resetMemoizedStates();
  });

  it('useEffect should be defined', () => {
    expect(useEffect).toBeDefined();
  });

  it('Different DEPs, Callback calls should also be differentcalls should also be different', () => {
    const callbackWithNoDeps = jest.fn();
    const callbackWithEmptyDeps = jest.fn();
    const callbackWithChangingDeps = jest.fn();

    let name = 'tom';

    const useProple = () => {
      useEffect(callbackWithNoDeps);
      useEffect(callbackWithEmptyDeps, []);
      useEffect(callbackWithChangingDeps, [name]);
    };

    const { rerender } = renderHook(() => useProple());

    expect(callbackWithNoDeps).toBeCalledTimes(1);
    expect(callbackWithEmptyDeps).toBeCalledTimes(1);
    expect(callbackWithChangingDeps).toBeCalledTimes(1);

    act(() => {
      name = 'tom&jerry';
      resetCursor();
      rerender();
    });

    expect(callbackWithNoDeps).toBeCalledTimes(2);
    expect(callbackWithEmptyDeps).toBeCalledTimes(1);
    expect(callbackWithChangingDeps).toBeCalledTimes(2);

    act(() => {
      resetCursor();
      rerender();
    });

    expect(callbackWithNoDeps).toBeCalledTimes(3);
    expect(callbackWithEmptyDeps).toBeCalledTimes(1);
    expect(callbackWithChangingDeps).toBeCalledTimes(2);
  });
});
```

## 真正的React实现

虽然我们用数组基本实现了一个可用的Hooks，了解了Hooks的原理，但在React中，实现方式却有一些差异的。

1. React中是通过类似单链表的形式来代替数组的。通过`next`按顺序串联所有的`hook`
2. `memoizedState`，`cursor`是存在哪里的？如何和每个函数组件一一对应的？

我们知道，React会生成一棵组件树（或Fiber单链表），树中每个节点对应了一个组件，hooks的数据就作为组件的一个信息，存储在这些节点上，**伴随组件一起出生，一起死亡**。

``` ts
type Hooks = {
    // others
    memoizedState: any, // useState中 保存 state 信息 ｜ useEffect 中 保存着 effect 对象 ｜ useMemo 中 保存的是缓存的值和 deps ｜ useRef 中保存的是 ref 对象
    next: Hook | null, // link 到下一个 hooks，通过 next 串联每一个hooks
}
```

## 解惑

Q. 为什么只能在函数最外层调用Hook，不要在循环、条件判断或者子函数中调用？
    
A. `memoizedState`是按hook定义的顺序来放置数据的，如果hook顺序变化，`memoizedState`并不会感知到
    
Q. 为什么`useEffect`第二个参数是空数组，在组件更新时回调只会执行一次？

A. 因为依赖一直不变化，`callback`不会二次执行

Q. 自定义的Hook是如何影响使用它的函数组件的？

A. 共享同一个`memoizedState`，共享同一个顺序

Q. Capture Value 特性是如何产生的？

A. 每一次`rerender`的时候，都是重新去执行函数组件了，对于之前已经执行过的函数组件，并不会做任何操作。即**每次渲染（执行），都有它自己的xxx**