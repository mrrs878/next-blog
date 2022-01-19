---
title: "React.js学习-单元测试-2"
tags: "单元测试"
categories: "React.js"
description: ""
createDate: "2021-08-30 13:33:10"
updateDate: "2021-09-01 22:01:37"
---


[React.js学习-单元测试-1](https://blog.mrrs.top/blog/view/5fcf500be531783853b2fc5c)

[示例代码仓库](https://codesandbox.io/s/beautiful-mcclintock-8iqp8)

React.js + Typescript + Jest + @testing-library

## 安装和配置

### 安装

需要以下库

- `jest`, 自动化测试框架
- `ts-jest`，添加对`typescript`的支持
- `@testing-library/jest-dom`，添加了一些额外的匹配器，测试dom
- `@testing-library/react`，测试react组件
- `@testing-library/react-hooks`，测试自定义hooks
- `Babel`，转译jsx与ESM

``` shell
yarn add jest @testing-library/jest-dom @testing-library/react @testing-library/react-hooks ts-jest -D
```

### 配置

添加`jest`配置文件

``` js
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.js',
  ],
};

// setupTests.js
import '@testing-library/jest-dom';
```

`ts`编译配置文件要有以下配置

``` json
// tsconfig.json
// ...
"compilerOptions": {
    "jsx": "react",
    "lib": [
        "dom",
        "dom.iterable",
        "esnext"
    ],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
}
// ...
```

## Jest简要教程

`describe`用来包含一块测试的代码，通常用它来对几个测试进行分组

`test`是每一个测试，内部包含需要测试的方法，别名为`it`

`expect`翻译为预期，需要和很多匹配器结合使用

``` ts
describe('test useCookie', () => {
  it('should be defined', () => {
    expect(useCookie).toBeDefined();
  });
  // ...
}
```

## 常见DOM测试用例

### 测试按钮点击事件

``` jsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";

describe("click events", () => {
  it("click", () => {
    const onClick = jest.fn();

    const { getByLabelText } = render(
      <button aria-label="Button" onClick={onClick} />
    );

    const btn = getByLabelText("Button");
    fireEvent.click(btn);
    expect(onClick).toBeCalled();
    expect(onClick).toBeCalledTimes(1);
  });
});
```

### 测试input输入事件

``` jsx
import React from "react";
import { fireEvent, render } from "@testing-library/react";

describe("input element", () => {
  const onChange = jest.fn();

  it("change", () => {
    const { getByTestId } = render(
      <input type="text" data-testid="changeInput" onChange={onChange} />
    );

    const input = getByTestId("changeInput");
    fireEvent.change(input, { target: { value: "hello" } });
    expect(onChange).toBeCalled();
    expect(input).toHaveProperty("value", "hello");
  });
});
```

### 测试props

``` jsx
import React from "react";
import { render } from "@testing-library/react";

describe("props", () => {
  const App = ({ loading }: { loading?: boolean }) => (
    <span data-testid="span">{loading ? "loading..." : "hello"}</span>
  );

  it("default props", () => {
    const { getByTestId } = render(<App />);
    const span = getByTestId("span");
    expect(span).toHaveTextContent("hello");
  });

  it("props change", () => {
    const { getByTestId, rerender } = render(<App />);
    const span = getByTestId("span");
    expect(span).toHaveTextContent("hello");
    // 通过rerender来模拟props对改变
    rerender(<App loading={true} />);
    expect(span).toHaveTextContent("loading...");
    rerender(<App loading={false} />);
    expect(span).toHaveTextContent("hello");
  });
});
```

