# CoreSafe V18.2 — WhatsApp Quotation Enquiries

This is based on CoreSafe Website V18.1 with no design/SEO changes. The only user-facing change is the quotation-form submission behaviour and its instruction text.

## What happens when a visitor clicks Continue on WhatsApp
1. Required fields are checked by the browser.
2. A new WhatsApp tab opens to CoreSafe on +27 64 879 4566, containing the customer's name, company, email, phone, selected services, site, required date and scope of work.
3. The visitor **must click Send inside WhatsApp**. No standard website can send on their behalf via a wa.me link.
4. At the same time, the website attempts to save a copy in Netlify Forms as a backup (when the page is on coresafe.co.za or a Netlify-hosted address).
5. The old /thank-you.html redirect is not used. The form fallback action is / if JavaScript is disabled.

## Deploy to your existing GitHub-connected Netlify site
The simplest option is to update just two files in the CoreSafe GitHub repository:
- `index.html`
- `script.js`

Both files must be updated together. Or deploy all the contents of this directory to the same Netlify project. Do not create a new website or domain.

Netlify auto-deploys commits to the configured production branch. After deployment, fill out one real test form, click Continue on WhatsApp and check that WhatsApp opens with all details. **Do not send the test unless you want a test message.**

Also check Netlify → CoreSafe → Forms for the backup submission. If it is absent, enable form detection under Netlify Forms and redeploy, then retest. The backup is best effort and not a substitute for pressing Send in WhatsApp.

The standalone `CoreSafe_V18_Standalone_Preview.html` is self-contained for local review. It is not part of the page routing and does not submit a Netlify backup while opened from your computer.
