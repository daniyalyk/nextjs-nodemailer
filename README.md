# Next.js Nodemailer

A small email-submission app built with Next.js. Visitors enter an email address in the form, and the server sends it to a configured inbox using Nodemailer and SMTP.

## Requirements

- Node.js 20.9 or later
- npm
- An SMTP account and its connection details

## Setup

Install dependencies and create a local environment file from the example:

```bash
npm install
Copy-Item .env.example .env.local
```

On macOS or Linux, use `cp .env.example .env.local` for the second command. Fill in the values in `.env.local`:

| Variable | Description |
| --- | --- |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port; defaults to `465` when omitted |
| `SMTP_USER` | SMTP account username |
| `SMTP_PASS` | SMTP account password or provider key |
| `MAIL_FROM` | Sender address accepted by your SMTP provider |
| `MAIL_TO` | Inbox that receives form submissions |

Keep `.env.local` private. Do not commit SMTP credentials or provider keys. For port `465`, the SMTP connection uses TLS; other ports use a non-TLS connection unless the mailer configuration is changed.

## Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Email Endpoint

`POST /api/send-email` accepts JSON with an `email` string:

```json
{
	"email": "visitor@example.com"
}
```

The endpoint validates the input and sends a notification to `MAIL_TO`. It returns `{ "success": true }` when the SMTP provider accepts the message, `400` for invalid input, or `500` if sending fails or the mail configuration is missing.

## Scripts

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Create a production build
npm run start  # Serve the production build
```

## Project Structure

- `app/page.tsx` — email form and client-side validation
- `app/api/send-email/route.ts` — request validation and email endpoint
- `lib/mailer.ts` — server-side Nodemailer SMTP transport
