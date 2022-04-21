---
title: "Web Component-自定义元素的生命周期"
tags: "微前端 WebComponent"
categories: "微前端"
description: ""
createDate: "2022-04-21 21:06:23"
updateDate: "2022-01-08 22:40:37"
---

在之前大概了解了 Web Component，知道是怎么玩的，不过在查阅资料后发现之前有些错误

## Node.cloneNode 的局限性

在之前，使用的是`template.content.cloneNode(true);`来创建出一个新的节点，这种方法有一些局限性：会复制原节点的所有属性及属性值，其中就包括`id`，这样页面中就有多个`id`一样的元素了

> 拷贝它所有的属性以及属性值,当然也就包括了属性上绑定的事件(比如 onclick="alert(1)"),但不会拷贝那些使用 addEventListener()方法或者 node.onclick = fn 这种用 JavaScript 动态绑定的事件. --mdn

MDN 同样也给出警告

> 注意:为了防止一个文档中出现两个 ID 重复的元素,使用 cloneNode()方法克隆的节点在需要时应该指定另外一个与原 ID 值不同的 ID

而且，生成的节点的`ownerDocument`仍然指向源节点的`ownerDocument`

既然这个方法有一定的局限性，那么有没有更好的方法呢？有的！

## document.importNode

> [document.importNode](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/importNode)将外部文档的一个节点拷贝一份,然后可以把这个拷贝的节点插入到当前文档中

使用方式

```js
// deep参数表示是否递归复制源节点的所有子节点
const node = document.importNode(externalNode, deep);
```

注意：

新生成节点的 `parentNode` 是 `null`，因为它还没有插入当前文档的文档树中，**属于游离状态**，因此无法对其进行操作

这样的话我们就可以很方便的修改新节点的`ownerDocument`（在`append`之后自动指向当前`document`）

试试新的 api 来创建*组件*

```html
<script>
  class MHeader extends HTMLElement {
    constructor() {
      super();
      // ...
      const content = document.importNode(template.content, true);
      /**
       * 注意，要先将节点插入到shadowRoot后才能对其进行操作
       */
      shadowRoot.appendChild(content);
      // ...
    }
  }
</script>
```

## HTMLElement 的生命周期

在之前，我们都是将各种操作直接写在构造函数里，这显然有些臃肿，那么有没有一些办法可以将这些逻辑分发出去呢？有的！

在`HTMLElement`内，有一些[生命周期](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements#%E4%BD%BF%E7%94%A8%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0)

- `connectedCallback`，当 `custom element` 首次被插入文档 DOM 时被调用

- `disconnectedCallback`，当 `custom element`从文档 DOM 中删除时被调用

- `adoptedCallback`， 当 `custom element`被移动到新的文档时被调用

- `attributeChangedCallback`，当 `custom element`增加、删除、修改自身属性时被调用

据此，我们可以重构一下之前的*组件*

```html
<script>
  class MHeader extends HTMLElement {
    static get observedAttributes() {
      return ["title"];
    }
    constructor() {
      super();
      // 会自动向this上挂载一个shadowRoot
      this.attachShadow({ mode: "open" });
      const template = document.querySelector("#mHeaderTemplate");
      // const content = template.content.cloneNode(true);
      const content = document.importNode(template.content, true);
      this.shadowRoot.appendChild(content);
    }

    connectedCallback() {
      const loginBtn = this.shadowRoot.querySelector("#login");
      loginBtn.addEventListener("click", () => {
        this.setAttribute("title", "登录成功");
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "title") {
        this.shadowRoot.querySelector("#content").innerText = newValue;
      }
    }
  }
</script>
```

在这里，我们使用`attributeChangedCallback`来监听*组件*属性变化，在`title`属性发生变化时，更新元素的值。该回调会返回三个参数：

- `name`，变化的属性的名字

- `oldValue`，属性之前的值

- `newValue`，要设置的值

（react 写的多了，有点梦回 vue 的感觉 🤔）

此外有一点要注意：

需要在`static get observedAttributes`函数里声明一下要监听的属性名

```js
static get observedAttributes() {
  return ["title"];
}
```

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
    <template id="mHeaderTemplate">
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
        static get observedAttributes() {
          return ["title"];
        }
        constructor() {
          super();
          // 会自动向this上挂载一个shadowRoot
          this.attachShadow({ mode: "open" });
          const template = document.querySelector("#mHeaderTemplate");
          // const content = template.content.cloneNode(true);
          const content = document.importNode(template.content, true);
          this.shadowRoot.appendChild(content);
        }

        connectedCallback() {
          const loginBtn = this.shadowRoot.querySelector("#login");
          loginBtn.addEventListener("click", () => {
            this.setAttribute("title", "登录成功");
          });
        }

        attributeChangedCallback(name, oldValue, newValue) {
          if (name === "title") {
            this.shadowRoot.querySelector("#content").innerText = newValue;
          }
        }
      }

      window.customElements.define("m-header", MHeader);

      const mHeader = document.querySelector("#mHeader");
    </script>
  </body>
</html>
```

## 总结

由于`Node.cloneNode`仍默认保留新节点的`ownerDocument`，因此使用起来没法放开，有些需要注意的地方。不过我们可以使用`document.importNode`来实现相同的功能，该API创建的节点处于游离状态，在进行`append`操作后会自动修正`ownerDocument`的指向

通过使用`custom elements`提供的生命周期函数，我们可以很方便地监听属性变化来做一些逻辑，但还是那句话书写起来有些不够便捷，需要用到原生 dom 操作 api，没准 jQuery 会借着 Web Components 再重新活跃起来

## 参考

[MDN-Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)

[MDN/web-components-examples](https://github.com/mdn/web-components-examples)

[Node.cloneNode(deep)](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/cloneNode)

[document.importNode](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/importNode)

[使用 custom elements](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements#%E4%BD%BF%E7%94%A8%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0)
