# SEO & GDPR Baseline Audit — Report

**Date:** 2026-09-10
**Scope:** `menfir/menfir.github.io` → www.mabille.me
**Spec:** [seo-gdpr-spec.md](seo-gdpr-spec.md)

---

## 1. GDPR audit findings

One finding. Everything else was already clean.

| Finding | Location | Verdict | Action taken |
|---|---|---|---|
| Google Fonts loaded from `fonts.googleapis.com` + `fonts.gstatic.com`, plus two `preconnect` hints | `src/layouts/BaseLayout.astro:16-25` | **Requires removal.** Sending every visitor's IP to Google before any consent is the exact pattern German courts have ruled against (LG München I, 3 O 17493/20). It also blocked first render. | **Self-hosted.** Replaced with `@fontsource/barlow-condensed` (600/700/800/900), `@fontsource-variable/dm-sans` (+ italic), `@fontsource-variable/jetbrains-mono`. Fonts now ship from our own origin; no third-party request remains. |

### Checked and clean

- **No cookies.** Zero `document.cookie` writes anywhere in the source or build.
- **No analytics.** No GA4, GTM, Meta Pixel, LinkedIn Insight, Hotjar, or any cookieless alternative either. The site ships **zero `<script>` tags** other than the JSON-LD blocks added below.
- **No forms.** Nothing collects input, so no third-party processor receives anything.
- **No comment system.** No Disqus, utterances, or giscus — so no GitHub OAuth flow to review.
- **Not Jekyll.** Astro build, so no leftover theme scripts to inspect.
- **`buymeacoffee.com`** appears in the footer and sidebar as a plain outbound `<a href>`. Nothing loads from that domain until a visitor deliberately clicks. No disclosure obligation.
- **The two embedded tools were same-origin**, not third-party — `/frans/` and `/maaltafels/` are project repos served under the same domain. They were never a cookie exposure. They were removed anyway (see §3).

### Conclusion

**No cookie banner is required.** After the font change, the site makes no
third-party requests of any kind, sets no cookies, and stores nothing in the
visitor's browser. There is nothing to consent to.

The sub-apps at `/frans/`, `/maaltafels/` and `/scorecard-generator/` do use
`localStorage` for practice progress. That is first-party, strictly necessary
for the service the user asked for, and carries no consent requirement under
the ePrivacy Directive's Art. 5(3) exemption. No banner there either.

---

## 2. SEO: before and after

### Already present — no change needed

`CNAME` correct · `lang="en"` on `<html>` · exactly one `<h1>` per page ·
semantic `<main>` / `<nav>` / `<article>` · unique `<title>` on all 8 pages ·
unique `<meta name="description">` on all 8 pages · no render-blocking
third-party scripts (the Google Fonts stylesheet was the only one, now gone).

### Newly added

| Item | Implementation |
|---|---|
| `robots.txt` | `public/robots.txt` — allows all, points at the sitemap |
| `sitemap.xml` | `src/pages/sitemap.xml.ts` — generated from both content collections plus the four static routes. Hand-rolled rather than `@astrojs/sitemap`: eight pages did not justify a dependency |
| `rel="canonical"` | `BaseLayout` — built from `Astro.site`, so every page canonicalises to the `www` host |
| Open Graph | `og:site_name`, `og:type`, `og:url`, `og:title`, `og:description`, `og:image` — all pages |
| Twitter Card | `twitter:card` only. `twitter:title`/`description`/`image` are redundant — X falls back to the `og:` equivalents |
| JSON-LD | `Article` on article pages (`headline`, `description`, `datePublished`, `author`, `keywords`); `CreativeWork` on tool pages (`name`, `description`, `url`, `author`, `image`, `codeRepository`) |
| Internal cross-links | Each tool page now ends with an "Other tools" list linking the other two |
| Images + `alt` | Three tool screenshots, each with descriptive alt text (see §3) |
| Modern formats | Astro's `<Image>` emits WebP at 480w/720w with a `sizes` hint. 51–80 kB PNGs → 9–16 kB WebP |
| No layout shift | `<Image>` emits intrinsic `width`/`height`; the screenshot is height-capped in CSS |

### Struck from the spec as not applicable

