---
title: 搭建 DockerHub 镜像
date: 2024-06-24 22:58:52
tags: [Docker, DockerHub]
---


本文主要介绍，如何快速搭建一个 DockerHub 镜像。

<!--more-->

## 准备一个 VPS

需要一个可以正常创建 docker container 的 VPS

## 安装 registry-mirror

参照 [registry-mirror](https://github.com/bboysoulcn/registry-mirror) 进行安装


## 配置 Nginx 反向代理

- 准备一个域名，并在服务器上配置好反向代理
- 可以通过 Let's Encrpt 在服务器上启用 HTTPS
- 也可以通过 CloudFlare 配置 HTTPS

## 修改 docker config


```json
{
  "registry-mirrors" : [
    "https:\/\/abc.xyz"
  ]
}
```
