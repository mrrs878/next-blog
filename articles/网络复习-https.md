---
title: "网络复习-https"
tags: "https"
categories: "2021复习"
description: ""
createDate: "2021-05-24 06:39:38"
updateDate: "2021-05-24 15:29:28"
---


> HTTPS （安全的HTTP）是 HTTP 协议的加密版本。它通常使用 SSL 者 TLS 来加密客户端和服务器之间所有的通信 。这安全的链接允许客户端与服务器安全地交换敏感的数据，例如网上银行或者在线商城等涉及金钱的操作。

![https](http://mrrsblog.oss-cn-shanghai.aliyuncs.com/https-5.png)

## https和http的区别

- http是明文传输，https使用ssl/tsl加密传输
- http的端口是80，https的端口是443
- https需要ca证书

## 为什么需要https

**安全**

## https的原理

简单来讲https的发展过程是：http -> 对称加密 -> 非对称加密 -> 混合加密 -> CA证书

## 对称加密

http的通信是明文的，相当于在网络上裸奔，任何人或组织都可以监听、窥探数据，安全性较差，此时对称加密出现了：每次传输之前，发送方用一个加密算法加密，然后再发送；接收方使用加密算法对应的密钥进行解密。因为加密/解密使用的是同一个密钥，因此称为对称加密

![对称加密](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/https-0.png)

弊端：**密钥容易被截取**

## 非对称加密

使用非对称加密的双方都有一对密钥：私钥（保密）、公钥（公开）。使用公钥加密的数据只有对应的私钥才能解密；

![非对称加密](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/https-1.png)

弊端：**速度较慢，相较于对称加密算法，非对称加密算法的速度要慢上百倍**

## 混合加密（非对称加密+对称加密）

使用非对称密钥加密对称密钥的密钥，然后使用对称加密通信

弊端：还是不能确保接收人的身份，容易受到**中间人攻击**

![中间人攻击](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/https-2.png)

## CA证书

解决中间人攻击。相当于一个公证处，所有服务器均需要在机构注册备案，然后机构会派发一个CA证书来表示该服务器是安全的

![https传输流程](https://mrrsblog.oss-cn-shanghai.aliyuncs.com/https-4.png)

在第三步浏览器校验证书时：浏览器会根据自身保存的CA公钥来验证服务器的身份

![ca证书验证流程](http://mrrsblog.oss-cn-shanghai.aliyuncs.com/https-ca.png)