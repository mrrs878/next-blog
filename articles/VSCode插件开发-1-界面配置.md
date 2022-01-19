---
title: "VSCode插件开发-1-界面配置"
tags: "VSCode插件"
categories: "VSCode插件"
description: ""
createDate: "2021-03-23 15:34:17"
updateDate: "2021-03-26 11:28:12"
---


## 简介

VSCode插件界面与package.json中的字段对应如图

![插件界面与package.json中的字段对应](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/vscodeExtensionView.png)

其中：

- activityBar是左侧边栏中的插件图标

- '公交线路'(sidebar)相当于一级菜单，可通过packa.json中的`views.sidebar`配置

- '浦东25路/1117路'相当于二级菜单，通过代码创建

    ``` js
    vscode.window.registerTreeDataProvider('sidebar_id', TreeDataProvider);
    ```

- 菜单项中的图标在`commands`和`menus`中配置，`view/title`对应的是一级菜单；`view/item/context`对应的是二级菜单

    ``` js
    // 1. 先添加command
    "commands": [
        {
            "command": "realTimeBus.refreshLines",
            "icon": "$(refresh)",
            "title": "刷新线路"
        },
        {
            "command": "realTimeBus.addLine",
            "icon": "$(add)",
            "title": "添加线路"
        },
        {
            "command": "realTimeBus.removeLine",
            "icon": "$(remove)",
            "title": "删除线路"
        },
    ]
    
    // 2. 设置图标位置
    "menus": {
      "view/title": [
        {
          "command": "realTimeBus.refreshLines",
          "group": "navigation",  // 和文字一行显示
          "when": "view == realTimeBusLine"
        }
      ],
      "view/item/context": [
        {
          "command": "realTimeBus.revertLine",
          "group": "inline",  // 和文字一行显示
          "when": "view == realTimeBusLine && viewItem == BusLineItem"
        }
      ]
    }
    
    // 配置viewItem == BusLineItem后command回调函数可以接收到被点击的菜单项
    commands.registerCommand('realTimeBus.revertLine', (params) => {
    BusLineProvider.revertLine(params);
  });
    ```

## treeView

一级菜单可在`package.json`中配置，二级菜单需要使用`TreeDataProvider`

``` ts
export class BusLineProvider implements TreeDataProvider<BusLineTreeItem|BusStopTreeItem>{
  private static instance: BusLineProvider;

  private _onDidChangeTreeData: EventEmitter<BusLineTreeItem | undefined | void> 
    = new EventEmitter<BusLineTreeItem | undefined | void>();
	readonly onDidChangeTreeData: Event<BusLineTreeItem | undefined | void>
    = this._onDidChangeTreeData.event;
  
  getTreeItem(element: BusLineTreeItem) {
    return element;
  }

  // 核心方法
  async getChildren(item: BusLineTreeItem|BusStopTreeItem) {
    return [];
  }
  
  static getInstance(): BusLineProvider {
    return this.instance || (this.instance = new BusLineProvider());
  }
  
  static refreshLines(action: () => void = () => {}) {
    this.instance._onDidChangeTreeData.fire();
  }
}
```

创建后注册即可`vscode.window.registerTreeDataProvider('realTimeBusLine', BusLineProvider.getInstance());`

关键在于`getChildren`方法

`getChildren`会在以下情形调用:

1. 调用`vscode.window.registerTreeDataProvider`注册TreeDataProvider时

2. 调用`this.instance._onDidChangeTreeData.fire()`时

3. 点击可折叠`TreeItem`

## 可折叠菜单

设置`TreeItem`的`collapse`属性为`TreeItemCollapsibleState.Collapsed`

点击该菜单时会调用`getChildren`，该菜单也回作为参数传递给`getChildren`