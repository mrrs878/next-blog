---
title: "webpack学习-2"
tags: "webpack优化"
categories: "webpack"
description: ""
createDate: "2020-04-14 23:04:37"
updateDate: "2021-01-19 09:48:05"
---


# 优化

## 提取公共的js文件-splitChunks.cacheGroups.commons

```js
const path = require("path")

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filname: "bundle.[hash:6].js"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 2,
                    name: "common.[hash:6]"
                }
            }
        }
    }
}
```

## 压缩图片-image-webpack-loader

[url-loader](https://www.webpackjs.com/loaders/url-loader/)来处理图片文件解析，可以再使用 [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)来压缩图片

```js
const path = require("path")

module.exports = {
    enter: "./src/app.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.[hash:6].js"
    },
    modules: {
        rules: [
            {
                test: /\.*\.(gif|png|jpe?g|svg|webp)$/i,
                use: [
                    {
                        laoder: "url-loader",
                        options: {
                            limit: 8192
                        }
                    }
                    {
                        laoder: "image-webpack-loader",
                        options: {
                            mozjpeg: {
                                progress: true,
                                quality: 65
                            },
                            optipng: {
                                enable: false
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            webp: { // 开启webp会把jpg、png压缩为webp格式
                                quality: 65
                            }
                        }
                    }
                ]
            }
        ]
    }
}
```

## 多线程打包-happypack

在webpack运行在node中打包时是单线程去一件一件事情做，[happypack](https://github.com/amireh/happypack#readme)可以开启多个子进程去并发执行，子进程处理完成之后把结果交给主进程

```js
yarn add happypack -D

const path = require("path")
const HappyPack = reruire("happypack")

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.reaolve(__dirname, "dist"),
        filename: "bundle_[hash:6].js"
    },
    module: {
        rules: [
            {
                text: /\.jsx?$/,
                exclude: /node_modules/,
                use: "happypack/loader?id=babel"
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: "babel",
            threads: 4,
            loaders: ["babel-loader"]
        })
    ]
}
```

## 作用域提升-ModuleConcatenationPlugin

如果项目里使用的是ES6的语法，并且webpack3+，那么建议启用这一插件，把所有的模块放到一个函数里：

- 减少了函数声明
- 文件体积变小
- 函数作用域变少

```js
const path = require("path")
const webpack = require("webpack")

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle_[hash:6].js"
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
}
```

## 提取第三方库-enter.vendor

方便长期缓存第三方的库，新建一个入口，将第三方库作为一个`chunk`，生成`vendor.js`

```js
const path = require("path")

module.exports = {
    entry: {
        main: "./src/app.js",
        vendor: ['react', 'react-dom']
    }
}
```

## DLL动态链接-webpack.DllPlugin

如果第三方库不是经常更新，打包的时候希望分开打包来提升打包速度。打包dll需要新建一个webpack配置文件，在打包dll的时候，webpack做一个索引，现在manifest文件中。然后打包项目的时候只需要读取manifest文件

```js
// webpack.vendor.js

const webpack = require("webpack")
const path = require("path")

module.exports = {
    entry: {
        vendor: ["react", "react-dom"]
    },
    output: {
        path: path.reaolve(__dirname, "dist"),
        filename: "dll/[name]_dll.js",
        library: "_dll_[name]"
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, "dist/sll", "manifest.json"),
            name: "_dll_[name]"
        })
    ]
}
```

```js
// webpack.config.js

const path = resolve("path")

module.exports = {
    enter: {
        main: "./src/app.js",
        vendor: ["react", "react-dom"]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, "dist/dll", "manifest.json")
        })
    ]
}
```

# 多环境配置

创建多个配置文件：

- `webpack.base.js`，共同的个配置
- `webpack.dev.js`，在开发环境下的配置
- `webpack.prod.js`，在生产环境下的配置

## 开发环境

配置测试服务器相关、HMR

```js
// webpack.dev.js

const path = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const abse = require("./webpack.base.js")

const dev = {
    devServer: {
        contentNase: path.resolve(__dirname, "dist"),
        port: 8080,
        host: "localhost",
        overlay: true,
        compress: true,
        open: false,
        hot: true,
        inline: true,
        progress: true
    },
    devtool: "inline-source-map",
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
}

module.exports = merge(base, dev)
```

## 生产环境

生产环境最重要的是开启代码压缩、混淆

```js
//webpack.prod.js

const path = require("path")
const merge = require("webpack-merge")
const WebpackParallUglifyPlugin = require("webpack-parallel-uglify-plugin")
const base = require("./webpack.base.js")

const prod = {
    plugins: [
        new WebpackParallUglifyPlugin({
            uglifyJS: {
                mangle: true,
                output: {
                    beautify: false,
                    comments: false
                },
                compress: {
                    warnings: false,
                    drop_console: true,
                    collpase_vars: true,
                    reduce_vars: true
                }
            }
        })
    ]
}

module.exports = marge(base, prod)
```

# 使用环境变量

- 安装依赖: `yarn add dotenv-cli -D`

- `webpack.config.js`添加配置：

``` js
const { DefinePlugin } = require('webpack');
const { MODE } = process.env;

plugins: [
  	new DefinePlugin({
    	'process.env': {
        	MODE: JSON.strinfy(MODE)
        }
    })
]
```

- 根目录创建`.env.development`

``` shell
MODE='development'
```

- 修改`package.json`

``` json
"scripts": {
	"start:dev": "dotenv -e .env.development webpack-dev-server"
}
```