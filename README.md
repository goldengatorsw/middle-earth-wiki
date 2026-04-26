# Wanderings In Middle Earth — Campaign Wiki

A read-only wiki for an ongoing Adventures in Middle-Earth campaign.

🌐 **Live site:** https://goldengatorsw.github.io/middle-earth-wiki/

---

## Per-Session Update Workflow

Each session, the wiki updates by replacing **one file**: `src/campaign-data.json`.

### The flow

1. After a session, run "Process session N" with Claude
2. Claude produces an updated `campaign-data.json` alongside the master doc
3. Download the JSON file from Claude's outputs
4. Replace `src/campaign-data.json` in this repo
5. Commit and push to `main`
6. GitHub Actions automatically builds and deploys the site (~1-2 minutes)
7. Live site at https://goldengatorsw.github.io/middle-earth-wiki/ shows the new content

That's it. No code changes per session — only data.

### How to update the data file (3 ways)

**Option A: GitHub web UI** (easiest, no tools required)
1. Go to https://github.com/goldengatorsw/middle-earth-wiki
2. Navigate to `src/campaign-data.json`
3. Click the pencil icon to edit
4. Paste the new file contents over the old
5. Scroll down and commit directly to `main`

**Option B: Drag-and-drop upload**
1. Go to the repo's `src/` folder on GitHub
2. Drag the new `campaign-data.json` into the browser
3. GitHub treats it as a commit; confirm it

**Option C: Git CLI**
```bash
git pull
cp /path/to/new/campaign-data.json src/campaign-data.json
git add src/campaign-data.json
git commit -m "Session N data update"
git push
```

---

## Architecture

```
middle-earth-wiki/
├── .github/workflows/deploy.yml   # Auto-deploys to GitHub Pages on push to main
├── src/
│   ├── App.jsx                    # All UI components — rarely changes
│   ├── campaign-data.json         # SINGLE SOURCE OF TRUTH — updated each session
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles + Google Fonts import
├── index.html                     # Vite entry HTML
├── package.json                   # Dependencies
└── vite.config.js                 # Build config (note `base` for GitHub Pages)
```

### Data shape (campaign-data.json)

```json
{
  "meta": { "campaignName", "lastSession", "currentStatus", "primaryMission" },
  "party":      [{ "id", "name", "player", "race", "emoji", "tag", "bio", "facts": [], "funny": [], "arc" }],
  "npcs":       [{ "id", "name", "status", "role", "emoji", "loc", "first", "desc" }],
  "locations":  [{ "id", "name", "emoji", "status", "desc", "facts": [] }],
  "sessions":   [{ "num", "title", "date", "summary" }],
  "items":      [{ "name", "holder", "hostile", "emoji", "desc", "q" }],
  "mysteries":  ["question 1", "question 2", ...],
  "funny":      [{ "who", "s" /* session # */, "t" /* text */ }],
  "greatest":   [{ "who", "s", "t" }]
}
```

Adding new entries to any array shows up immediately in the UI. No code changes needed for normal session updates.

### When code changes ARE needed

You only need to touch `src/App.jsx` if:
- You want to add a new top-level page (a new tab)
- You want to change how data is rendered (new fields, new layout)
- You want to add a new section to character pages (e.g. "Inventory", "Spells")

For routine session updates: **never touch the code**.

---

## Local Development

```bash
npm install
npm run dev      # Starts dev server at http://localhost:5173
npm run build    # Outputs to dist/ — what GitHub Pages deploys
npm run preview  # Locally preview the production build
```

---

## Tech Stack

- **React 18** — UI
- **Vite 5** — build tooling
- **No CSS framework** — inline-style objects in App.jsx (consistent with original design)
- **Google Fonts (Cinzel + Crimson Text)** — loaded from CSS
- **GitHub Actions + GitHub Pages** — CI/CD
- **Zero runtime dependencies** beyond React

No backend. No database. No API calls. Fully static — loads in <1 second on any device.

---

## What this wiki does NOT have (intentionally)

- ❌ Player accounts / logins
- ❌ Per-user notes (data wouldn't persist across devices)
- ❌ AI chat (would require server + API key)
- ❌ Suggestion submissions (would require backend)

These features were considered and removed because the GitHub-Pages-only constraint makes them either broken or unsafe (exposing API keys client-side). If those features become important later, they would require adding a serverless backend (Cloudflare Workers, Vercel Functions, etc.) — a separate project.

---

## License

Personal campaign content. Not for redistribution.
