## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## SEO & GDPR checklist

`seo-gdpr-spec.md` is a standing requirement, not a one-time task. Before merging
any new page type, form, embed, or third-party script, re-check it against the
diff. The mechanical parts are enforced by `npm run check:seo` (also runs in CI
before deploy); the judgement calls — a new form, a new embed, anything that
sends visitor data off-origin — still need a human read of Part 1.
