import dotenv from "dotenv";

dotenv.config();

// Sends mail through the Gmail API over HTTPS (port 443), so Render's
// SMTP-port block doesn't apply. Same interface as the old transporter:
//   transporter.sendMail({ to, subject, html, text })
//
// Required env vars on Render:
//   EMAIL_USER           the Gmail address that sends (e.g. gympassadmin@gmail.com)
//   GMAIL_CLIENT_ID      OAuth client id from Google Cloud
//   GMAIL_CLIENT_SECRET  OAuth client secret
//   GMAIL_REFRESH_TOKEN  refresh token for EMAIL_USER (scope: gmail.send)

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

let cachedToken = null;
let cachedExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedExpiry - 60_000) return cachedToken;

  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } =
    process.env;

  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error(
      "GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET and GMAIL_REFRESH_TOKEN must be set",
    );
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(15000),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.access_token) {
    throw new Error(
      `Google token error ${res.status}: ${data.error_description || data.error || "unknown"}`,
    );
  }

  cachedToken = data.access_token;
  cachedExpiry = Date.now() + (data.expires_in || 3600) * 1000;
  return cachedToken;
}

function encodeHeader(value) {
  // RFC 2047 so non-ASCII subjects survive
  return /^[\x20-\x7e]*$/.test(value)
    ? value
    : `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function buildMime({ from, to, subject, html, text }) {
  const headers = [
    `From: GymPass <${from}>`,
    `To: ${to.join(", ")}`,
    `Subject: ${encodeHeader(subject || "")}`,
    "MIME-Version: 1.0",
  ];

  if (html && text) {
    const boundary = `b_${Date.now().toString(36)}`;
    return [
      ...headers,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(text, "utf8").toString("base64"),
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(html, "utf8").toString("base64"),
      `--${boundary}--`,
    ].join("\r\n");
  }

  const isHtml = Boolean(html);
  return [
    ...headers,
    `Content-Type: ${isHtml ? "text/html" : "text/plain"}; charset="UTF-8"`,
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(html || text || "", "utf8").toString("base64"),
  ].join("\r\n");
}

const transporter = {
  async sendMail(options) {
    const from = process.env.EMAIL_USER;
    if (!from) throw new Error("EMAIL_USER is not configured");

    const to = Array.isArray(options.to) ? options.to : [options.to];
    const accessToken = await getAccessToken();

    const raw = Buffer.from(
      buildMime({
        from,
        to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    ).toString("base64url");

    const res = await fetch(SEND_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ raw }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        `Gmail API ${res.status}: ${data.error?.message || JSON.stringify(data)}`,
      );
    }

    console.log("📧 Email sent via Gmail API:", data.id, "->", to.join(", "));

    return { messageId: data.id, accepted: to };
  },
};

console.log(
  process.env.GMAIL_REFRESH_TOKEN
    ? "✅ Gmail API mail transport configured"
    : "❌ GMAIL_REFRESH_TOKEN missing",
);

export default transporter;
