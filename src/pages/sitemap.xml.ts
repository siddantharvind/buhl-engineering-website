import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const DOMAIN = 'https://buhlengineering.in';

const pages = [
  { url: '', priority: '1.0', changefreq: 'weekly' },
  { url: 'careers', priority: '0.9', changefreq: 'weekly' },
  { url: 'privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { url: 'terms-of-service', priority: '0.5', changefreq: 'yearly' },
];

// Read jobs from jobs.json to include job detail pages
let jobSlugs: string[] = [];
try {
  const jobsPath = resolve('./src/data/jobs.json');
  const jobsData = JSON.parse(readFileSync(jobsPath, 'utf-8'));
  jobSlugs = jobsData.map((job: any) => job.id);
} catch (e) {
  console.error('Could not read jobs.json');
}

const jobPages = jobSlugs.map((slug) => ({
  url: `jobs/${slug}`,
  priority: '0.8',
  changefreq: 'daily',
}));

const allPages = [...pages, ...jobPages];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => `  <url>
    <loc>${DOMAIN}${page.url ? '/' + page.url : ''}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;

export const GET: APIRoute = async () => {
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
