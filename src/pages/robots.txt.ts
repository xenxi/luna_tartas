import type { APIRoute } from 'astro';
import { createRobotsTxt } from '../lib/seo/crawl';

export const GET: APIRoute = () =>
  new Response(createRobotsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
