# Sean Johnson Ministry Website

Personal ministry website for Sean Johnson, campus minister with Awakening Collegiate Fellowship in Milledgeville, GA.

## Adding a Newsletter

1. Create a new `.md` file in the `newsletters/` folder.  
2. Name it by date, e.g. `2026-07-july.md`.  
3. Add frontmatter at the top:

```markdown
---
title: July 2026 Newsletter
date: 2026-07-01
excerpt: One or two sentences that appear in the newsletter list as a preview.
---

Your newsletter content here...
```

4. Commit and push to `main`. GitHub Actions automatically rebuilds `newsletters/index.json` and deploys the site. The new newsletter will appear on the Newsletter page, newest first.

## Local Preview

No build step needed. Open any `.html` file in a browser, or use a local server to avoid fetch restrictions:

```bash
# Python (recommended)
python -m http.server 8000
# then open http://localhost:8000
```

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

To enable GitHub Pages the first time:
1. Go to **Settings → Pages** in this repo
2. Set **Source** to **GitHub Actions**

## Things to Customize

- `about.html` — fill in the personal bio details marked with `[brackets]`
- `give.html` — update the Venmo handle, PayPal email, and mailing address
- `contact.html` — update the email address, social links, and Formspree endpoint
- Add a real photo and replace the emoji placeholder

## Contact Form

The contact form uses [Formspree](https://formspree.io) (free tier). To activate:
1. Sign up at formspree.io
2. Create a new form and copy the endpoint URL
3. Replace `YOUR_FORMSPREE_ID` in `contact.html` with your form ID
