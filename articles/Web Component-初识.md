---
title: "Web Component-初识"
tags: "微前端 WebComponent"
categories: "微前端"
description: ""
createDate: "2022-04-20 21:16:56"
updateDate: "2022-01-08 22:40:37"
---

Web Component 有点东西

## 什么是 Web Component

> Web Components 是一套不同的技术，允许您创建可重用的定制元素（它们的功能封装在您的代码之外）并且在您的 web 应用中使用它们。--MDN

简单来讲就是浏览器提供的原生**组件复用**方案。主要由三种技术方案实现：

- Custom elements（自定义元素）。可以用来定义标签（元素）

- Shadow DOM（影子 DOM）。可以用来做样式隔离

- HTML templates（HTML 模板）。可以用来定义一个基础的组件的dom结构

## 怎么用 Web Component

实现 Web Component 的**最基本**流程：

1. 使用`template`来定义一个*组件*的dom

```html
<template id="mHeader">
  <div>
    <span class="content" id="content">我是头部</span>
  </div>
</template>
```

2. 接着基于👆创建的`template`创建一个*类组件*

```jsx
class MHeader extends HTMLElement {
  constructor() {
    super();
    // attachShadow() 方法来将一个 shadow root 附加到任何一个元素上，该方法返回一个 shadow root 。
    const shadowRoot = this.attachShadow({ mode: "closed" });
    const template = document.querySelector("#mHeader");
    const content = template.content.cloneNode(true);
    shadowRoot.appendChild(content);
  }
}
```

3. [CustomElementRegistry.define()](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomElementRegistry/define) 方法注册自定义标签（元素）

```jsx
/**
 * 注意，组件名是有限制的，MHeader、header1等都是不能用的，浏览器会报错
 * 
 * web-component.html:33 Uncaught DOMException: Failed to execute 'define' on 'CustomElementRegistry': "header1" is not a valid custom element name
    at file:///Users/echo/Desktop/web-component.html:33:27
 */
window.customElements.define("m-header", MHeader);
```

4. 使用该*组件*

```html
<!-- 使用的地方没有限制，自闭合也是可以的 -->
<m-header />
```

5. 给组件加点样式

可以直接在`template`里添加`style`标签，在里面可以添加只在该`template`下生效的样式

`:host`选择器可以选择组件的根元素

```html
<template id="mHeader">
  <style>
    :host {
      font-size: 32px;
    }
    .content {
      color: #f00;
    }
  </style>
  <div>
    <span class="content" id="content">我是头部</span>
  </div>
</template>
```

6. 加点属性试试 🤔

需要在第 2 步在定义组件时用到`this.getAttribute`来获取传入的属性

```jsx
class MHeader extends HTMLElement {
  constructor() {
    // ...
    const title = this.getAttribute("title");
    if (title) {
      content.querySelector("#content").innerText = title;
    }
    // ...
  }
}

<m-header title="hello" />;
```

7. 添加一些交互

可以使用`querySelector`获取到`template`内部的一些元素来添加事件

```html
<template id="mHeader">
  <div>
    <!-- ... -->
    <button id="login">login</button>
  </div>
</template>
```

接着绑定事件

```jsx
class MHeader extends HTMLElement {
  constructor() {
    // ...
    content.querySelector("#login").addEventListener("click", () => {
      alert("login");
    });
    // ...
  }
}
```

8. 与父组件的通信

通过[CustomEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent)来进行通信

完整代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <template id="mHeader">
      <style>
        :host {
          font-size: 32px;
        }

        .content {
          color: #f00;
        }
      </style>
      <div>
        <span class="content" id="content">我是头部</span>
        <button id="login">login</button>
      </div>
    </template>

    <m-header id="mHeader" title="hello" />

    <script>
      class MHeader extends HTMLElement {
        constructor() {
          super();
          const shadowRoot = this.attachShadow({ mode: "closed" });
          const template = document.querySelector("#mHeader");
          const content = template.content.cloneNode(true);
          const title = this.getAttribute("title");
          if (title) {
            content.querySelector("#content").innerText = title;
          }
          const myEvent = new CustomEvent("login", {
            detail: "这是子组件传过来的消息",
          });
          const loginBtn = content.querySelector("#login");
          loginBtn.addEventListener("click", () => {
            alert("login");
          });
          shadowRoot.appendChild(content);
        }
      }

      window.customElements.define("m-header", MHeader);
    </script>
  </body>
</html>
```

未完待续

to be continued...

## 基于 Web Component 的落地应用

GitHub。GitHub是基于 Web Components 来开发的

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6309ad13b5b24d23aaf42e426923d4c4~tplv-k3u1fbpfcp-watermark.image?)

其次，Vue.js和微信小程序也是基于 Web Components 来做组件化的

## 总结

Web Component 是浏览器提供的可以用于组件复用的方案，可以实现样式隔离，自定义属性、父子组件通信等功能，有不少应用/框架都是基于Web Component来进行开发的，前景广阔。但Web Component书写起来还是有些不够便捷，需要用到原生 dom 操作 api

## 参考

[MDN-Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)

[MDN/web-components-examples](https://github.com/mdn/web-components-examples)
