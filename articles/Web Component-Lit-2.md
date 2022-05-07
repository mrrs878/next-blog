---
title: "Web Component-Lit-2"
tags: "微前端 WebComponent Lit"
categories: "微前端"
description: ""
createDate: "2022-04-27 22:25:56"
updateDate: "2022-05-07 22:54:37"
---

在昨天，我们使用 Lit 重构了`Reply`组件

功能是完成了，不过最后总结的时候有些许吐槽，事后想起来貌似是自己使用姿势不对 🤔 ，因此今天基于 typescript + webpack + Lit 来重新开发，果然体验一下就上去了：

1. typescript。有了 typescript 的加持，少写了不少模版代码

2. VS Code 插件。我们在上一篇处理中吐槽没有语法提示，今天发现 VS Code 有一个插件可以做到该功能，嗯，体验又高了一级

接下来就开始介绍我的探索之旅

## 配置开发环境

主要是安装 package + 配置 webpack + 安装插件

1. 安装必要的 package

```json
{
  "dependencies": {
    "lit": "^2.2.2",
    "typescript": "^4.6.3"
  },
  "devDependencies": {
    "html-webpack-plugin": "^5.5.0",
    "ts-loader": "^9.2.9",
    "webpack": "^5.72.0",
    "webpack-cli": "^4.9.2",
    "webpack-dev-server": "^4.8.1"
  }
}
```

2. 配置 webpack

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
    ],
  },
  devtool: "source-map",
  plugins: [new HtmlWebpackPlugin()],
};
```

3. 添加启动命令

```json
{
  "scripts": {
    "dev:lit": "webpack serve"
  }
}
```

4. 安装 VS Code 插件

VS Code 插件栏中搜索**lit-plugin**，然后安装即可，安装好之后`html`和`css`里的代码就有高亮和语法提示了（没有的话重新打开文件试试，再不行就重启大法好），而且点击组件还可以跳转了

至此，开发环境配置完毕

## 使用 typescript 重构代码

俗话说得好，磨刀不误砍柴工，先规划好要做什么

1. 重构 Reply 组件

2. 使用 typescript 开发

3. 使用 webpack 📦

那么既然用到 webpack 了，那么我们就按照通常的项目来设计了

```sh
.
├── package.json
├── src
│   ├── components
│   │   ├── Comment.ts # 评论组件
│   │   └── Reply.ts   # 回复组件
│   └── index.ts       # 入口文件，同时会创建一个App组件
├── tsconfig.json
├── webpack.config.js
└── yarn.lock
```

在这里，我们分别将不同的组件抽离到不同的文件中，这样逻辑更清晰，维护起来也更方便

好了，接下来开始编码

（代码和之前的差不多，我直接敲重点）

从 js 迁移到 ts 开始很方便快捷的，主要修改的逻辑包含下面几项

1. 去除之前的`window.customElements.define('m-comment', Comment);`，在`class`最上面添加注解`@customElement("m-comment")`

2. 属性声明也可以使用注解了

```ts
  @property({ type: String })
  avatar = ''
```

3. 组件中的`this.shadowRoot.querySelector('#input')`需要修改一下

我们可以使用`!`来强制声明`this.shadowRoot`是一定存在的，或者添加一个`if`判断

```ts
onSubmit() {
    const comment: HTMLInputElement|null = this.shadowRoot!.querySelector('#input');
    const res = this.dispatchEvent(new CustomEvent('submit-comment', {
      detail: comment!.value,
    }));
    comment!.value = "";
  }
```

4. 完成

![lit-ts-js](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/611ad4cbcda94373a63fb5b2b22bd715~tplv-k3u1fbpfcp-zoom-1.image)

可以看到，有了 typescript 的加持，代码明显清爽许多，而且开发体验也更好了

完整代码在[这里](https://github.com/mrrs878/web-components)

## 总结

typescript 牛逼，开发插件的大佬牛逼

## 参考

[Lit](https://lit.dev/docs/)
