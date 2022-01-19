---
title: "Docker-基于Travis、Github搭建CI&CD自动化部署之自动部署"
tags: "Docker实战 自动部署"
categories: "Docker"
description: ""
createDate: "2020-08-11 10:32:00"
updateDate: "2020-10-16 15:07:00"
---


> CentOS@7.5

# 创建travis用户，配置免密登录

```shell script
useradd travis

passwd travis

vim /etc/sudoers
# 找到#Allow root to run any commands anywhere这一段注释，在下面新增一行：
travis  ALL=(ALL)   ALL

su travis

cd ~

ssh-keygen -t rsa
# passphase一定要为空

chmod 700 ~/.ssh/
chmod 600 ~/.ssh/*

cd .ssh/
cat id_rsa.pub >> authorized_keys
cat authorized_keys
```

# 安装Ruby

```shell script
yum install gcc-c++ patch readline readline-devel zlib zlib-devel \
   libyaml-devel libffi-devel openssl-devel make \
   bzip2 autoconf automake libtool bison iconv-devel sqlite-devel

curl -sSL https://rvm.io/mpapis.asc | gpg --import -
curl -L get.rvm.io | bash -s stable

source /etc/profile.d/rvm.sh
rvm reload

rvm install 2.4.4

rvm use 2.4.2 --default
```

## 安装Travis

```shell script
gem install travis
```

## 添加加密的私钥至代码仓库

**切换至travis用户，在~目录下拉取代码**

```shell script
su travis

travis login

travis encrypt-file ~/.ssh/id_rsa --add
```

此时`.travis.yml`会添加配置项

```yaml
before_install:

- openssl aes-256-cbc -K $encrypted_f91baf41390f_key -iv $encrypted_f91baf41390f_iv

  -in id_ras_deploy.enc -out ~/.ssh/id_ras_deploy -d
```

**注意~/.ssh有可能为~\/.ssh需要去掉\\**

解释下解密命令中`-in`和`-out`参数:

- in 参数指定待解密的文件，位于仓库的根目录(Travis执行任务时会先把代码拉到Travis自己的服务器上，并进入仓库更目录)
- out 参数指定解密后的密钥存放在**Travis服务器**的~/.ssh/id_rsa

## 配置after_success钩子

项目根目录下创建`update.sh`

```shell script
#!/bin/bash

echo "pulling image..."
docker pull mrrs878/blog:latest

echo "stopping old app"
docker container stop blog

echo "remove old container"
docker container rm blog

echo "crete new container"
docker container create --name blog -p 8081:80 mrrs878/blog:latest

echo "starting new app"
docker container start blog

echo "awesome, you succeeded!"
```

`.travis.yml`添加`after_success`配置项

```yaml
after_success:
  - chmod 600 ~/.ssh/id_rsa
  - ssh travis@服务器ip -o StrictHostKeyChecking=no 'cd ~/blog && sh ./update.sh'
```

## 已存项目迁移

1. docker hub新建仓库
2. 复制`.dockerignore/.travis.yml/Dockerfile/nginx.conf/update.sh`到项目根目录
3. 修改`.travis.yml`相关配置（项目名称）
4. 修改`update.sh`相关配置（项目目录）
5. 提交代码
6. 登录服务器，切换至Travis账户
7. 切换至`~`目录拉取项目代码
8. 使用`travis encrypt-file ~/.ssh/id_rsa --add`生成密钥。**注意~/.ssh有可能为~\/.ssh需要去掉\\**
9. 前往Travis控制台开启监控
10. 手动触发第一次构建

# Ref

[centos7 安装rvm及ruby](https://blog.csdn.net/zzzcl112/article/details/80531792)

[手摸手教你搭建 Travis CI 持续集成和自动化部署](https://segmentfault.com/a/1190000018687703)

[Travis-CI自动化测试并部署至自己的CentOS服务器](https://blog.csdn.net/weixin_34088838/article/details/91367043)
