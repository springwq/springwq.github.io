import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postPath(id: string): string {
  return `/blog/${id}/`;
}

export function tagSlug(tag: string): string {
  return /^[\u0000-\u007f]+$/.test(tag) ? tag.toLowerCase() : tag;
}

export function tagPath(tag: string): string {
  return `/blog/tag/${tagSlug(tag)}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export interface Term {
  label: string;
  href?: string;
}

export function postTerms(post: Post): Term[] {
  const tags = new Set(post.data.tags);
  const terms: Term[] = [];
  for (const category of post.data.categories) {
    terms.push({
      label: category,
      href: tags.has(category) ? tagPath(category) : undefined,
    });
  }
  for (const tag of post.data.tags) {
    if (!post.data.categories.includes(tag)) {
      terms.push({ label: tag, href: tagPath(tag) });
    }
  }
  return terms;
}

export function seriesNeighbors(post: Post, posts: Post[]): { prev: Post | null; next: Post | null } {
  if (!post.data.series) return { prev: null, next: null };
  const series = posts
    .filter((item) => item.data.series === post.data.series)
    .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
  const index = series.findIndex((item) => item.id === post.id);
  return {
    prev: series[index - 1] ?? null,
    next: series[index + 1] ?? null,
  };
}
