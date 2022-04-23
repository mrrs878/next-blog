---
title: "Web Component-开发组件"
tags: "微前端 WebComponent"
categories: "微前端"
description: ""
createDate: "2022-04-22 09:51:39"
updateDate: "2022-04-23 20:40:37"
---

经过前两天的学习，已经基本入门 Web Component ，那么就开始实战，开发第一个组件

不过在此之前，还要介绍另一个特性

## slot

> slot 由其 name 属性标识，并且允许您在模板中定义占位符，当在标记中使用该元素时，该占位符可以填充所需的任何 HTML 标记片段。--MDN

比如我们的`template`是这样的：在需要的地方放置一个指定`name`属性的`slot`

```html
<template id="mHeaderTemplate">
  <p><slot name="my-text">My default text</slot></p>
</template>
```

在使用的时候，可以这样玩：给元素设置一个`slot`属性，值为`template`里`slot`的`name`

```html
<m-header id="mHeader" title="hello">
  <span slot="my-text">Let's have some different text!</span>
</m-header>
```

这样`span`会替换`template`里的`slot`。使用起来还是挺简单的

特性介绍完毕，接下来进行今天的主题：组件开发实战

## Reply 组件

本次来复制 Ant Design 的 `Card` 组件

![reply](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/reply.png)

先观察组件

1. 默认情况下有一个头像、输入框、提交按钮

2. 在输入值点击提交按钮后，输入框上方会出现每一条的评论，包括评论人头像、昵称、评论的内容

针对上述功能，简单的实现思路（肯定有更好、更优雅的 😬）：

1. `m-reply`为受控组件，只负责提交、渲染数据，因此需要一个`comments`属性，指代待渲染的评论

2. 在输入框输入数据后，点击提交，组件会向父组件发送一个消息（自定义事件），并将输入框的内容传递出去，因此父容器需要监听该事件，父组件在在处理好数据后更新`comments`，`m-reply`会自动渲染最新的数据

3. 对于`comments`，该属性是一个数组，每一项包含三项数据：评论内容`comment`、评论人头像`avatar`、评论人昵称`nickName`

在设计好思路后，开干！

先完成提交评论的功能，在这里，我们选择自定义事件的方法来实现组件间通信，在点击提交按钮时触发一个自定义事件`submitComment`，并将评论内容传递出去

```js
connectedCallback() {
  const submitBtn = this.shadowRoot.querySelector('#submitBtn');
  const commentInput = this.shadowRoot.querySelector('#input');
  submitBtn.addEventListener('click', () => {
    // 注意1：触发事件的是this
    const res = this.dispatchEvent(new CustomEvent('submitComment', {
      // 注意2：需要将数据放在detail属性上
      detail: commentInput.value,
    }));
  });
}
```

有两个注意点注意：

1. 触发事件的是`this`，即当前组件

2. 数据需要放置在自定义事件的`detail`属性上，直接传递数据或者放在其他属性上会接收不到

🚩

接着是父组件监听该事件并处理数据

```js
// 注意1：需要先获取当前组件，然后添加监听
const reply = document.querySelector("#reply");
reply.addEventListener("submitComment", (e) => {
  comments.push({
    comment: e.detail,
    nickName,
    avatar,
  });
  console.log("comments", comments);
  // 注意2：设置的属性会自动转为字符串，导致组件无法解析数据，因此需要JSON.stringify
  reply.setAttribute("comments", JSON.stringify(comments));
});
```

同样有两个注意点：

1. 需要先获取当前组件，然后**在当前组件上添加监听**

2. 组件的属性会自动将设置的值转为字符串类型，因此需要先`JSON.stringify`

最后，完成渲染每一条评论的代码

```javascript
renderComments(comments) {
  const Comment = ({ avatar, nickName, comment }) => (`
    ...
  `);
  const commentsContainer = this.shadowRoot.querySelector('#commentsContainer');
  commentsContainer.innerHTML = comments.reduce((acc, cur) => `${acc}${Comment(cur)}`, '');
}
```

该函数会在`attributeChangedCallback`监听到`comments`变化时调用，渲染出最新的评论

```js
attributeChangedCallback(name, oldValue, newValue) {
  if (name === 'comments') {
    this.renderComments(JSON.parse(newValue));
  }
}
```

最后的效果

![web component reply](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/reply.gif)

🎉

ps：该组件还有不少待完善的地方：提交按钮没有`loading`、没有校验输入值，数据安全性较低，存在 XSS 攻击的隐患、写死提交时间等，这些都会在后面慢慢完善

完整代码[在这里](https://github.com/mrrs878/web-components/blob/main/reply.html)

## 总结

Web Component 可用来开发跨框架组件，特性基本够用，使用起来也挺方便，只是开发体验有待提高，需要不停地使用原生 api 操作 dom；其次，使用自定义事件来实现组件间通信，代码量有点多（可能还有更好的方法我没找到 🤔）。

总体来说，使用 Web Component 来开发一套组件库也是一种新的的思路，新的选择，值得尝试

## 参考

[MDN-Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)

[MDN/web-components-examples](https://github.com/mdn/web-components-examples)
