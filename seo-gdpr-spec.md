# Spec: SEO & GDPR Baseline Audit — mabille.me

**Repo:** github.com/menfir/menfir.github.io
**Host:** GitHub Pages, custom domain www.mabille.me
**Context:** Personal portfolio site listing tools built, with write-ups on why/how they were made and what was learned. No login, no e-commerce. Goal: maximize discoverability without triggering cookie-banner/GDPR-consent requirements.

## Objective

1. Audit the current repo for anything that would legally require a cookie banner or consent flow, and remove/replace it if found.
2. Implement baseline technical SEO that's currently missing.
3. Produce a short report of findings and changes made.

Re-run this same checklist whenever a new feature/page type is added to the site (this is a standing requirement, not one-time).

## Part 1 — GDPR/Cookie Audit (do this first)

Scan the repo and rendered output for:

- [ ] Any `document.cookie` writes, or cookie-setting via JS libraries
- [ ] Third-party analytics scripts (Google Analytics/GA4, Google Tag Manager, Meta Pixel, LinkedIn Insight, Hotjar, etc.)
- [ ] Embedded third-party content that sets cookies or calls out to third-party servers: YouTube embeds (should use `youtube-nocookie.com` if present), Google Maps embeds, social media widgets/share buttons, Google Fonts loaded from `fonts.googleapis.com`/`fonts.gstatic.com` (should be self-hosted instead)
- [ ] Any forms (contact, newsletter) and where their data goes — identify if a third party (Formspree, Mailchimp, etc.) receives it
- [ ] Any comment systems (Disqus, utterances/giscus using GitHub — note utterances/giscus use GitHub OAuth and issues, flag for review)
- [ ] Confirm GitHub Pages' own default behavior isn't injecting anything — it shouldn't, but verify no leftover Jekyll theme scripts if a Jekyll theme is in use

**Output:** list every finding with file path and line number. For each, propose: remove / self-host / replace with cookieless alternative / requires disclosure only (no banner).

**Do not add a cookie consent banner as the default fix.** The goal is to remove the need for one. Only flag "banner needed" if something is genuinely unavoidable (e.g., a required third-party payment or auth flow — unlikely on this site).

## Part 2 — Baseline SEO Implementation

Check for presence/correctness of each; implement if missing.

### Site-wide
- [ ] `robots.txt` at root, allowing crawl of all public content, referencing the sitemap
- [ ] `sitemap.xml` generated (auto-generate via build step if using a static site generator; hand-maintain if plain HTML) and submitted-ready
- [ ] `CNAME` file present and correct for www.mabille.me
- [ ] "Enforce HTTPS" confirmed enabled in GitHub Pages settings (can't be done from repo — flag for manual check)
- [ ] Canonical `<link rel="canonical">` tag on every page, pointing to the www version (avoid apex/www duplicate indexing)
- [ ] Consistent, valid HTML5 semantic structure (`<main>`, `<article>`, `<nav>`, one `<h1>` per page, logical heading hierarchy)
- [ ] `lang` attribute set on `<html>`

### Per-page (each tool/project write-up)
- [ ] Unique, descriptive `<title>` per page (not repeated across pages)
- [ ] Unique `<meta name="description">` per page (~150–160 chars)
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`) for social sharing previews
- [ ] Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- [ ] `schema.org` structured data — `CreativeWork` or `Article` type (`name`, `description`, `datePublished`, `author`) as JSON-LD
- [ ] All images have descriptive `alt` text
- [ ] Internal links between related project pages (e.g., cross-link M365/Power Automate projects to each other)

### Performance (affects Core Web Vitals → SEO)
- [ ] Images compressed/appropriately sized, using modern formats (WebP/AVIF) where practical
- [ ] No render-blocking third-party scripts
- [ ] Fonts self-hosted or using `font-display: swap`
- [ ] No layout-shift-inducing elements (this should already be satisfied by having no cookie banner)

## Part 3 — Deliverable

Produce a short markdown report:
1. GDPR audit findings + what was changed/removed
2. SEO items that were already present vs. newly added
3. Any manual steps the site owner still needs to do outside the repo (e.g., GitHub Pages settings, DNS, submitting sitemap to Google Search Console)
4. A note confirming: no cookie banner is required based on current implementation

## Notes for future features

Before merging any new feature to this site, re-check Part 1 against the diff. If the feature adds a form, embed, or third-party script, treat it as a new audit trigger.
