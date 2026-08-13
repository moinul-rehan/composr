# Composr Gmail Add-on

Lets you insert a Composr template directly into an open Gmail compose draft,
without leaving Gmail. This is a separate Google Apps Script project — it is
not deployed by Netlify and doesn't share a build pipeline with the Next.js
app. It talks to the deployed Composr app's `/api/templates` endpoints over
HTTPS, authenticated with a personal API key you generate from Composr's
Settings page.

## 1. Get your Composr API key

1. Sign in at [composrr.netlify.app](https://composrr.netlify.app).
2. Go to **Settings** (top-right, next to your email).
3. Click **Generate API key** and copy it. Keep it private — anyone with this
   key can read/create your templates via the API.

## 2. Create the Apps Script project

1. Go to [script.google.com](https://script.google.com) → **New project**.
2. Rename the project (top-left) to "Composr Gmail Add-on".
3. In the editor, delete the default `Code.gs` contents and paste in the
   contents of this folder's `Code.js`.
4. Click the gear icon (**Project Settings**) → check **"Show appsscript.json
   manifest file in editor"**.
5. Open `appsscript.json` in the editor and replace its contents with this
   folder's `appsscript.json`. If your Netlify site URL isn't
   `composrr.netlify.app`, update both the `urlFetchWhitelist` entry there and
   the `COMPOSR_BASE_URL` constant at the top of `Code.js` to match.

## 3. Test it

1. In the Apps Script editor, click **Deploy → Test deployments**.
2. Click **Install** (this authorizes the add-on for your own Google account
   only — no Google review needed for personal use).
3. Grant the requested permissions (Gmail add-on access, external requests).
4. Open Gmail, click **Compose**. In the compose window's three-dot menu (or
   the add-on icon rail on the right side of Gmail), find **Composr**.
5. The first time, it'll show the API key input — paste the key from Step 1
   and click **Save**.
6. Reopen the "Insert Composr template" action from the compose window's
   three-dot menu — you should see a list of your template names. Click one
   to insert its HTML into the draft.

## 4. (Optional) Install as a real add-on for regular use

Test deployments expire periodically. For a longer-lived personal install:

1. **Deploy → New deployment** → type: **Add-on**.
2. Follow the prompts to install it for your account. Since this is for your
   own personal use (not published to the Workspace Marketplace), Google does
   not require an app review — you're just authorizing your own script to act
   on your own Gmail account.

## Notes

- If you rename/redeploy the Netlify site, update `COMPOSR_BASE_URL` in
  `Code.js` and `urlFetchWhitelist` in `appsscript.json` to match, then
  redeploy the Apps Script project.
- If you ever suspect the API key leaked, generate a new one from Composr's
  Settings page (this invalidates the old one) and update it in the add-on's
  settings card.
