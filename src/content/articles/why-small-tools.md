---
title: Why I finally started building the small stuff
description: The cost of a small tool dropped below the cost of putting up with the problem. Here is what changed.
pubDate: 2026-09-01
tags: [ai, tools]
draft: false
---

Placeholder article. Replace me.

Every problem here used to sit in the same bucket: annoying enough to notice,
not annoying enough to spend a Saturday on. That bucket is mostly empty now.

## What that looks like in practice

A drill for one specific vocabulary list. A score card generator for one
specific competition format. Not products — fixes.

```js
// The whole tool, sometimes.
const shuffled = words.sort(() => Math.random() - 0.5);
```

The interesting part is rarely the code. It's noticing that the problem was
solvable at all.
