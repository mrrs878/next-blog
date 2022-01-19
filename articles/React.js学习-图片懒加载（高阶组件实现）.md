---
title: "React.js学习-图片懒加载（高阶组件实现）"
tags: "React.js学习 HOC"
categories: "React.js"
description: ""
createDate: "2020-05-12 23:03:54"
updateDate: "2020-10-16 17:33:00"
---


# 懒加载实现方式

HTML5新API：`new IntersectionObserver(callback)`

观察一个元素后，当元素出现在视口内，会触发回调

[其他实现方式]([http://blog.p18c.top/2020/04/24/%E5%89%8D%E7%AB%AF%E6%9E%B6%E6%9E%84&%E8%BD%AF%E5%AE%9E%E5%8A%9B-%E9%A2%84%E5%8A%A0%E8%BD%BD&%E6%87%92%E5%8A%A0%E8%BD%BD/](http://blog.p18c.top/2020/04/24/前端架构&软实力-预加载&懒加载/))

# 代码实现

``` tsx
// MLazyLoad.tsx

import React, { useEffect, useRef, useState } from 'react';
import { clone } from 'ramda';


interface PropsI {
  element: () => JSX.Element,
}

const LazyLoad: React.FC<PropsI> = (props: PropsI) => {
  const [Element, setElement] = useState<JSX.Element>(props.element());
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    (async () => {
      if (!elementRef || !elementRef.current) return;
      const observer = new IntersectionObserver((changes) => {
        changes.forEach((change) => {
          if (change.isIntersecting) {
            const Com = clone(Element);
            Com.props.src = Com.props['data-src'];
            Reflect.deleteProperty(Com.props, 'data-src');
            setElement(Com);
            observer.unobserve(change.target);
          }
        });
      });
      observer.observe(elementRef.current);
    })();
  }, []);
  return (
    <div ref={elementRef}>
      {
        Element
      }
    </div>
  );
};

export default function (element: () => JSX.Element) {
  return (
    <LazyLoad element={element} />
  );
}
```

# 使用方式

``` tsx
const ImageNode = () => <img className={style.itemImg} data-src="xxx" alt="" />;

<div>
	{
        lazyLoad(ImageNode)
    }
</div>
```

# 效果

![lazyload](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/lazyload.gif)