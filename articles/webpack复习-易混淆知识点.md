---
title: "webpack复习-易混淆知识点"
tags: "webpack"
categories: "2021复习"
description: ""
createDate: "2021-05-17 12:56:41"
updateDate: "2021-07-15 13:54:55"
---


## module/bundle/chunk的区别

![module、bundle、chunk](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/webpack_1.png)

1. 对于一份同逻辑代码，当我们手写下一个一个的文件，它们无论是ESM还是commonJS或AMD，它们都是module
2. 当我们写module源文件传到webpack进行打包时，webpack会根据文件引用关系生成chunk文件，webpack会对这个chunk文件进行一些操作
3. webpack处理好chunk文件后，最后会输出bundle文件，这个bundle文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行

一句话总结：`module`、`chunk`、`bundle`其实就是同一份逻辑代码在不同转换场景下取的三个名字：我们直接写出来的是`module`，`webpack`处理时是`chunk`，最后生成浏览器可以直接运行的`bundle`

## filename/chunkFilename

`filename`对应于`entry`里面的输入文件，经过webpack 打包后输出文件的文件名

``` json
{
    entry: {
        "index": "/path/to/index.js"
    },
    output: {
        filename: '[name].[hash:8].js'
    }
}
```

`chunkFilename`指未列在`entry`中却又要被打包出来的`chunk`文件的名称。一般来说，这个`chunk`文件指的就是需要**懒加载**的代码

## webpackPrefetch/webpackPreload/webpackChunkName

``` js
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
```

`webpackChunkName`是为预加载的文件取别名，`webpackPrefetch`会在浏览器闲置时下载文件，`webpackPreload`会在父`chunk`加载时并行下载文件

## hash/chunkhash/contenthash

hash一般是结合CDN缓存来使用的。如果文件内容改变的话，那么对应文件hash值也会改变，对应的html引用的url地址也会改变，触发cdn服务器从源服务器上拉取对应数据进而更新本地缓存

`hash`是整个项目构建使用的，项目中如果有些变动，hash一定会变，比如说改动了utils.js，index.js里的代码虽然没有改变，但是大家都是用的同一份hash，hash一变，缓存一定会失效，这样子CDN就没有意义了

`chunkHash`就是解决这个问题的，它根据不同的入口文件(`entry`)进行依赖文件解析、构建对应的chunk，生成对应的hash值。一般用在`output`配置上

`contentHash`计算与文件内容本身有关。一般用在抽离`css`文件的插件配置上

## sourse-map 中 eval/cheap/inline


source-map会生成独立的文件

cheap-source-map不会产生列映射

eval-source-map会以`eval`函数打包运行模块，不产生独立的map文件，会显示报错的行列信息

inline-source-map映射文件以base64格式编码，加载bundle文件最后，不产生独立的map文件

## loder vs plugin

loder: 文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中

plugin: 在webpack运行的生命周期中会广播许多事件，plugin可以监听这些事件，在合适的时机通过调用webpack提供的api改变输出结果

## 参考

[webpack 中最易混淆的 5 个知识点](https://mp.weixin.qq.com/s/To_p4eYJx_dkJr1ApcR4jA)

[webpack文档](https://webpack.docschina.org)