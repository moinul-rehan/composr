This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Backend setup (Google sign-in, Postgres storage, Gmail drafts)

Composr stores templates in Postgres (Neon) per signed-in user, and can push a template into Gmail as a draft via the Gmail API. You need a Google Cloud OAuth client and a Neon database before running the app.

### 1. Create a Google Cloud OAuth client

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create a new project (or reuse one).
2. In **APIs & Services → Library**, enable the **Gmail API**.
3. In **APIs & Services → OAuth consent screen**:
   - Choose **External** user type (unless you have a Workspace org).
   - Fill in app name/support email.
   - Under **Scopes**, add `https://www.googleapis.com/auth/gmail.compose`.
   - Under **Test users** (while the app is in "Testing" mode), add your own Google account email — only test users can sign in until the app is published/verified.
4. In **APIs & Services → Credentials**, create an **OAuth client ID** of type **Web application**.
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` for local dev, plus your production URL (e.g. `https://your-site.netlify.app/api/auth/callback/google`) once deployed.
5. Copy the generated **Client ID** and **Client secret**.

### 2. Create a Neon Postgres database

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the connection string (with `?sslmode=require`) from the Neon dashboard.

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in:

```bash
DATABASE_URL="<your Neon connection string>"
AUTH_SECRET="<run: npx auth secret>"
AUTH_GOOGLE_ID="<Google OAuth client ID>"
AUTH_GOOGLE_SECRET="<Google OAuth client secret>"
```

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

This creates the `User`, `Account`, and `Template` tables in your Neon database.

### 5. Deploying

The app now runs as a full Next.js server (API routes + auth), not a static export. On Netlify this is handled by the `@netlify/plugin-nextjs` plugin already configured in `netlify.toml`. Set the same environment variables (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`) in your Netlify site's environment settings, and add the production callback URL to the Google OAuth client's authorized redirect URIs.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
