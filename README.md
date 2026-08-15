# Composr

Composr is a dashboard for managing HTML email templates and getting them into Gmail with a single click — either copied to the clipboard, pushed as a Gmail draft via the Gmail API, or inserted directly into an open compose window through a companion Gmail Add-on.

## Features

- Create, edit, and organize HTML email templates by category
- Live preview alongside the raw HTML editor
- Google sign-in; templates are stored per user in Postgres
- **Copy template** — copies the HTML straight to the clipboard for pasting into Gmail
- **Send to Gmail** — creates a real Gmail draft via the Gmail API
- **Gmail Add-on** (`gmail-addon/`) — lets you insert a template directly into an open compose draft from Gmail's own three-dot menu, without leaving Gmail

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Auth.js](https://authjs.dev) (NextAuth v5) with the Google provider
- [Prisma](https://www.prisma.io) + Postgres (developed against [Neon](https://neon.tech))
- [googleapis](https://github.com/googleapis/google-api-nodejs-client) for Gmail draft creation
- Deployed on [Netlify](https://www.netlify.com) via `@netlify/plugin-nextjs`
- Gmail Add-on built with [Google Apps Script](https://developers.google.com/apps-script)

## Project structure

```
src/
  app/
    api/
      auth/[...nextauth]/     Auth.js route handler
      templates/               Template CRUD + send-to-gmail routes
      api-keys/                Personal API key for the Gmail Add-on
    templates/new, templates/edit   Template editor pages
    settings/                  API key management page
    page.tsx                   Dashboard (template list)
  components/                  UI components (editor, list, auth gate, etc.)
  lib/                         Prisma client, Auth.js config, Gmail helper, template-store API client
prisma/
  schema.prisma                 Database schema
  migrations/                   Prisma migration history
gmail-addon/                    Standalone Google Apps Script project (see its own README)
```

## Prerequisites

- Node.js 20+
- A Postgres database (e.g. a free [Neon](https://neon.tech) project)
- A Google Cloud project with the Gmail API enabled and an OAuth client

## Environment variables

Copy `.env.example` to `.env` and fill in your own values:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string (e.g. from Neon), including `?sslmode=require` |
| `AUTH_SECRET` | Random secret used to sign session tokens — generate with `npx auth secret` |
| `AUTH_GOOGLE_ID` | OAuth client ID from Google Cloud Console |
| `AUTH_GOOGLE_SECRET` | OAuth client secret from Google Cloud Console |
| `AUTH_URL` | The app's public URL (e.g. `https://your-site.netlify.app`) — required in production so Auth.js resolves the correct OAuth callback |

None of these values are committed to the repo; `.env` is gitignored.

## Setting up Google OAuth + Gmail API access

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create a project (or reuse one).
2. **APIs & Services → Library** → enable the **Gmail API**.
3. **APIs & Services → OAuth consent screen** (or the newer "Google Auth Platform" UI):
   - User type: **External**
   - Fill in app name and support email
   - **Scopes** → add `https://www.googleapis.com/auth/gmail.compose`
   - **Test users** → add the Google account(s) you'll sign in with, while the app is in "Testing" mode
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (local dev)
     - `https://<your-deployed-domain>/api/auth/callback/google` (production)
5. Copy the generated **Client ID** and **Client secret** into your `.env`.

## Database setup

1. Create a Postgres database (e.g. a Neon project) and copy its connection string into `DATABASE_URL`.
2. Apply the schema:

   ```bash
   npx prisma migrate dev
   ```

   This creates the `User`, `Account`, `Template`, and `ApiKey` tables.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm install` runs `prisma generate` automatically via its `postinstall` script, so the Prisma client always matches the current schema.

## Deployment

The app runs as a full Next.js server (SSR + API routes), not a static export. On Netlify this is handled by `@netlify/plugin-nextjs`, already configured in `netlify.toml` (`publish = ".next"`). To deploy:

1. Connect the repo to a Netlify site.
2. Set the environment variables from the table above in the site's **Environment variables** settings, using your production values (including `AUTH_URL` set to the site's own URL).
3. Add the production callback URL to the Google OAuth client's authorized redirect URIs.
4. Trigger a deploy.

## Gmail Add-on

`gmail-addon/` is a self-contained Google Apps Script project — it is not built or deployed by Netlify. It talks to this app's `/api/templates` endpoints over HTTPS using a personal API key (generated from the `/settings` page) instead of a browser session. See [`gmail-addon/README.md`](gmail-addon/README.md) for full setup instructions.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |
| `npx prisma migrate dev` | Apply pending database migrations |
| `npx prisma studio` | Browse the database with Prisma's GUI |
