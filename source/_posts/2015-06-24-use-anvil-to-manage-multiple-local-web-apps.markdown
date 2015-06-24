---
layout: post
title: "使用 Anvil fo Mac 来管理本地 Web App"
date: 2015-06-24 20:56:24 +0800
comments: true
categories: [Web] 
---

当有多个 Rails App 需要运行时，由于 Rails 默认使用 3000 端口，需要手动指定每个 App 使用不同的端口，这样比较繁琐。Anvil 这个 Mac 顶栏工具可以非常方便的启动和管理需要运行的多个Web App。

Anvil 是基于 Pow 的， Pow 是由 Basecamp 创建和维护的。

## 安装

1. 首先需要安装 Pow, 参照官网的方案

```
$ curl get.pow.cx | sh
```

2. 下载安装 Anvil for Mac

直接从官网 http://anvilformac.com/ 下载后安装

## 使用

添加 Site, 指定 App 的目录所在位置即可

<img src="{{ root_url }}/images/Anvil-1.png" />
<img src="{{ root_url }}/images/Anvil-2.png" />

最后，就可以使用带 .dev 后缀的域名访问 App 了。