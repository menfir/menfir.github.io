# Personal Site — Repo Spec

## Purpose
Personal site documenting small, practical tools built with AI assistance, and the thinking behind them. Not a portfolio/resume site, not aimed at professional visibility. Content-led, tools as a secondary discoverable feature.

## Thesis / homepage copy
Display prominently near the top of the homepage:

> Most useful ideas die at "not worth the effort." A vocabulary drill for my kid, a score card generator for a boulder competition, a tool to review my own Magic games — none of these justified a weekend of work before. AI changed that math. This is where I write about the small, specific problems I've solved because building the fix finally got cheap enough to be worth it — and share the tools themselves, in case one of them saves you the same evening.

## Tech stack
- **Framework:** Astro (static output, no SSR needed)
- **Hosting:** GitHub Pages, custom domain via CNAME (Namecheap domain, DNS pointed at GitHub Pages)
- **Deploy:** GitHub Actions — build on push to `main`, deploy to `gh-pages` / Pages environment
- **Comments:** Giscus (GitHub Discussions–backed) — optional, can be added later, not required for v1
- **Styling:** plain CSS or a lightweight utility approach (Tailwind acceptable) — editorial, indie-hacker aesthetic, not a component-library look. Comfortable reading width for article body (~65–75ch).
- No backend, no database, no auth. Any tool needing real logic runs client-side or links out to its own standalone page/repo.

## Content model

### 1. Articles collection
Astro content collection at `src/content/articles/`, Markdown/MDX files.

Frontmatter schema:
```yaml
title: string
description: string       # short summary, used for previews/meta
pubDate: date
tags: string[]             # optional, e.g. [ai, education, automation]
draft: boolean             # default false
```

Behavior:
- Rendered with readable typography, code-block syntax highlighting.
- Listed chronologically (newest first) on `/articles`.
- Each article gets its own page at `/articles/[slug]`.

### 2. Tools collection
Astro content collection at `src/content/tools/`, separate from articles — **not** tied 1:1 to any article.

Frontmatter schema:
```yaml
name: string
description: string        # one-line description for sidebar card
link: string                # URL to live demo, repo, or dedicated /tools/[slug] page
embed: boolean               # if true, allow lightweight iframe embed on its own page
repoUrl: string (optional)   # link to source code, shown alongside live link
```

Behavior:
- Rendered independently as small cards in a persistent sidebar (name, one-line description, link) — sidebar is populated from this collection, shown on all pages (or at minimum homepage + article pages), not scoped to any single article.
- Each tool also gets its own page at `/tools/[slug]` with a longer description and, if `embed: true`, an embedded live demo (iframe or inline component). Keep embeds off the sidebar itself — sidebar only links out, to avoid loading heavy content on every page.
- Curate deliberately: expect ~3–5 tools at launch, not an exhaustive list of every project.

### 3. Site structure / pages
- `/` — homepage: thesis blurb, most recent 2–3 articles, sidebar with tools
- `/articles` — full chronological article list
- `/articles/[slug]` — individual article
- `/tools` — full tools list (same cards as sidebar, larger format)
- `/tools/[slug]` — individual tool page, with embed if applicable
- `/about` — short about page (optional for v1, can reuse homepage blurb)

### 4. Navigation
Header: site name/logo + nav links — **Articles**, **Tools**, **About**.

### 5. Footer
- Small, understated "buy me a coffee" text link — same visual weight as a normal footer link, not a button:
  > ☕ If a tool here saved you an evening — [buy me a coffee](#)
- No popup, no prominent CTA styling.

## Non-goals for v1
- No auth, no user accounts, no database.
- No CMS — content authored as Markdown files in the repo.
- No animation-heavy or 3D visual treatment — keep JS light, static-first.
- No AI-generated build pipeline features (auto-summaries, live repo stats) — planned for a later iteration, not part of initial scaffold.

## Repo structure (expected output)
```
/
├── astro.config.mjs
├── package.json
├── src/
│   ├── content/
│   │   ├── config.ts          # defines articles & tools collections + schemas above
│   │   ├── articles/
│   │   └── tools/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Sidebar.astro
│   │   └── ToolCard.astro
│   └── pages/
│       ├── index.astro
│       ├── about.astro
│       ├── articles/
│       │   ├── index.astro
│       │   └── [slug].astro
│       └── tools/
│           ├── index.astro
│           └── [slug].astro
├── public/
│   └── (favicon, CNAME file for custom domain)
└── .github/
    └── workflows/
        └── deploy.yml          # build + deploy to GitHub Pages on push to main
```

## Seed content for v1
- 2 example tool entries (placeholders, to be replaced): scorecard generator, one education practice tool
- 1 example article (placeholder) demonstrating the article layout

## Deferred / v2 ideas (not in scope now)
- GitHub Actions–driven auto-generated article summaries or og-images via API calls at build time
- Live repo stats (commit activity, latest release) pulled into tool pages
- Giscus comments
