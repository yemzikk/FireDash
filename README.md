# FireDash

A fast, privacy-first web dashboard for [Firefly III](https://www.firefly-iii.org/) — the open-source personal finance manager.

**Live:** [firedash.yemzikk.in](https://firedash.yemzikk.in)

## Features

### Monthly Report
- Spending, earnings, net change, and net worth summary cards
- Category breakdown with ranked bars
- Budget tracking with progress bars and over/under indicators
- Click any category to drill down into its transactions
- Month/year selector with auto-load

### Tag Explorer
- Analyze spending by tag with budget breakdown
- Auto-detected date range from your transaction data
- CSV export of all transactions
- Paginated loading with real-time progress

### Accounts
- Grouped by type: Asset, Liability, Revenue
- Net worth calculation (assets minus liabilities)
- CSV export

### Savings Goals
- Piggy bank progress tracking with visual bars
- Total saved vs total target summary
- CSV export

### Bills & Subscriptions
- All active bills with frequency and next due date
- Monthly cost estimate (normalized across weekly/quarterly/yearly)
- Overdue/upcoming color coding
- CSV export

### Transaction Search
- Full-text search across all transactions
- Filter by type (withdrawal, deposit, transfer) and date range
- CSV export of search results

### Spending Trends
- Pure CSS bar chart — no chart libraries
- Compare 6 or 12 months of spending, income, or net change
- Average, highest, and lowest month summary

### UX
- Dark mode with system preference detection
- Responsive layout with mobile sidebar
- Keyboard shortcuts: `1-7` tools, `R` refresh, `S` settings, `/` search
- Remembers your last viewed tool
- Server version display after connecting

## How It Works

FireDash is a **single HTML file** — no build tools, no frameworks, no dependencies (except the Inter font). It runs entirely in your browser.

API requests go through a built-in **Cloudflare Pages Function** proxy to avoid CORS issues. Your Firefly III URL and token are stored **only in your browser's localStorage** and never sent to any server other than your own Firefly III instance.

```
Browser  →  Cloudflare Pages Proxy  →  Your Firefly III Server
            (just forwards requests)
```

## Setup

1. Visit [firedash.yemzikk.in](https://firedash.yemzikk.in)
2. Enter your Firefly III URL (must use HTTPS)
3. Enter a Personal Access Token (create one at Firefly III → Profile → OAuth)
4. Click Connect

> Use a **read-only token** for extra safety. FireDash only reads data — it never creates, modifies, or deletes anything.

## Self-Hosting

FireDash is designed for Cloudflare Pages but works anywhere that supports edge functions.

### Cloudflare Pages

```bash
git clone <repo-url>
# Connect to Cloudflare Pages via dashboard or CLI
# The proxy function in functions/proxy/[[path]].js deploys automatically
```

### Local Development

```bash
# Serve with any static server (proxy won't work without Cloudflare Functions)
npx serve .

# Or use Cloudflare's local dev server for full functionality
npx wrangler pages dev .
```

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (single file, ~1500 lines)
- **Proxy:** Cloudflare Pages Function (Workers runtime)
- **API:** Firefly III REST API v1
- **Hosting:** Cloudflare Pages
- **Font:** Inter (Google Fonts)

## Privacy & Security

- Credentials stored in browser localStorage only
- Proxy enforces HTTPS and restricts to `/api/` paths
- Authorization header required (no anonymous proxying)
- No analytics, tracking, or telemetry
- Fully open source

## License

MIT
