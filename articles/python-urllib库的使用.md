---
title: "python-urllib库的使用"
tags: "python urllib"
categories: "Python"
description: ""
createDate: "2018-11-13 12:14:43"
updateDate: "2021-02-20 17:21:39"
---

# Python urllib库的介绍及使用

@(python)[urllib]

**urllib**库，是 Python 内置的 HTTP 请求库 ，也就是说不需要额外安装即可使用。它包含如下 4 个模块：
- **request** ：最基本的 HTTP 请求模块，可以用来模拟发送请求 。 就像在浏览器里输入网址然后回车一样，只需要给库方法传入 URL 以及额外的参数，就可以模拟实现这个过程；
- **error** ：异常处理模块，如果出现请求错误 ， 我们可以捕获这些异常，然后进行重试或其他操作以保证程序不会意外终止；
- **parse** ：一个工具模块，提供了许多 URL 处理方法，比如拆分、解析 、 合并等。
- **robotparse**：主要是用来识别网站的 robots.txt 文件，然后判断哪些网站可以爬，哪些网站不可以爬，它其实用得比较少；

接下来主要介绍前三个模块：**request**/**error**/**parse**

