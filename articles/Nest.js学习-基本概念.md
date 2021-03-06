---
title: "Nest.js学习-基本概念"
tags: "Nest.js"
categories: "Nest.js"
description: ""
createDate: "2020-09-22 22:35:38"
updateDate: "2020-10-16 17:22:32"
---


# 核心架构

## 模块

模块是按业务逻辑化分基本单元，包含控制器和服务。控制器是处理请求和响应数据的条件，服务是处理实际业务逻辑的部件

## 中间件

中间件是路由处理handler前的数据处理层，只能在模块或者全局注册，可以做**日志处理中间件**；中间件可以访问整个`request`、`response`的上下文，模块作用域可以依赖注入服务。全局注册只能是一个纯函数或者一个高阶函数

## 管道

管道是数据流处理，在中间件后路由处理前做数据处理，可以在控制器中的类、方法、方法参数及全局注册使用，只能是一个纯函数。可以做**数据验证，数据转换**

## 守卫

守卫决定请求是否可以到达对应的路由处理器，能够知道当前路由的执行上下文，可以在控制器中的类、方法及全局注册使用。可以做`RABC`

## 异常过滤器

内置的异常层负责处理整个应用程序中所有抛出的异常。当捕获到未处理的异常时，最终用户将收到友好的响应。可以做**异常处理**

## 拦截器

拦截器是进入控制器之前和之后处理相关逻辑，能够知道当前路由的执行上下文，可以控制器中的类、方法、全局注册使用。可以做**接口响应记录**

# 模块划分

AppModule应用根模块

- CoreModule 核心模块（注册中间件、过滤器、管道、守卫、拦截器、装饰器等）
- SharedModule 共享模块（注册服务，如DB、redis等）
- ConfigureModule 配置模块（系统配置）
- FeatureModule 特性模块（业务模块）

