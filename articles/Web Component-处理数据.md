---
title: "Web Component-处理数据"
tags: "微前端 WebComponent Attribute Property"
categories: "微前端"
description: ""
createDate: "2022-04-24 22:00:47"
updateDate: "2022-04-23 22:54:37"
---

在前一篇中，我们开发了一个`Reply`组件，大概长这样

![web component reply](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/reply.gif)

功能是完成了，不过今天浏览看到一篇文章[Handling data with Web Components](https://itnext.io/handling-data-with-web-components-9e7e4a452e6e)，大概是介绍了 Web Component 中数据交互的几种方式，有不少收获，特此总结记录一下

## attribute VS property

首先是`attribute`和`property`，我们之前的代码中使用的是`attribute`来将`comments`传递到组件中，组件拿到后开始渲染数据。这种方案有一个弊端：`attribute`只接收字符串类型的数据，由于`comments`是一个数组类型，因此我们在传递之前需要使用`JSON.stringify`一下以及使用数据时需要`JSON.parse`一下，使用起来有一些不够方便

```js
// 更新comments时需要处理成字符串
reply.setAttribute("comments", JSON.stringify(comments));

// 使用时需要解析成数组
if (name === "comments") {
  this.renderComments(JSON.parse(newValue));
}
```

那么有没有一种更好的方式来取代这种方式呢？有的，可以使用`property`来传递数据

`property`和`attribute`中文翻译过来意思很接近，但实际上是有不小的区别

考虑下面这一行代码

```html
<input type="text" value="Age:" />
```

`type`和`value`就是`input`标签的*`attribute`*

当浏览器编译完 HTML 代码，会生成与之对应的一个个 DOM 节点，每个 DOM 节点是一个对象，此时它又拥有很多*`property`*，例如`height`、`alt`、`checked`等

对于一个 DOM 节点对象来讲，`property`就是这个对象上的属性；`attribute`是该对象对应的 HTML 标签元素上的属性

`property`和`attribute`大致上一一对应，但也有些特例，比如上述`input`标签的`value`：DOM 节点对象上的`value`会在输入之后发生变化，假如用户输入的是`John`，那么此时`Input.value`的返回值是`John`，而`Input.getAttribute('value')`的返回值则是`Name:`。此外还有其他的一些特例，感兴趣的可以去这里[What is the difference between properties and attributes in HTML](https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html/6004028#6004028)看看原文

既然`property`是对象上的一个属性，那个肯定也可以给它赋一个对象类型的值！接下来就使用`property`来重构`Reply`组件

## 使用 property 重构组件

其实修改起来非常方便，代码改动比较少

首先是最下面给组件更新值的代码需要变动：不再使用`setAttribute`，而是直接设置`comments`属性

```js
reply.setAttribute("comments", JSON.stringify(comments));

// 修改为 ⬇️
reply.comments = comments;
```

其次，我们需要一对`getter`和`setter`来监听数据变化从而渲染新的值

```js
class Reply extends HTMLElement {
  constructor() {
    // 在这里，我们使用_comments来保存comments数据
    this._comments = [];
  }
  get comments() {
    return this._comments;
  }

  set comments(newValue) {
    this._comments = newValue;
    this.renderComments(newValue);
  }
}
```

同时，删除监听`comments`属性相关的代码，因为我们这个已经通过`setter`实现数据监听了

更新一步！

既然我们都能传递数组进去了，那么在大胆点，可不可以传递一个函数呢？

当然可以！！！

我们可以直接在`reply`上挂载一个`onSubmitComment`函数，在`Reply`内部按钮点击时调用该回调，并将数据传递出来

```js
// 直接在组件实例上挂载一个回调函数
reply.onSubmitComment = (e) => {
  comments.push({
    comment: e,
    nickName,
    avatar,
  });
  reply.comments = comments;
};

// 组件内部，点击按钮时调用该函数
submitBtn.addEventListener("click", () => {
  this.onSubmitComment?.(commentInput.value);
  commentInput.value = "";
});
```

🎉

完整代码[在这里](https://github.com/mrrs878/web-components/blob/main/reply-property.html)

## 总结

`attribute`只能传递字符串数据，`property`由于是 DOM 对象上的属性，因此可以传递诸如对象、函数等复杂类型的数据。据此，我们可以使用`property`来将数据直接设置到组件实例上，组件内部新增一对`getter`和`setter`来接收数据，而且我们还可以直接在组件实例上挂载一个回调函数，在组件内部可以直接调用该回调。此外在处理类似于`disable`这种类型的`attribute`时也可以使用`property`+`getter`和`setter`来实现布尔类型属性的设置

总之，`attribute`和`property`搭配使用将极大提高开发效率

## 参考

[What is the difference between properties and attributes in HTML](https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html/6004028#6004028)
