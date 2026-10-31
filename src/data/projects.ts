export interface Project {
  title: string;
  href?: string;
  note?: string;
  summary: string;
}

export const projects: Project[] = [
  {
    title: 'BestJapanBuy',
    href: 'https://bestjapanbuy.com',
    note: '日本买明白',
    summary: '来日本买什么、带回去能不能用、退税后多少钱。',
  },
  {
    title: 'GitHub',
    href: 'https://github.com/springwq',
    note: 'springwq',
    summary: '公开代码仓库。',
  },
  {
    title: 'stevenwu.ai',
    summary: '这个个人站点的域名。',
  },
];
