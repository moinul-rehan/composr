import { google } from "googleapis";
import { prisma } from "./prisma";

async function getFreshAccessToken(userId: string): Promise<string> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account?.access_token) {
    throw new Error("No Google account linked");
  }

  const isExpired =
    !account.expires_at || account.expires_at * 1000 < Date.now() + 60_000;

  if (!isExpired) {
    return account.access_token;
  }

  if (!account.refresh_token) {
    throw new Error("Google access token expired and no refresh token available");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: account.refresh_token });

  const { credentials } = await oauth2Client.refreshAccessToken();

  await prisma.account.update({
    where: { id: account.id },
    data: {
      access_token: credentials.access_token,
      expires_at: credentials.expiry_date
        ? Math.floor(credentials.expiry_date / 1000)
        : undefined,
    },
  });

  if (!credentials.access_token) {
    throw new Error("Failed to refresh Google access token");
  }

  return credentials.access_token;
}

function buildRawMessage(to: string | undefined, subject: string, html: string) {
  const headers = [
    to ? `To: ${to}` : undefined,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
  ].filter(Boolean);

  const message = `${headers.join("\r\n")}\r\n\r\n${html}`;

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function createGmailDraft(
  userId: string,
  subject: string,
  html: string
) {
  const accessToken = await getFreshAccessToken(userId);

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const raw = buildRawMessage(undefined, subject, html);

  const { data } = await gmail.users.drafts.create({
    userId: "me",
    requestBody: { message: { raw } },
  });

  return data;
}
