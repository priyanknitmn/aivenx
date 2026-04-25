# AIvenX Landing Page

Single-file static landing site for **aivenx.co.in**.

Pure HTML + Tailwind via CDN — no build step, no backend, no dependencies.
Hostable for ₹0 on any static host.

## Files

```
landing/
├── index.html          # the landing page
├── assets/
│   ├── aivenx-logo.png # full lockup
│   ├── aivenx-mark.png # AX monogram (favicon)
│   └── leo.png         # mascot
└── README.md           # this file
```

## Local preview

Just open `index.html` in a browser. No server required.

For a more accurate preview (proper paths, fonts loading from CDN), run a tiny
local server:

```bash
cd landing
python -m http.server 8080
# then open http://localhost:8080
```

---

## Deployment — recommended path: Cloudflare Pages

**Why Cloudflare Pages:**
- Free tier covers everything you need (unlimited bandwidth, 500 builds/month)
- Edge caching from Mumbai POP — pages load instantly for Indian visitors
- Automatic HTTPS
- Free custom domain (you'll use `aivenx.co.in`)
- 5-minute setup

### Step-by-step

1. **Push the `landing/` folder to a Git repo.** GitHub, GitLab, or Bitbucket — any of them work. Either:
   - Push the whole `08_04_2026_context_server_latest` repo (Cloudflare deploys only the `landing/` subfolder)
   - Or extract `landing/` into its own repo (cleaner)

2. **Sign in to Cloudflare Pages** at https://pages.cloudflare.com/

3. **Create a project:**
   - Click "Create a project" → "Connect to Git"
   - Authorize the Git provider, pick the repo
   - **Build settings:**
     - Framework preset: **None**
     - Build command: *(leave empty)*
     - Build output directory: `landing` *(if you pushed the whole repo)* or `/` *(if you pushed just landing/)*
   - Click "Save and Deploy"

4. **First deploy takes ~30 seconds.** You'll get a URL like
   `aivenx-landing-abc.pages.dev` — open it, confirm everything looks right.

5. **Connect your custom domain (`aivenx.co.in`):**
   - In your project → "Custom domains" → "Set up a custom domain"
   - Enter `aivenx.co.in`
   - Cloudflare gives you DNS records to add at GoDaddy:
     - Two `CNAME` records (or change nameservers — see below)
   - Add them in GoDaddy DNS Manager → save → wait 5-30 minutes for propagation

6. **Optional but recommended — point GoDaddy to Cloudflare's nameservers**
   instead of just adding CNAME records. Gives you faster DNS, free Cloudflare
   features, and automatic SSL renewal:
   - Cloudflare gives you 2 nameservers like `xyz.ns.cloudflare.com`
   - In GoDaddy: Domain Settings → Nameservers → "I'll use my own" → paste
     Cloudflare's nameservers → save
   - Propagation takes 1-24 hours

7. **Done.** `aivenx.co.in` now serves the landing page over HTTPS.

---

## Alternative hosts (if you prefer not to use Cloudflare)

| Host | Free tier | Custom domain | India latency |
|---|---|---|---|
| **Cloudflare Pages** | ✓ unlimited | ✓ free | ⭐ excellent (Mumbai POP) |
| **Vercel** | ✓ 100 GB/month | ✓ free | OK (Singapore) |
| **GitHub Pages** | ✓ unlimited | ✓ free | OK |
| **Netlify** | ✓ 100 GB/month | ✓ free | OK |

All four follow the same flow: connect Git repo → set output directory to
`landing` → deploy. Custom domain config differs slightly per host — check
their docs.

---

## Updating content

Edit `index.html` directly. Push to Git. Cloudflare auto-deploys within
~30 seconds.

Common edits:
- **Email addresses** — search for `aivenx.co.in` in the file, update
  if your domain changes.
- **Pricing or editions** — the editions section is one `<section id="editions">`
  block, easy to find and edit.
- **Add a testimonial** — drop a new section between Face AI and Coming Soon
  with the quote in a styled blockquote.
- **Update the "Coming in 2026" timing** — search for "2026" and adjust as
  features actually ship.

---

## Notes for production hardening (later)

The current setup is fine for launch week. As you scale, consider:

1. **Replace Tailwind CDN with a built CSS file.** Smaller payload, faster
   first paint. Run `npx tailwindcss build` once, ship the resulting CSS.
2. **Add an OG image** at `/assets/og-cover.jpg` (1200×630 px) so links
   shared on WhatsApp / LinkedIn show a custom preview card.
3. **Add basic analytics** — Plausible or Cloudflare Web Analytics. Both
   privacy-friendly, no cookie banner needed.
4. **Add a sitemap.xml + robots.txt** for SEO.
5. **Set up a contact form** that posts to a service like Formspree or your
   own endpoint, so leads don't all go through `mailto:` links (some users
   click and nothing happens because they don't have a configured mail client).

None of those block your launch — punch list for v2.
