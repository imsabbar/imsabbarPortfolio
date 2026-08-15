# Privacy Policy

This page explains what data this site collects, how it is stored, and what your rights are.

## 1. Data collected

This site is a static React application. The portfolio content (projects, services, plans, testimonials) is served from a managed MySQL database through a thin read-only API and rendered on the server.

When you interact with the site, the following categories of data may be involved:

- **Contact form submissions.** Name, email, company, phone, country, service interest, budget, timeline, message, optional attachment, and ROI estimate. Stored in a `portfolio_leads` table on the database server.
- **Cookie preferences.** A small set of first-party cookies: `currency_preference` (your selected currency), `detected_currency` (geographic detection, set by the middleware), and a session-scoped storage key holding the ROI-calculator estimate you might pre-fill into the contact form.
- **Aggregate server logs.** The hosting provider records the standard request envelope (IP, user agent, status code, response time) for 30 days. Logs are not joined to your contact-form submission.
- **Booking and WhatsApp attribution.** A booking-gate choice or WhatsApp click may create a lightweight lead record containing the source page and abuse-prevention telemetry.

## 2. Contact form

When you submit the contact form, the submission is protected by Cloudflare Turnstile, a hidden honeypot, submission-velocity checks, and IP-based rate limiting. It is validated both in the browser and on the server. Submissions are written to the `portfolio_leads` table and best-effort notifications and an automated confirmation email are sent to the site owner and, where applicable, you. Optional PDF, DOC, DOCX, PNG, or JPEG attachments up to 5 MB are stored outside the public web root. The site owner reviews submissions in the imsabbar OS Portfolio Manager.

Your message body, your email, and your name are stored. A one-way hash of your IP address and your user agent are stored in the same row for abuse-prevention; the raw IP is not stored by the portfolio lead engine. You may request access, correction, or deletion by contacting the owner.

## 3. Cookies

This site uses only first-party cookies. No advertising trackers, no Google Analytics in its default form, no third-party analytics scripts.

| Cookie | Purpose | Lifetime |
|---|---|---|
| `currency_preference` | Remembers your selected currency (USD / EUR / GBP / AED / MAD). | 30 days |
| `detected_currency` | Set from the request's country. | 30 days |
| `theme` | Remembers your light/dark preference. | 1 year |

You can clear these at any time from your browser.

## 4. Your rights

You can request a copy of the data we hold about you, ask for it to be corrected, or ask for it to be deleted. Send your request to the email address shown in the footer.

## 5. Updates to this policy

Any change to this policy is published on this page with an updated "last updated" date. Material changes will also be reflected in the contact form so returning visitors are notified.
