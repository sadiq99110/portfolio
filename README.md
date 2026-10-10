# Syed Sadiq Hussain — Portfolio

Personal portfolio built with Next.js (App Router) and TypeScript, deployed to GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit content

- All text (profile, skills, experience, projects, education) lives in `app/data.ts`.
- The "Download resume" button serves `public/resume.pdf` — replace that file to update it.
- Styles are in `app/globals.css`.

## How deployment (CI/CD) works

The pipeline is `.github/workflows/deploy.yml`. You never deploy by hand:

1. You push a commit to the `main` branch.
2. GitHub Actions starts automatically: installs packages (`npm ci`), builds the site (`npm run build`), which exports plain HTML into `out/`.
3. The `deploy` job publishes `out/` to GitHub Pages.
4. About 1–2 minutes later the live site is updated.

### One-time setup (already done for the first deploy)

Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Deploying a change yourself

```bash
# edit files, e.g. app/data.ts
npm run build          # optional: check it builds before pushing
git add .
git commit -m "Update projects"
git push               # this triggers the deploy
```

Then watch it in the repo's **Actions** tab. Green check = live. Red X = click it to read the error log;
fix, commit and push again. To redeploy without changes: Actions → "Deploy to GitHub Pages" → **Run workflow**.

### Good habit: preview before publishing

Work on a branch (`git checkout -b new-section`), push it, and open a pull request. Only merging into `main`
deploys, so `main` always matches the live site.
