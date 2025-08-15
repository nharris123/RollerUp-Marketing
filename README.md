# RollerUp Marketing (GitHub Pages)

Vite + React + Tailwind site with a lead form and GitHub Pages deploy via Actions.

## Quick start
```bash
npm ci
npm run dev
```
Open the local URL to preview.

## Deploy to GitHub Pages
1. Create a repo named **RollerUp-Marketing** (case-sensitive to match `base` in `vite.config.js`).  
2. Push this folder as your `main` branch.
3. In the repo: **Settings → Pages → Source: GitHub Actions**.

On each push to `main`, the workflow builds the site and publishes it to Pages.

## Lead form
- Update `WEBHOOK_URL` at the top of `src/App.jsx` to your CRM/webhook (HubSpot, Marketo, Zapier/Make, Airtable, etc.).
- If the webhook fails, leads are cached in `localStorage`. Open the page with `?admin=1` to show an Export CSV button (after a submission).

## Notes
- If you rename the repo, also update `base` in `vite.config.js` to `'/<RepoName>/'`.
- For a user/organization site (`<user>.github.io`), remove the `base` option.
