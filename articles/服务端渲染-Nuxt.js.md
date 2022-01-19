---
title: "服务端渲染-Nuxt.js"
tags: "SSR"
categories: "服务端渲染"
description: ""
createDate: "2020-07-28 11:15:28"
updateDate: "2020-10-16 15:18:28"
---


> Nuxt.js@2.13.6

# 安装

推荐使用官方脚手架

`yarn create nuxt-app <project name>`

# 使用

## 如何引入三方UI库/框架

[vant](https://youzan.github.io/vant/#/zh-CN/) 为例

1. `~/plugins/`下新建`vant-ui.js`

    ```js
    // ~/plugins/vant-ui.js
    
    import Vue from 'vue'
    import { xxx } from 'vant'
    
    // 只能全局注册组件，局部注册会丢失样式！！！
    Vue.use(xxx)
    ```

2. 安装`vant、less、less-loader`

    ```shell script
    yarn add vant -S
    yarn add less less-loader -D
    ```

3. 配置`nuxt.config.js`

    ```js
    // nuxt.config.js
    {
        // ...
        build: {
            // ...
            transpile: [/vant.*?less/],
            babel: {
              plugins: [
                ['import', {
                  libraryName: 'vant',
                  style: name => `${name}/style/less`
                }, 'vant']
              ]
            },
            loaders: {
              // 修改默认样式
              less: {
                javascriptEnabled: true,
                modifyVars: {
                  'button-primary-background-color': '#ff6008',
                  'button-primary-border-color': '#ff6008',
                  'nav-bar-text-color': '#ff6008',
                  'nav-bar-icon-color': '#ff6008',
                }
              }
            }
        },
        // ...
    }
    ```

## 如何配置axios拦截器

`~/plugins/`下新建`axios.js`

```js
// ~/plugins/axios.js
export default function ({ $axios }) {
  $axios.interceptors.request.use((config) => {
    // todo
    return config
  })
  $axios.interceptors.response.use(
    response => response.data,
    err => {
      console.log(err)
    }
  )
}
```

## 添加Node.js中间件（以日志中间件为例）

1. 根目录下新建`serverMiddleware`文件夹

2. 安装相关依赖`log4js`等

3. 新建`logger.js`

    ```js
    const { join } = require('path')
    const { configure, getLogger, connectLogger } = require('log4js')
    
    const LOG_PATH = '/opt/logs/gmm-node-h5ssrrelease/'
    configure({
      appenders: {
        ajaxError: {
          type: 'dateFile',
          pattern: 'yyyy-MM-dd.log',
          filename: join(LOG_PATH, 'ajaxError'),
          maxLogSize: 10 * 1000 * 1000,
          numBackups: 3,
          alwaysIncludePattern: true
        },
        // ...
      },
      categories: {
        default: { appenders: ['console'], level: 'info' },
        // ...
      }
    })
    
    export default connectLogger(getLogger('application'), { level: 'info' })
    ```

4. 修改`nuxt.config.js`配置

    ```js
    export default {
      // ...
      serverMiddleware: [
        '~/serverMiddleware/bodyParser',
        // ...
      ],
      // ...
    }
    ```

# 注意点

1. 服务端只渲染需要做SEO的部分来加快访问速度

# 性能优化

1. 如果网关已启用gzip则关闭框架自带压缩

    ```js
    // nuxt.config.js
    render: {
      compressor: false
    }
    ```

2. 缓存页面(`lru-cache`)

    ```js
    // serverMiddleware/pageCache.js
    const LRU = require('lru-cache')
    const cachePage = new LRU({
      max: 100,
      maxAge: 1000 * 60
    })
    export default function (req, res, next) {
      const url = req._parsedOriginalUrl
      const pathname = url.pathname
      if (['/selectGame/1'].includes(pathname)) {
        const existsHtml = cachePage.get('selectGameData')
        if (existsHtml) {
          return res.end(existsHtml.html, 'utf-8')
        } else {
          res.original_end = res.end
          res.end = function (data) {
            if (res.statusCode === 200) {
              cachePage.set('selectGameData', { html: data })
            }
            res.original_end(data, 'utf-8')
          }
        }
      }
      next()
    }
    ```
   
# 坑

## 同一域名如何部署多个Nuxt.js服务

在`https://gmmsj.com/h5ssr`下部署Nuxt.js项目步骤：

1. 复制`nuxt_dist/serverMiddleware/static/nuxt.config.js/package.json`目录/文件至部署机

2. nuxt.config.js添加router配置

    ```js
    // nuxt.config.js
    {
      // ...
      router: {
        base: '/h5ssr/'
      }
      // ...
    }
    ```

3. Nginx添加配置

    ```shell script
    # nginx.conf
    location /h5ssr {
      proxy_pass http://127.0.0.1:8005/h5ssr ;
      proxy_set_header Host $host;
      proxy_set_header X-Forwarded-For $remote_addr;  
    }
    ```