The spec's "compress images / use WebP / add alt text" items were written for a
site that had **zero images**. They only became real once the screenshots landed,
and are satisfied as of this change.

---

## 3. Change of approach: embeds → linked screenshots

The spec did not cover this; it came up during the audit and was agreed
mid-review.

Two tool pages embedded the live app in a full-height `<iframe>`. These have been
replaced with a cropped, clickable screenshot that links through to the tool.
Rationale:

- Each tool already works perfectly as its own page at its own URL. The iframe
  duplicated it in a worse viewport for no gain.
- An iframe loads the entire second application on every tool-page view.
- The screenshots double as `og:image`, which the site otherwise had no source
  for — so social previews came free.

Mechanically: the `embed: boolean` field in `src/content.config.ts` became
`screenshot: image()`, which resolves against `src/assets/` and hands Astro the
dimensions.

---

## 4. Standing checklist, automated

The spec calls this a standing requirement rather than a one-time task, so it is
now a script rather than a habit: **`scripts/check-seo.sh`**, wired to
`npm run check:seo` and **run in CI before deploy**. It fails the build on:

- any third-party subresource (catches a re-introduced font CDN, analytics, or embed)
- `document.cookie` writes or analytics snippets
- a missing `robots.txt` or `sitemap.xml`
- any page missing canonical, description, or `og:title`, or not having exactly one `<h1>`
- duplicate `<title>` values across pages
- the sitemap and the canonical tags disagreeing on URLs

It was verified in both directions: it passes on the clean build, and a
deliberately broken copy of `dist/` triggered every check. That negative control
found a real bug in the script itself — `grep -c` counts *lines*, and the built
HTML is a single line, so the `<h1>` check could never have counted past one. Now
uses `grep -o | wc -l`.

---

## 5. Manual steps

### Done, verified 2026-09-10

- **Apex DNS.** `mabille.me` now publishes all four GitHub Pages A records.
  (It previously published *no* address records at all — the `URL Redirect
  Record` that was on `@` was configured but resolving to nothing, and had to be
  deleted because it conflicts with A records on the same host.)
- **SPF.** Moved from Host `mabille.me` — which the registrar expanded to
  `mabille.me.mabille.me`, where no mail receiver would ever find it — to `@`.
  It now resolves correctly at the apex.
- **Enforce HTTPS.** Confirmed enabled (`https_enforced: true`), certificate
  state `approved`.

### In flight

The apex resolves but does not serve yet: GitHub's certificate currently covers
`www.mabille.me` only, and provisioning one that also covers the apex takes up
to 24h after a DNS change. DNS is correct and nothing else is needed — if
`https://mabille.me` is still failing after that, re-saving the custom domain in
the repo's Pages settings forces re-provisioning.

Once it comes up, the apex should 301 to `www` with a valid certificate, which
is what the A records buy over a registrar URL redirect: a redirect record
forwards `http://` only, so `https://mabille.me` would have failed the
certificate check regardless.

### Still outstanding

- **Submit the sitemap** at `https://www.mabille.me/sitemap.xml` to Google
  Search Console (and Bing Webmaster Tools if you care to). This is the only
  remaining item.

### Checked, no action needed

`menfir.github.io/frans/` already 301s to `www.mabille.me/frans/`, so the GitHub
subdomain is not competing for the same content in the index. All three tool
URLs return 200.

---

## 6. Note on method

Two readings in this audit were wrong on the first pass, and both were wrong in
the reassuring direction — worth recording, because the standing checklist will
be re-run by someone reading this file.

**A single fetch is a sample, not a fact.** An early pass reported `/frans/` as
returning 404 and concluded the project had never deployed. A re-request
returned 200, and the deploy history showed it had been publishing successfully
throughout — the first fetch was a transient CDN miss. Nothing was changed on
the basis of that reading.

**A resolver query for two names returns one merged answer.** The apex was
first reported as "IPv6 only, no A records", from a `getent hosts` call passed
both `mabille.me` and `www.mabille.me` at once. The IPv6 addresses in that
output belonged to `www`; the apex had contributed nothing. Querying each name
separately, by address family, showed the apex publishes no records at all —
which is a worse problem than the one first reported, and would have been
papered over by "just add A records" without checking what was already on `@`.
Query one name at a time.
