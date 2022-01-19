---
title: "Docker-基于Travis、Github搭建CI&CD自动化部署之自动构建"
tags: "Docker实战 自动构建"
categories: "Docker"
description: ""
createDate: "2020-08-10 22:32:00"
updateDate: "2020-10-16 15:07:18"
---


> CentOS@7.5

# 流程

1. `git push`到仓库
2. CI检测到GitHub代码有更新，自动打包出一个docker镜像更新至docker hub
3. CI编译完成后登录服务器，删掉原有容器，拉取新镜像并创建一个新容器

# 初始化项目

1. 创建仓库
2. 创建[Travis](https://www.travis-ci.org)账号并关联仓库
3. 到[docker hub](https://hub.docker.com)注册账号并创建镜像仓库
4. Travis个人中心添加环境变量`DOCKER_USERNAME`和`DOCKER_PASSWORD`方便更新镜像
![添加环境变量](https://user-gold-cdn.xitu.io/2019/9/20/16d4c9d76dc4f557?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
5. 在项目根目录创建`.travis.yml`
```yaml
language: node_js
node_js:
  - "12"
services:
  - docker

before_install:
  - npm install

script:
  - npm run build
  - echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
  - docker build -t mrrs878/blog:latest .
  - docker push mrrs878/blog:latest
```
6. 在项目根目录创建`nginx.conf`
```shell script
server {
        listen       80;
        server_name  localhost;

        location / {
            try_files $uri $uri/ /index.html;
            root /usr/share/nginx/html;
            index  index.html index.htm;
        }
}
```
7. 在项目根目录创建`Dockerfile`
```shell script
FROM nginx

COPY ./build/ /usr/share/nginx/html/

RUN rm /etc/nginx/conf.d/default.conf

ADD nginx.conf /etc/nginx/conf.d/

EXPOSE 80
```
8. 在项目根目录创建`.dockerignore`加快打包速度
```shell script
/.idea
/node_modules
/.pnp
.pnp.js

/coverage

.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

# 编写代码push到仓库，Travis自动编译，等待编译完成

# 到[docker hub](https://hub.docker.com)查看镜像状态

# 服务器配置

1. `nginx`添加反向代理

```shell script
server {
        listen       80;
        server_name  blog.p18c.top;

        location / {
                proxy_pass   http://127.0.0.1:8081;
        }
}
```

2. 更新镜像并创建容器

```shell script
docker pull mrrs878/blog:latest
docker container stop blog
docker container rm blog
docker container create --name blog -p 8081:80 mrrs878/blog:latest
docker container start blog
```

# Ref
[写给前端的Docker实战教程](https://juejin.im/post/6844903946234904583)
