---
title: "HTML复习-0"
tags: "HTML"
categories: "2021复习"
description: ""
createDate: "2021-05-18 02:48:23"
updateDate: "2021-06-29 19:07:42"
---


## 节点关系

![节点关系](http://mrrsblog.oss-cn-shanghai.aliyuncs.com/node_relation.png)

## ParentNode.append/Node.appendChild

- `ParentNode.append()`允许追加  `DOMString` 对象，而 `Node.appendChild()` 只接受 `Node` 对象
- `ParentNode.append()` 没有返回值，而 `Node.appendChild()` 返回追加的 `Node` 对象
- `ParentNode.append()` 可以追加多个节点和字符串，而 `Node.appendChild()` 只能追加一个节点

## cookie

![cookie格式](http://mrrsblog.oss-cn-shanghai.aliyuncs.com/cookie_0.png)

- Name: `cookie`的名字
- Value: `cookie`的值
- Domain: 指定了哪些域名可以接收`cookie`。如果不指定，默认为`origin`，不包含子域名，如果制定则包含子域名
- Path: 制定了域名下的哪些路径可以接受`cookie`。子路径也会被匹配
- Expires/Max-Age: 定义`cookie`的生命周期
- HttpOnly: 限制JavaScript通过`document.cookie`访问
- Secure: 标记为`Secure`的`cookie`只应通过被HTTPS协议加密过的请求发送给服务端
- SameSite: 设置某个`cookie`在跨站请求时会不会被发送
    - None 浏览器会在同站请求、跨站请求下继续发送`cookie`
    - Strict 浏览器将只在访问相同站点时发送`cookie`
    - Lax 与Strict类似，但不包括用户从外部站点导航至该URL
- Priotity: chrome的提案，`Low/Medium/Hight`，低优先级的`cookie`会在`cookie`数量超出时被移除

不设置`max-age`和`expires`，此`cookie`就是会话级别的

## 事件机制

IE 事件流被称为**事件冒泡**。事件从最具体的元素（文档树中最深的节点）开始触发，然后向上传播至没有那么具体的元素（文档）

Netscape Communicator提出**事件捕获**机制。最不具体的节点应该最先收到事件，而最具体的节点应该最后收到事件。事件捕获实际上是为了在事件到达最终目标前拦截事件

DOM2 Events规范规定事件流分为个阶段：事件捕获、到达事件目标、事件冒泡。事件捕获最先发生，为提前拦截事件提供了可能。然后，实际的目标元素接收到事件。最后一个阶段是冒泡，最迟要在这个阶段响应事件。

添加/移除事件处理程序：

- DOM0
    ``` js
    element.onclick = () => {};
    element.onclick = null;
    
    // 同一事件不能添加多个处理函数
    ```
- DOM2
    ``` js
    element.addEventListener('click', handler);
    element.removeEventListener('click', handler);
    ```

## MutationObserver

可以在DOM被修改时异步执行回调，使用`MutationObserver`可以观察整个文档、DOM树的一部分，或某个元素。此外还可以观察元素属性、子节点、文本

``` jsx
const App = () => {
  const elementRef = useRef(null);

  const onElementClick = () => {
    elementRef.current.name = 'observer';
  };

  useEffect(() => {
    const observer = new MutationObserver((record) => {
      console.log(record[0].target.name);
    });
    observer.observe(elementRef.current, { attributes: true });
  }, []);
  return (
    <button ref={elementRef} type="button" onClick={onElementClick} title="button">click me</button>
  );
};
```

默认情况下，只要被观察元素不被垃圾回收，MutationObserver的回调就会响应DOM变化事件，从而被执行，要提前终止执行回调，可以调用`disconnect()`方法。

`observe`配置

|属性|类型|说明|默认值|
|--|--|--|--|
|subtree|`boolean`|表示除了目标节点，是否观察目标节点的子树(后代)</br>如果是`false`则只观察目标节点的变化</br>如果是`true`则观察目标阶段及其整个子树|`false`|
|attributes|`boolean`|表示是否观察目标阶段的属性变化|`true`|
|attributeFilter|`Array<string>/boonean`|表示要观察哪些属性的变化</br>把这个值置为`true`也会将`attributes`的值转换为`true`|`true`|
|attributeOldValue|`boolean`|表示`MutationObserver`是否记录变化之前的属性值</br>把这个值置为`true`也会将`attributes`置为`true`|`false`
|characterData|`boolean`|表示修改字符数据是否触发变化事件|`false`|
|characterDataOldValue|`boolean`|表示`MutationObserver`是否记录变化之前的字符数据</br>把这个值置为`true`也会将`characterData`的值置为`true`|`false`|
|childList|`boolean`|表示修改目标节点的子节点是否触发变化事件|`false`|

## Node类型

DOM1描述了名为`Node`的接口，这个接口是所有DOM节点类型都必须实现的。Node接口在JavaScript中被实现为`Node`类型，在除IE外的所有浏览器中都可以直接访问这个类型。在JavaScript中，所有节点都继承`Node`类型，因此所有类型都共享相同的基本属性和方法

# DOCTYPE作用

浏览器使用`DOCTYPE`声明来选择是否使用更符合Web标准或兼容旧浏览器的bug的模式。现代浏览器主要有两种渲染模式：

- 怪异模式，又称向后兼容模式。旧浏览器使用的非标准渲染规则
- 标准模式。严格遵守W3C标准

``` html
<!-- HTML5的doctype声明 -->
<!DOCTYPE html>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
"http://www.w3.org/TR/html4/strict.dtd">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

## HTML5新特性

- 新的文档类型声明(`DOCYPE`)
- 新的语义元素，比如`<header>`,`<footer>`, `<article>`, `<section>`等
- 新的表单控件，比如数字、日期、时间、日历和滑块
- 强大的图像支持（借由`<canvas>`和`<svg>`）
- 强大的多媒体支持（借由`<video>`和`<audio>`）
- 新的API（如`localStorage`）

## 参考

[MDN-append](https://developer.mozilla.org/zh-CN/docs/orphaned/Web/API/ParentNode/append)
