---
title: "网络相关-https"
tags: "网络 https"
categories: "网络"
description: ""
createDate: "2020-04-15 22:38:54"
updateDate: "10/1/2021, 3:34:43 AM"
---


# HTTPS是什么

HTTPS（hyper text transfer protocol over secure socket layer），是以安全为目标的HTTP通道，简单说就是HTTP的安全版。即HTTP下加入SSL层，HTTPS的安全基础是SSL，因此加密的详细内容就需要SSL。

## HTTPS和HTTP的区别

- HTTP是明文传输，HTTPS通过SSL/TLS进行了加密
- HTTP的端口是80，HTTPS的端口是443
- HTTPS需要CA证书

# 为什么要有HTTPS

- 建立一个信息安全通道，来保证数据传输的安全
- 确认网站的真实性，防止钓鱼网站

# HTTPS的原理

整体上HTTP到HTTPS的历程是：
HTTP --> 对称加密 --> 非对称加密 --> 对称加密+非对称加密 --> 中间人攻击 --> CA证书

## 对称加密

HTTP的通信是明文的，就相当于在网络上裸奔，任何组织或个人都可以监听、窥探数据包。安全行较差，此时对称加密出现了：每次传输之前，发送方用一个加密算法加密，然后再发送；接收方使用加密算法对应的密钥进行解密。因为加密/解密都用的同一个密钥，因此称之为对称加密

![对称加密](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/https-0.png)

### 弊端

**密钥容易被截取**

## 非对称加密

使用非对称加密的双方都有一对密钥：私钥（保密），公钥（公开）。使用私钥加密的数据只有对应的公钥才能解密；用公钥加密的数据只有对应的私钥才能解密。

![非对称加密](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/https-1.png)

### 弊端

**速度较慢**，相较于对称加密算法，非对称加密算法的速度要慢上百倍

## 对称加密+非对称加密

使用非对称加密传输对称加密的密钥，之后使用对称加密通信

### 弊端

不能确保接收人的身份，容易受到中间人攻击

## 中间人攻击

在浏览器发送公钥的时候，有个中间人截取了浏览器的公钥，然后把自己的公钥发送给服务器来冒充浏览器，然后使用自己的私钥解密对称加密使用的公钥来进行通信。（类似于代理）

![中间人攻击](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/https-2.png)

## CA证书

![CA证书](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/https-3.png)

👀：这些ＣＡ本身也有证书来证明自己的身份，并且ＣＡ的信用是像树一样分级的，高层的ＣＡ给底层的ＣＡ做信用背书，而操作系统／浏览器中会内置一些顶层的ＣＡ的证书，相当于你自动信任了他们。　这些顶层的ＣＡ证书一定得安全地放入操作系统／浏览器当中，否则世界大乱。

# 完整HTTPS流程

![https完整流程图](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/https-4.png)