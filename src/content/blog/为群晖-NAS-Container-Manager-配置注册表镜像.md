---
title: "为群晖 NAS Container Manager 配置注册表镜像"
description: "本文主要介绍，如何快速搭建一个 DockerHub 镜像。"
pubDate: 2024-06-24T22:58:52+08:00
tags:
  - "Docker"
  - "群晖"
categories:
  - "NAS"
  - "Docker"
---
本文主要介绍，如何快速搭建一个 DockerHub 镜像。


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

<img src="/img/docker_registry/1.png" alt="群晖 Container Manager 的设置页" width="1600" height="800" loading="lazy" decoding="async">

- 选中 Docker Hub(v1)，然后点击编辑

<img src="/img/docker_registry/2.png" alt="编辑 Docker Hub 注册表" width="1004" height="1002" loading="lazy" decoding="async">

- 注册表镜像 URL 中填入镜像地址

<img src="/img/docker_registry/3.png" alt="填写注册表镜像 URL" width="1008" height="938" loading="lazy" decoding="async">

- 最后，点击应用按钮
