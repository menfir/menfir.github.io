// ponytail: card accent colours cycle by position instead of living in frontmatter —
// every listing sorts by name, so a tool keeps the same dot everywhere. Move it into
// the tools schema if someone wants to pick per tool.
const DOTS = ['#E87C3E', '#2A7ED4', '#5E8F3D', '#C04217'];

export const dotFor = (i: number): string => DOTS[i % DOTS.length];
