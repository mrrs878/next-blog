---
title: "Vue.js研读-基础"
tags: "Vue.js"
categories: "Vue.js"
description: ""
createDate: "2020-03-02 23:21:38"
updateDate: "10/1/2021, 3:34:43 AM"
---


## Document.createDocumentFragment()

`DocumentFragments` 是DOM节点。它们不是主DOM树的一部分。通常的用例是创建文档片段，将元素附加到文档片段，然后将文档片段附加到DOM树。在DOM树中，文档片段被其所有的子元素所代替。

因为文档片段存在于**内存中**，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面[回流](https://developer.mozilla.org/zh-CN/docs/Glossary/Reflow)（对元素位置和几何上的计算）。因此，使用文档片段通常会带来更好的性能。

## node.nodeType

1 元素

2 属性

3 文本

8 注释

9 document

## node.textContext、node.innerText

`textContent`会获取所有元素的内容，包括`script`和`style`元素。然而`innerText`只展示给人看的元素

`textContext`会返回节点中的每一个元素，相反，`innerText`受`CSS`样式的影响，不会返回隐藏元素的文本，并且会触发[回流](https://developer.mozilla.org/zh-CN/docs/Glossary/Reflow)去确保是最新的计算样式

与`textContext`不同的是，在IE11以及下版本中，对`innerText`进行修改，不仅会移除当前元素的子节点，而且会永久性的破坏所有后代文本节点，在之后不可能再次将节点到任何其他元素或同同一元素

## 通过字符串路径获取对象属性的简单方法（暂不支持[]）

```js
function parsePath (obj, path) {
    return path.split(".").reduce((data, current) => data[current], obj)
}

const obj1 = {
    tom: {
        name: "tom",
        age: 23
    }
}

const res = parsePath(obj1, "tom.name")
console.log(res);
// tom
```

## e.target和e.currentTarget

e.target指向触发事件的对象

e.currentTarget指向添加监听事件的对象

## Vue.js整体流程

![Vue.js整体流程](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/vue-4.png)