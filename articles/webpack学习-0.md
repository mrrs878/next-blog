---
title: "webpack学习-0"
tags: "webpack"
categories: "webpack"
description: ""
createDate: "2020-03-12 23:51:35"
updateDate: "10/1/2021, 3:34:43 AM"
---


## webpack

`webpack`是一个现代的`JavaScript`应用程序打包工具。当`webpack`处理应用程序时，会递归构建一个**依赖关系图**，其中包含应用程序需要的每个模块，然后将这个模块打包成一个或多个bundle

![概念图](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/webpack-0.png)

## webpack的核心概念

- `entry`（入口）

  入口指示`webpack`应该使用哪个模块来作为构建其内部**依赖图**的开始。进入入口起点后，`webpack`会找出有哪些模块是库入口起点（直接和间接）依赖的

  每个依赖项随即被处理，最后输出到称之为`bundles`的文件中。

  可以通过在`webpack`配置中配置entry属性来指定一个或多个入口起点。默认为`./src`

- `output`（出口）

  `output`告诉`webpack`在哪输出它所创建的`bundles`，以及如何命名这些文件，默认值为`./dist`。基本上，整个应用程序结构都会被编译到指定的输出路径的文件夹中。可以通过配置文件中的`output`字段来指定输出的文件夹

- `loader`

  `loader`让`webpack`能够去处理那些非`JavaScript`文件（`webpack`自身只理解`JavaScript`）。`loader`能够将所有类型的文件转换为`webpack`能够处理的有效模块，然后就可以利用`webpack`的打包能力对它们进行处理。

  同一个`rule`下的多个`loader`时将从右往左执行

- `plugin`

  `loader`被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括从打包优化和压缩一直到重新定义环境中的变量，插件接口功能极其强大，可以用来处理各种各样的任务。

  想要使用一个插件，只需要`require`它，然后把它添加到`plugins`配置项中。多数插件可以通过选项自定义。

## 配置

`webpack`的相关配置主要由根目录下的`webpack.config.js`来完成

```js
// webpack.config.js

module.exports = {
    mode: 'development',
    entry: ['']
    output: {},
    module: {
    	rules: [{}]
	},
    plugins: [{}],
    devServer: {},
    devtool: 'xxx'
}
```

## 处理JavaScript:babel-loader

`webpack`本身可以识别`JavaScript`，但为了兼容老的浏览器，需要将`ES6`转换为向后兼容版本的`JavaScript`代码，[Babel](https://babel.docschina.org/)就是这么一种工具链。

当`webpack`打包源代码时，可能会很难追踪到错误和警告在源代码中的起始位置。为了**更容易追踪错误和警告**，`JavaScript`提供了[source map](http://blog.teamtreehouse.com/introduction-source-maps)功能，将编译后的代码映射回原始代码。

```js
//webpack.config.js
module: {
    rules: [
        {
            test: /\.js?$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        }
    ],
    // 开启source-map
    devtool: 'cheap-module-eval-source-map'
}

//babel.config.js
module.exports = function (api) {
    api.cache(true)
    const presets = ["@babel/preset-env"]
    const plugins = [
        [
            "@babel/plugin-transform-runtime",
            {
                corejs: 3
            }
        ]
    ]

    return {
        presets,
        plugins
    }
}
```

## 处理HTML

有时为了清除缓存，打包文件时会带有hash，那么每次生成的文件名会有所不同。如果在`html`中引用了这些文件，则需要更改引入的文件名，手工改动不可取。我们可以使用`html-webpack-plugin`来帮助处理

```js
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            // template指定生成html的模板文件
            template: './public/index.html',
            // 默认生成在./dist/index.html
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false
            }
        })
    ]
}
```

## 处理*ss

- `style-loader`，动态创建`style`标签，将`css`插入到`head`中
- `css-loader`，负责处理`@import`等语句
- `postcss-loader`和`autoprefixer`，自动生成浏览器兼容性前缀
- `less-loader`，负责编译`.less`文件

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')({
                                        'overrideBrowserslist': [
                                            ">0.25%",
                                            'not dead'
                                        ]
                                    })
                                ]
                            }
                        }
                    },
                    'less-loader'
                ],
                exclude: /node_modules/
            }
        ]
    }
}
```

## 处理本地资源文件

可以使用url-loader或file-loader来处理本地的资源文件。url-loader和file-loader功能类似，但是url-loader可以指定文件在小于某一特定值下返回DataURL，可以减少http请求，推荐使用

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|jpeg|svg|ttf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            esModule: false,
                            name: 'assets/[name]_[hash:6].[ext]'
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    }
}
```

此外，对于html中的图片，url-loader则无能为力，此时需要`html-withimg-loader`来协助

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.html/,
                use: ['html-withimg-loader'],
                exclude: /node_modules/
            }
        ]
    }
}
```

