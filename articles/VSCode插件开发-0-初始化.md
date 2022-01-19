---
title: "VSCode插件开发-0-初始化"
tags: "VSCode插件"
categories: "VSCode插件"
description: ""
createDate: "2021-03-22 15:26:01"
updateDate: "2021-03-26 12:26:14"
---


由于晚上下班坐公交方便点，虽然移动端有不少app供查看，但懒得打开手机，而且自己大多数时间都在使用vscode，因此打算开发一个实时公交插件。

[GitHub地址](https://github.com/mrrs878/real_time_bus_arrival)
[插件市场地址](https://marketplace.visualstudio.com/items?itemName=Real-timeBusArrival.real-time-bus-arrival)

## 项目搭建

1. 安装官方类似于脚手架的工具

`npm install -g yo generator-code`

2. 使用 `yo code` 初始化一个项目模板

选择 `New Extension (TypeScript)` 和 `webpack`

## 项目简单运行

VSCode打开项目并F5，会在一个新的VSCode窗口中运行插件

在新窗口的命令面板（Ctrl+Shift+P） 运行`Hello World`命令。右下角会弹出`Hello World`通知信息

注：

默认项目的激活事件设置的是执行`helloWorld`指令：

``` json
"activationEvents": [
    "onCommand:extension-template.helloWorld"
],
"contributes": {
    "commands": [
        {
            "command": "extension-template.helloWorld",
            "title": "Hello World"
        }
    ]
}
```

因此在执行`Hello World`命令时会激活插件。而且`extension.ts`中注册了`helloWorld`命令回调，因此会显示通知信息

``` ts
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "extension-template" is now active!');
    let disposable = vscode.commands.registerCommand('extension-template.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from extension_template!');
    });
    context.subscriptions.push(disposable);
}
```

## 目录结构

![vscode插件目录结构](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/vscodeExtensionDir.png)
