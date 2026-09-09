// ponytail: 200 wpm over the raw markdown — close enough for a "· 6 min" label,
// and it needs no render pass or remark plugin.
export const readingTime = (body = ''): string =>
  `${Math.max(1, Math.round(body.trim().split(/\s+/).length / 200))} min`;

export const isoDate = (d: Date): string => d.toISOString().slice(0, 10);
