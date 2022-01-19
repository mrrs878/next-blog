---
title: "React.js复习-v17新特性"
tags: "React.js React17"
categories: "2021复习"
description: ""
createDate: "2021-05-29 14:47:45"
updateDate: "2021-07-01 13:43:20"
---


## 全新的jsx转换

v17之前使用`jsx`需要导入`React`。这是因为v17之前需要使用`React.createElement`来编译`jsx`。
v17之后自动从`React`的`package`中引入新的入口函数并调用

## 事件委托的变更

v17不再将事件添加到`document`上，而是添加到渲染`React`的根容器中

当开发者需要在`document`上添加自定义事件时会发生意想不到的bug

``` jsx
const App = () => {
  const [showModal, setShowModal] = React.useState(false);
  React.useEffect(() => {
    const closeModal = () => setShowModal(false);
    document.addEventListener("click", closeModal);
    return () => {
      document.removeEventListener("click", closeModal);
    }
  })
  return (
    <div id="parent">
      <button onClick={(e) => {
        setShowModal(true);
        // e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}>showModal</button>
      {
        showModal && (
          <div className="modal">i am a modal</div>
        )
      }
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));
```

## 去除事件池

v17之前，如果想要用异步的方式使用事件对象`e`，则必须先调用`e.persist()`才可以，这是因为`React`在旧浏览器中重用了不同事件的事件对象以提高性能，并将所有事件字段在它们之前设置为`null`

``` jsx
function Name() {
    const [name, setName] = useState('');
    
    const onChange = (e) => {
        e.persist();
        setValue(() => e.target.value);
    }
    
    return (
        <input value={name} onInput={onChange} />
    )
}
```

## 副作用清理时间

v17之前，`useEffect`、`useLayoutEffect`的清理函数都是同步运行的，对于大型程序来讲，这并不是理想选择，因为同步操作会影响页面的显示。v17之后，`useEffect`的清理函数将变为异步运行，`useLayoutEffect`的清理函数仍保持同步运行

``` js
useEffect(() => {
    const instance = someRef.current;
    instance.someSetupMethod();
    return () => {
        instance.someCleanupMethod();
    }
})
```