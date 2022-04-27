---
title: "Web Component-Lit"
tags: "微前端 WebComponent Lit"
categories: "微前端"
description: ""
createDate: "2022-04-26 20:49:40"
updateDate: "2022-04-26 22:54:37"
---

在前几篇中，我们基于原生的 Web Components 开发了一个`Reply`组件，大概长这样

![web component reply](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fa68a485f5242f5b5e1eb75dfc801c1~tplv-k3u1fbpfcp-zoom-1.image)

功能是完成了，不过这些都是裸用 Web Components，有不少缺陷：

1. 性能问题。由于我们没有任何 dom diff 的操作，接收到数据后直接渲染一个节点及其子节点，过于简单粗暴

2. 数据传输问题。我们在上一篇处理数据中提到使用`property`来处理父子组件交互问题，但这样就没法给子组件传递初始属性

3. 效率。可以看到，仅仅是一个简单的`Reply`组件，就写了很多琐碎的 dom 操作，如果组件复杂一点，代码量肯定会激增

4. and so on

好在现在有一个库，可以帮助我们解决这些基础问题，使得我们可以专注于处理业务需求

[Lit](https://lit.dev/)

## Lit 是什么

> Lit is a simple library for building fast, lightweight web components.

奥，用来创建 Web Components 的一个库

官网上非常醒目地表达出其特点：Simple、Fast、Web Components，而且还对这三个特点做了说明

Simple：基于原生 Web Components，添加了一些响应式、声明式模版语法和其它一些特性

Fast：构建后体积非常小，5KB，而且没有虚拟DOM\增量更新

Web Components：基于原生 Web Components，可以和各种框架、平台无缝衔接

看起来还是挺有意思的，可以试用一下

这是官网给出的示例

```jsx
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("simple-greeting")
export class SimpleGreeting extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

  @property()
  name = "Somebody";

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}

<simple-greeting name="World"></simple-greeting>;
```

开起来还是挺简单的，那么就先试用一下，使用 Lit 来重构 Reply 组件

## 使用 Lit 重构 Reply 组件

配置开发环境的过程就略过了，直接进入编码环节

先将目光移到上述的示例，该示例创建了一个`simple-greeting`组件

首先，使用`customElement`注解，定义了一个组件`simple-greeting`，这个对标`customElements.define`

接着，使用`css`函数创建样式，这个对标`template>style`

然后，使用`property`声明了一个属性，这个对标原生的`setAttribute/getAttribute`

最后，使用`html`函数创建了一个 dom 模版

按照上面的步骤，可以很简单地修改我们的代码

```jsx
import {
  LitElement,
  css,
  html,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2.2.2/all/lit-all.min.js";

class Reply extends LitElement {
  static styles = css``;

  static properties = {
    placeholder: { type: String },
  };

  constructor() {
    super();
    this.avatar = "https://joeschmoe.io/api/v1/random";
  }

  onSubmit() {
    const comment = this.shadowRoot.querySelector("#input");
    const res = this.dispatchEvent(new CustomEvent("submit-comment"));
  }

  render() {
    return html`
      <div class="reply-c">
        <div class="comments-c" id="commentsContainer">
          ${this.comments.map(
            (comment) =>
              html`
                <m-comment
                  .avatar="${comment.avatar}"
                  .nickName="${comment.nickName}"
                  .comment="${comment.comment}"
                />
              `
          )}
        </div>
      </div>
    `;
  }
}
```

可以看到，我们代码里已经没有监听`comments`的逻辑，Lit 会帮我们做监听，变化时自动重渲

总体改造起来还是挺顺利的，有点 React + Vue 组合起来的感觉，只是在`App`里向`Reply`组件传递`comments`属性时耗费点时间，由于没看清官网的文档，一直使用的是`<m-reply comments=${comments} />`来传递，导致`Reply`组件一直接受不到值，最后翻看官网的示例，发现传递复杂类型的值时需要在前面加一个`.`（有点坑，整个改造时间有将近一半时间卡在这里 😭）

开发体验一般，欠缺一些没有语法提示和高亮

完整代码在[这里](https://github.com/mrrs878/web-components/blob/main/reply-lit.html)（在这里，为了更进一步体现组件化的思想，我们创建了三个组件`App`、`Reply`、`Comment`。`App`是根组件，用来创建页面，并将之前的`Reply`组件拆分为`Reply` + `Comment`）

## 总结

使用起来有利有弊，性能较裸写肯定有提升，但开发体验还待提高，值得尝试一下

## 参考

[Lit](https://lit.dev/docs/)
