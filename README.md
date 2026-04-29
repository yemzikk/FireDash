# FireDash

A fast, privacy-first web dashboard for [Firefly III](https://www.firefly-iii.org/) - the open-source personal finance manager.

**Live:** [firedash.yemzikk.in](https://firedash.yemzikk.in)

## Features

### Monthly Report

- Spending, earnings, net change, and net worth summary cards
- Category breakdown with ranked bars
- Budget tracking with progress bars and over/under indicators
- Click any category to drill down into its transactions
- Month/year selector auto-populated from your actual data range

### Tag Explorer

- Analyze spending **or income** by tag with a type filter (Spending / Income / All)
- Budget breakdown for spending; source breakdown for income
- Auto-detected date range from your transaction data
- Quick date presets: 1M, 3M, 6M, YTD, 1Y
- CSV export of all transactions

### Accounts

- Grouped by type: Asset, Liability, Revenue
- Net worth calculation (assets minus liabilities)
- Click any account to expand and see recent transactions inline
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

- Pure CSS bar chart - no chart libraries
- Compare 6 or 12 months of spending, income, or net change
- Average, highest, and lowest month summary

### Budget Explorer

- Select any budget to analyze its spending over a date range
- Spent vs limit summary cards with usage progress bar
- Category breakdown of spending within the budget
- Quick date presets: 1M, 3M, 6M, YTD, 1Y
- Auto-detected date range from transaction data
- CSV export

### Category Explorer

- Select any category to analyze spending **or income** with a type filter
- Budget breakdown for spending; source breakdown for income
- Quick date presets: 1M, 3M, 6M, YTD, 1Y
- Auto-detected date range from transaction data
- CSV export

### UX

- Dark mode with system preference detection
- Responsive layout with mobile sidebar
- Keyboard shortcuts: `1` Monthly Report, `2` Trends, `3` Budget, `4` Category, `5` Tags, `6` Accounts, `7` Savings, `8` Bills, `9` Search - `R` refresh, `S` settings, `/` focus search
- Remembers your last viewed tool
- Server version display after connecting

## How It Works

FireDash is a **single HTML file** - no build tools, no frameworks, no dependencies (except the Inter font). It runs entirely in your browser.

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

> FireDash only reads data - it never creates, modifies, or deletes anything.

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

- **Frontend:** Vanilla HTML/CSS/JS (single file, ~3500 lines)
- **Proxy:** Cloudflare Pages Function (Workers runtime)
- **API:** Firefly III REST API v1
- **Hosting:** Cloudflare Pages
- **Font:** Inter (Google Fonts)

## Privacy & Security

- Credentials stored in browser localStorage only
- Proxy enforces HTTPS and restricts to `/api/` paths
- Authorization header required (no anonymous proxying)
- Optional anonymous usage analytics — opt-in only, off by default (toggle in Settings). No financial data is ever collected. See [ANALYTICS_EVENTS.md](ANALYTICS_EVENTS.md) for what's tracked
- Fully open source

## License

MIT
