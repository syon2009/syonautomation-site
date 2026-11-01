# Rules for every Claude chat that changes syonautomation.com

This repository is the single source of truth for the website of Syon Automation LLC.
Pushing to `main` deploys to the live site automatically (Cloudflare Workers Builds, worker `black-disk-056a`).

1. Always `git pull` first and build on the newest `main`. Never start from an old zip or an old copy.
2. Change only what the owner asked for. Keep every other chat's work intact.
3. Add a line to CHANGELOG.md for every change (date, what changed, which product or page), so the next chat knows.
4. Bump the cache-busting query strings (`style.css?v=…`, `site.js?v=…`) when CSS or JS changes.
5. Check the change in a browser (desktop and phone width) before pushing. The owner's rule: right the first time.
6. Brand rules: "Syon Automation LLC" on everything; the new Syon Automation wordmark logo, never the SY smiley face; dark theme; no purple or pink; Google Chrome, never Edge, in any instructions.
7. After pushing, confirm the live site at https://syonautomation.com shows the change, then tell the owner.
8. No secrets in this repository (it is public): no ADMIN_TOKEN, Stripe keys or signing keys. Those live only in Cloudflare secrets.
