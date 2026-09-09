// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Custom domain, also pinned in public/CNAME so Pages keeps it across deploys.
  // Used for canonical URLs.
  site: 'https://www.mabille.me',
});
