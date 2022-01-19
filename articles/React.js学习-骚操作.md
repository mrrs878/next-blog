---
title: "React.js学习-骚操作"
tags: "React.js骚操作"
categories: "React.js"
description: ""
createDate: "2021-01-04 15:21:23"
updateDate: "2021-04-26 16:54:30"
---


## 获取target

``` ts
export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>;

type TargetElement = HTMLElement | Element | Document | Window;

export function getTargetElement(
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement,
): TargetElement | undefined | null {
  if (!target) return defaultElement;
  let targetElement: TargetElement | undefined | null;

  if (typeof target === 'function') {
    targetElement = target();
  } else if ('current' in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
}
```

## 父子组件通信

父组件要获取子组件的值：通过`props`传递回调函数

## react-router-dom重定向

``` tsx
import { Redirect } from 'react-router-dom';

<Redirect to="/auth/login" />
```