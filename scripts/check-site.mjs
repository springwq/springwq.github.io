import fs from 'node:fs';
import path from 'node:path';
import { redirects } from '../redirects.mjs';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const errors = [];

function fail(message) {
  errors.push(message);
}

function read(rel) {
  const file = path.join(dist, rel);
  if (!fs.existsSync(file)) {
    fail(`missing ${rel}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const home = read('index.html');
for (const text of [
  'Steven Wu',
  'AI 实战 / 独立开发 / 程序员用 AI 提效',
  '不出镜',
  'https://bestjapanbuy.com',
  '日本买明白',
  'https://github.com/springwq',
  'stevenwu.ai',
  'https://stevenwu.ai/',
  'https://stevenwu.ai/og.png',
  '为群晖 NAS Container Manager 配置注册表镜像',
  'href="/blog/"',
  'href="/projects/"',
  'href="/about/"',
]) {
  if (!home.includes(text)) fail(`home missing ${text}`);
}

const about = read('about/index.html');
for (const text of ['Ruby on Rails', '不出镜', 'AI 实战', 'BestJapanBuy']) {
  if (!about.includes(text)) fail(`about missing ${text}`);
}
if (about.includes('一名 Ruby on Rails 程序员')) fail('about still uses the old one-line bio');

const blog = read('blog/index.html');
const posts = [
  ['my-favorite-pry-featurs', 'Pry 实用命令'],
  ['ruby-metaprogramming-the-object-model', 'Ruby 元编程 - 对象模型'],
  ['ruby-metaprogramming-methods', 'Ruby 元编程 - Method'],
  ['ruby-metaprogramming-blocks', 'Ruby 元编程 - Blocks'],
  ['ruby-metaprogramming-class', 'Ruby 元编程 - 类定义'],
  ['ruby-metaprogramming-eval-and-hook', 'Ruby 元编程 - Eval and Hook'],
  ['为群晖-NAS-Container-Manager-配置注册表镜像', '为群晖 NAS Container Manager 配置注册表镜像'],
];

for (const [, title] of posts) {
  if (!blog.includes(title)) fail(`blog index missing ${title}`);
}

for (const [slug, title] of posts) {
  const html = read(path.join('blog', slug, 'index.html'));
  if (!html.includes(title)) fail(`post ${slug} missing title`);
  if (!html.includes('https://stevenwu.ai/blog/')) fail(`post ${slug} missing canonical host`);
}

const nas = read('blog/为群晖-NAS-Container-Manager-配置注册表镜像/index.html');
if (!nas.includes('/img/docker_registry/1.png')) fail('NAS post missing screenshot');

const blocks = read('blog/ruby-metaprogramming-blocks/index.html');
if (!blocks.includes('block_given')) fail('blocks post did not render code');

const rss = read('rss.xml');
if (!rss.includes('https://stevenwu.ai')) fail('rss missing site url');
if (!rss.includes('Pry 实用命令')) fail('rss missing a post');

const projects = read('projects/index.html');
if (!projects.includes('https://bestjapanbuy.com') || !projects.includes('https://github.com/springwq')) {
  fail('projects page missing links');
}

function redirectFile(source) {
  const rel = source.replace(/^\//, '');
  const candidates = [path.join(dist, rel, 'index.html'), path.join(dist, `${rel}.html`)];
  return candidates.find((file) => fs.existsSync(file));
}

for (const [source, destination] of redirects) {
  const file = redirectFile(source);
  if (!file) {
    fail(`redirect file missing for ${source}`);
    continue;
  }
  const html = decodeURIComponent(fs.readFileSync(file, 'utf8'));
  if (!html.includes(destination)) fail(`redirect ${source} does not point at ${destination}`);
}

const sitemapFiles = walk(dist).filter((file) => path.basename(file).startsWith('sitemap'));
if (sitemapFiles.length === 0) fail('sitemap missing');
const sitemap = sitemapFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
if (sitemap.includes('/2020/07/28/')) fail('sitemap still lists a legacy post URL');
if (!sitemap.includes('https://stevenwu.ai/blog/')) fail('sitemap missing blog urls');

const robots = read('robots.txt');
if (!robots.includes('https://stevenwu.ai/sitemap-index.xml')) fail('robots sitemap url');
if (!fs.existsSync(path.join(dist, 'sitemap-index.xml'))) fail('sitemap-index.xml missing');

const banned = [];
for (const file of walk(dist)) {
  if (!/\.(html|xml|txt|json)$/.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  if (text.toLowerCase().includes('stevenruby.com')) banned.push(path.relative(dist, file));
}
if (banned.length) fail(`stevenruby.com still present in ${banned.join(', ')}`);

const og = path.join(dist, 'og.png');
if (!fs.existsSync(og)) fail('og.png missing');
else {
  const magic = fs.readFileSync(og).subarray(0, 8).toString('hex');
  if (magic !== '89504e470d0a1a0a') fail('og.png is not a png');
}

const vercelPath = path.join(root, 'vercel.json');
const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
for (const [source, destination] of redirects) {
  const hit = vercel.redirects?.some((rule) => rule.source === source && rule.destination === destination);
  if (!hit) fail(`vercel.json missing ${source}`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`site check ok (${posts.length} posts, ${redirects.length} redirects)`);
