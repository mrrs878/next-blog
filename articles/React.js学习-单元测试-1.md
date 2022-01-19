---
title: "React.js学习-单元测试-1"
tags: "单元测试"
categories: "React.js"
description: ""
createDate: "2020-12-08 10:06:03"
updateDate: "2021-08-30 21:52:23"
---


[React.js学习-单元测试-2](https://blog.mrrs.top/blog/view/612cde1686ab9f13b4b96452)

## 技术选型

Jest + React官方测试包

- `@testing-library/dom`
- `@testing-library/jest-dom`
- `@testing-library/react`
- `@testing-library/user-event`
- `jest`

## Jest配置

``` js
// jest.config.js
module.exports = {
  testMatch: ["<rootDir>/test/**/*.(spec|test).js?(x)"],
  moduleFileExtensions: ["js", "jsx"],
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.js",
  ],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
```

``` js
// setupTests.js
// 扩展jest matchers
import "@testing-library/jest-dom";
```

## 访问DOM

1. 使用 **@testing-library/react** 包里的 `render` 函数渲染组件

2. 使用 **@testing-library/react** 包里的 `screen` 属性访问界面快照

3. 使用 `screen.getBy/screen.findBy`访问元素

`render`: 将给定组件渲染到附加到`document.body`的容器中

`screen`: DOM测试库导出的所有查询均接受容器作为第一个参数。 因为查询整个document.body非常普遍，所以DOM测试库还会导出一个`screen`对象，该对象具有预先绑定到document.body的每个查询（使用内部功能）。

`findBy`和`getBy`: `getBy`会立即返回，`findBy`会等到超时或查询到元素才返回

``` js
import { fireEvent, render, screen } from '@testing-library/react';

const App = () => {
  const [value, onChange] = useInputValue('hello');
  return (
    <input type="text" placeholder={value} value={value} onChange={onChange} />
  );
};
render(<App />);
const element = screen.getByPlaceholderText('hello');
```

## 模拟事件触发

1. 使用 **@testing-library/react** 包里的 `render` 函数渲染组件

2. 使用 **@testing-library/react** 包里的 `fireEvent` 函数触发事件

``` js
const App = () => {
    const [value, onChange] = useInputValue('hello');
    return (
      <input type="text" placeholder={value} value={value} onChange={onChange} />
    );
};
render(<App />);
const element = screen.getByPlaceholderText('hello');
expect(element.getAttribute('value')).toBe('hello');
fireEvent.input(element, { target: { value: 'hello world' } });
```

## act

这函数和React自带的test-utils的act函数是同一个函数。在组件状态更新的时候（setState），组件需要被重新渲染，而这个重渲染是需要React进行调度的，因此是个异步的过程，我们可以通过使用act函数将所有会更新到组件状态的操作封装在它的callback里面来保证act函数执行完之后我们定义的组件已经完成了重新渲染。

## 对比Object

使用`toEqual`

``` js
const tom = { name: 'tom' }
expect(tom).toEqual({ name: 'tom' })
```

## 大致规范

```js
describe('xxx', () => {
  // 1. 测试函数是否定义
  it('should be defined', () => {
    expect(xxx).toBeDefined();
  });
  // 2. 测试函数是否被调用
  it('should be called', () => {
    expect(xxx).toBeCalled();
  });

});
```

## 测试实例

### 测试`useInputValue`hook

``` js
// useInputValue.test.jsx
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import useInputValue from '../src/react/hooks/useInputValue';

it('test useInputValue', () => {
  const App = () => {
    const [value, onChange] = useInputValue('hello');
    return (
      <input type="text" placeholder={value} value={value} onChange={onChange} />
    );
  };
  render(<App />);
  const element = screen.getByPlaceholderText('hello');
  expect(element.getAttribute('value')).toBe('hello');
  fireEvent.input(element, { target: { value: 'hello world' } });
  expect(element.getAttribute('value')).toBe('hello world');
});
```

``` js
// useInputValue.js
import { ChangeEvent, useCallback, useState } from 'react';

function useInputValue(initValue) {
  const [value, setValue] = useState(initValue);

  const onChange = useCallback((e) => {
    setValue(e.currentTarget.value);
  }, []);

  return [value, onChange, setValue];
}

export default useInputValue;
```

### 使用`@testing-library/react-hooks`测试`hook`

``` js
// useCounter.js

import { useState, useCallback } from 'react'

function useCounter() {
  const [count, setCount] = useState(0)

  const increment = useCallback(() => setCount((x) => x + 1), [])

  return { count, increment }
}

export default useCounter
```

``` js
// useCounter.test.js
import { renderHook, act } from '@testing-library/react-hooks'
import useCounter from './useCounter'

it('should increment counter', () => {
  const { result } = renderHook(() => useCounter())

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)
})
```