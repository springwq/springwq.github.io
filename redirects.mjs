/**
 * Old Hexo permalinks were /:year/:month/:day/:title/.
 * Title came from the filename, including the Chinese NAS slug and the
 * historical "featurs" typo. New posts live at /blog/<filename>/.
 *
 * Keys have no trailing slash. Destinations always have one, except files.
 * @type {Array<[string, string]>}
 */
export const redirects = [
  ['/2020/07/28/my-favorite-pry-featurs', '/blog/my-favorite-pry-featurs/'],
  ['/2020/11/19/ruby-metaprogramming-the-object-model', '/blog/ruby-metaprogramming-the-object-model/'],
  ['/2020/11/19/ruby-metaprogramming-methods', '/blog/ruby-metaprogramming-methods/'],
  ['/2020/11/20/ruby-metaprogramming-blocks', '/blog/ruby-metaprogramming-blocks/'],
  ['/2020/12/07/ruby-metaprogramming-class', '/blog/ruby-metaprogramming-class/'],
  ['/2020/12/09/ruby-metaprogramming-eval-and-hook', '/blog/ruby-metaprogramming-eval-and-hook/'],
  [
    '/2024/06/24/为群晖-NAS-Container-Manager-配置注册表镜像',
    '/blog/为群晖-NAS-Container-Manager-配置注册表镜像/',
  ],

  ['/archives', '/blog/'],
  ['/archives/2020', '/blog/'],
  ['/archives/2020/07', '/blog/'],
  ['/archives/2020/11', '/blog/'],
  ['/archives/2020/12', '/blog/'],
  ['/archives/2024', '/blog/'],
  ['/archives/2024/06', '/blog/'],

  ['/tags', '/blog/tag/'],
  ['/tags/Ruby', '/blog/tag/ruby/'],
  ['/tags/ruby', '/blog/tag/ruby/'],
  ['/tags/Metaprogramming', '/blog/tag/metaprogramming/'],
  ['/tags/metaprogramming', '/blog/tag/metaprogramming/'],
  ['/tags/Class', '/blog/tag/class/'],
  ['/tags/class', '/blog/tag/class/'],
  ['/tags/Pry', '/blog/tag/pry/'],
  ['/tags/pry', '/blog/tag/pry/'],
  ['/tags/Docker', '/blog/tag/docker/'],
  ['/tags/docker', '/blog/tag/docker/'],
  ['/tags/群晖', '/blog/tag/群晖/'],

  ['/categories', '/blog/'],
  ['/categories/uncategorized', '/blog/'],
  ['/categories/NAS', '/blog/为群晖-NAS-Container-Manager-配置注册表镜像/'],
  ['/categories/Docker', '/blog/为群晖-NAS-Container-Manager-配置注册表镜像/'],

  ['/atom.xml', '/rss.xml'],
  ['/feed.xml', '/rss.xml'],
  ['/index.xml', '/rss.xml'],
];
