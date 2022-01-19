---
title: "前端架构&软实力-JSBridge原理"
tags: "JSBridge"
categories: "前端架构&软实力"
description: ""
createDate: "2020-04-25 23:01:48"
updateDate: "2021-02-20 17:16:05"
---


# 什么是JSBridge

JSBridge是一种JavaScript实现的Bridge，连接着桥两端的native和H5。它在APP里方便地让native调用JavaScript，JavaScript调用native，是双向通信的通道。

# JSBridge双向通信原理

## JavaScript调用native

JavaScript调用native的实现方式较多，主要有：

- 拦截`URL Scheme`
- 重写`prompt`
- 注入API

### 拦截`URL Scheme`

Android和iOS都可以通过拦截`URL Scheme`并解析`Scheme`来决定是否进行对应的native代码逻辑处理。

Android 的话，`Webview` 提供了 `shouldOverrideUrlLoading` 方法来提供给 Native 拦截 H5 发送的 `URL Scheme` 请求。

iOS 的 `WKWebview` 可以根据拦截到的 `URL Scheme` 和对应的参数执行相关的操作。

这种方法的优点是不存在漏洞问题、使用灵活，可以实现 H5 和 Native 页面的无缝切换。例如在某一页面需要快速上线的情况下，先开发出 H5 页面。某一链接填写的是 H5 链接，在对应的 Native 页面开发完成前先跳转至 H5 页面，待 Native 页面开发完后再进行拦截，跳转至 Native 页面，此时 H5 的链接无需进行修改。但是使用 iframe.src 来发送 `URL Scheme` 需要对 URL 的长度作控制，使用复杂，速度较慢。

### 重写 prompt 等原生 JS 方法

Android 4.2 之前注入对象的接口是 `addJavascriptInterface` ，但是由于安全原因慢慢不被使用。一般会通过修改浏览器的部分 `Window` 对象的方法来完成操作。主要是拦截 `alert`、`confirm`、`prompt`、`console.log` 四个方法，分别被 `Webview` 的 `onJsAlert`、`onJsConfirm`、`onConsoleMessage`、`onJsPrompt` 监听。

iOS 由于安全机制，`WKWebView` 对 `alert`、`confirm`、`prompt` 等方法做了拦截，如果通过此方式进行 Native 与 JS 交互，需要实现 `WKWebView` 的三个 `WKUIDelegate` 代理方法。

使用该方式时，可以与 Android 和 iOS 约定好使用传参的格式，这样 H5 可以无需识别客户端，传入不同参数直接调用 Native 即可。剩下的交给客户端自己去拦截相同的方法，识别相同的参数，进行自己的处理逻辑即可实现多端表现一致。另外，如果能与 Native 确定好方法名、传参等调用的协议规范，这样其它格式的 `prompt` 等方法是不会被识别的，能起到隔离的作用。

### 注入API

基于 `Webview` 提供的能力，可以向 `Window` 上注入对象或方法。JavaScript 通过这个对象或方法进行调用时，执行对应的逻辑操作，可以直接调用 Native 的方法。使用该方式时，JavaScript 需要等到 Native 执行完对应的逻辑后才能进行回调里面的操作。

Android 的 `Webview` 提供了 `addJavascriptInterface` 方法，支持 Android 4.2 及以上系统。

iOS 的 `UIWebview` 提供了 `JavaScriptScore` 方法，支持 iOS 7.0 及以上系统。`WKWebview` 提供了 `window.webkit.messageHandlers` 方法，支持 iOS 8.0 及以上系统。`UIWebview` 在几年前常用，目前已不常见。

## native调用JavaScript

native调用JavaScript只需H5将JavaScript方法暴露在`window`上给native调用即可

Android中主要有两种方式实现。在4.4之前，通过loadUrl方法，执行一段JavaScript代码来实现。在4.4之后，可以使用`evaluateJavascript`方法实现。loadUrl方法使用起来方便简洁，但是效率低无法获得返回结果且调用的时候会刷新webview。evaluateJavascript方法效率高且获取返回值方便，调用时不刷新`webview`，支持4.4+

iOS在`WKWebview`中可以通过`evaluateJavascript:javascriptString`来实现，支持8.0+