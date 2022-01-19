---
title: "设计模式-OCP"
tags: "设计模式 OCP"
categories: "设计模式"
description: ""
createDate: "2019-10-17 18:12:29"
updateDate: "10/1/2021, 3:34:43 AM"
---


## 开放封闭原则

对扩展开放，对修改封闭

假设我们是一个大型 Web 项目的维护人员，在接手这个项目时，发现它已经拥有 10 万行以上的 JavaScript 代码和数百个 JS 文件。 不久后接到了一个新的需求，即在 window.onload 函数中打印出页面中的所有节点数量

```javascript
// 普通版
window.onload = function() {
  //原有代码
  console.log(document.getElementByName("*").length);
};

// OCP版 