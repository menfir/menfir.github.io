#!/usr/bin/env bash
# Standing SEO/GDPR checklist, run against dist/ after a build.
# The spec (seo-gdpr-spec.md) says to re-run this whenever a page type is added —
# so it's a script, not a habit. Usage: npm run build && npm run check:seo
set -euo pipefail

DIST=${1:-dist}
fail=0
note() { printf '  %-6s %s\n' "$1" "$2"; }
check() { if [ "$1" = 0 ]; then note "ok" "$2"; else note "FAIL" "$2"; fail=1; fi; }

[ -d "$DIST" ] || { echo "no $DIST/ — run the build first"; exit 1; }
pages=$(find "$DIST" -name '*.html')
[ -n "$pages" ] || { echo "no HTML in $DIST/ — build produced nothing"; exit 1; }

echo "GDPR"
# Any host that isn't ours and isn't a plain outbound link the user must click.
third_party=$(grep -rhoE '(src|href)="https?://[a-zA-Z0-9._-]+' $pages \
  | grep -vE 'www\.mabille\.me|buymeacoffee\.com|github\.com' | sort -u || true)
check "$([ -z "$third_party" ] && echo 0 || echo 1)" "no third-party subresources${third_party:+ — found: $third_party}"
check "$(grep -rlE 'fonts\.(googleapis|gstatic)\.com' $pages >/dev/null 2>&1 && echo 1 || echo 0)" "fonts self-hosted"
check "$(grep -rl 'document.cookie' $pages >/dev/null 2>&1 && echo 1 || echo 0)" "no cookie writes"
check "$(grep -rlE 'googletagmanager|google-analytics|gtag\(' $pages >/dev/null 2>&1 && echo 1 || echo 0)" "no analytics"

echo "SEO"
check "$([ -f "$DIST/robots.txt" ] && echo 0 || echo 1)" "robots.txt present"
check "$([ -f "$DIST/sitemap.xml" ] && echo 0 || echo 1)" "sitemap.xml present"

missing=0
for f in $pages; do
  grep -q 'rel="canonical"' "$f" || { note "FAIL" "no canonical: $f"; missing=1; }
  grep -q '<meta name="description"' "$f" || { note "FAIL" "no description: $f"; missing=1; }
  grep -q 'property="og:title"' "$f" || { note "FAIL" "no og:title: $f"; missing=1; }
  # grep -o, not grep -c: the built HTML is one line, so -c can never exceed 1.
  [ "$(grep -o '<h1' "$f" | wc -l)" = 1 ] || { note "FAIL" "not exactly one h1: $f"; missing=1; }
done
check "$missing" "every page has canonical, description, og:title, one h1"

# Titles must be unique or pages compete with each other in the index.
dupes=$(grep -rhoE '<title>[^<]*</title>' $pages | sort | uniq -d)
check "$([ -z "$dupes" ] && echo 0 || echo 1)" "titles unique${dupes:+ — repeated: $dupes}"

# The sitemap and the canonical tags must name the same URLs, in the same form.
canon=$(grep -rhoE 'rel="canonical" href="[^"]*"' $pages | sed 's/.*href="//;s/"//' | sort)
sitemap=$(grep -oE '<loc>[^<]*</loc>' "$DIST/sitemap.xml" | sed 's/<[^>]*>//g' | sort)
check "$([ "$canon" = "$sitemap" ] && echo 0 || echo 1)" "sitemap matches canonical URLs exactly"
[ "$canon" = "$sitemap" ] || diff <(echo "$canon") <(echo "$sitemap") | sed 's/^/         /' || true

echo
[ "$fail" = 0 ] && echo "all checks passed" || echo "checks failed"
exit "$fail"
