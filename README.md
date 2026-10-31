# stevenwu.ai

Steven Wu 的个人站点。用 Astro 生成的静态页：首页是一张名片，另外有项目、关于，和 Markdown / MDX 博客。

线上地址是 [https://stevenwu.ai](https://stevenwu.ai)。站点标题、canonical 和 Open Graph 都用这个域名。

## 本地预览

需要 Node.js 22。

```shell
npm install
npm run dev
```

打开 http://localhost:4321 。

```shell
npm run build
npm run preview
```

`npm run build` 会生成 `dist/`，并检查旧文章是否还在、页面里是否还出现过时域名。

## 部署

静态产物在 `dist/`。Hexo 已经去掉，仓库里只有这一套构建。

### Vercel

当前线上走 Vercel / Cloudflare 时：

1. 导入这个仓库。
2. Framework 选 Astro。Build Command 用 `npm run build`，Output Directory 用 `dist`。
3. 把域名 `stevenwu.ai` 指到该项目。

`vercel.json` 把 Hexo 时期的文章地址 301 到新地址，并带上末尾斜杠。

### GitHub Pages

推到 `main` 会跑 `.github/workflows/page.yml`：用 Node 22 执行 `npm run build`，把 `dist/` 发布到 GitHub Pages。

仓库里不再放 `CNAME`。以前的 `CNAME` 写的是已经不用的旧域名。如果改由 GitHub Pages 托管 `stevenwu.ai`，再在 `public/CNAME` 写入：

```text
stevenwu.ai
```

并把 DNS 指到 GitHub Pages。两条托管不要同时认领这个域名。

## 写文章

在 `src/content/blog/` 加一篇 Markdown 或 MDX：

```md
---
title: 标题
description: 列表和摘要里用的一段话
pubDate: 2026-10-31
tags: []
---
```

文件名会变成 `/blog/文件名/`。想隐藏草稿时加上 `draft: true`。可选字段还有 `categories` 和 `series`。

## 地址

| 页面 | 路径 |
| --- | --- |
| 首页 | `/` |
| 文章 | `/blog/` |
| 标签 | `/blog/tag/` |
| 项目 | `/projects/` |
| 关于 | `/about/` |
| RSS | `/rss.xml` |

Hexo 的永久链接是 `/年/月/日/文件名/`。文章正文换到 `/blog/文件名/`，旧地址会跳过来。文件名保持原样，包括中文 slug，以及 Pry 那篇里原来的 `featurs` 拼写。

`/archives` 和 `/categories` 进 `/blog/`。`/tags` 进 `/blog/tag/`。`/atom.xml` 进 `/rss.xml`。

群晖那篇文章的旧分类 `/categories/NAS/`、`/categories/Docker/` 会跳到文章本身。
