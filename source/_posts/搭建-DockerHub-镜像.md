---
title: 为群晖 NAS Container Manager 配置注册表镜像
date: 2024-06-24 22:58:52
categories: [NAS, Docker]
tags: [Docker, 群晖]
---


本文主要介绍，如何快速搭建一个 DockerHub 镜像。

<!--more-->

## 准备一个 VPS

首先需要一个可以正常拉取 docker image 的 VPS

## 安装 registry-mirror

参照 [registry-mirror](https://github.com/bboysoulcn/registry-mirror) 进行安装


## 配置 Nginx 反向代理, 域名

- 准备一个域名，并在服务器上配置好 Nginx 反向代理
- 启用 HTTPS
  - 可以通过 Let's Encrpt 在服务器上启用 HTTPS
  - 也可以通过 CloudFlare 配置 HTTPS

## 在群晖 NAS 上添加 Docker 镜像映射

- 打开 Container Manager, 进入设置

![](img/docker_registry/1.png)

- 选中 Docker Hub(v1)，然后点击编辑

![](img/docker_registry/2.png)

- 注册表镜像 URL 中填入镜像地址

![](img/docker_registry/3.png)

- 最后，点击应用按钮
