# Influencer Feedback Platform (MVP)

A dual-role dashboard built for NexGen Agency to manage the entire end-to-end influencer workflow—from first content submission (images/videos) to collaborative asset feedback, and all the way to final live post performance tracking.

## Architecture
- **Frontend Stack**: React 18, Vite, Vanilla CSS (Custom Glassmorphism UI)
- **Backend Analytics Engine**: Node.js, Express, `apify-client` for live URL data-extraction.
- **Workflow State**: Powered by Context API allowing real-time mock transitions between the "Influencer" Submission flow and the "Agency" Review flow without complex auth walls.

## Setup Instructions

1. **Frontend**: Inside the root directory, run `npm install` and `npm run dev` to launch the React interface on `localhost:5173`.
2. **Backend**: Inside the `server/` directory, create a `.env` file containing your `APIFY_API_TOKEN`. Run `npm install` and `node server.js` to launch the invisible scraping engine on `localhost:3001`.

## Known Limitations & Development Roadmap

> [!WARNING]
> **CRITICAL: Instagram Analytics Architecture (Moving to OAuth)**
>
> The current MVP relies on a headless public web-scraper (`Apify`) to collect live social metrics from an entered validation URL. 
> While this works perfectly for TikToks (Views, Likes, Comments are public), it causes a severe data-loss issue for **Instagram Photo Posts & Carousels**. 
> 
> Several years ago, Instagram restricted external access to Reach/Impressions/Saves on static posts. Only the original account owner has the security clearance to see that data via their private Professional Dashboard. A public third-party scraper will literally *never* be able to provide accurate Views and Saves for these types of assets.
>
> **Long-Term Production Requirement**: 
> To launch this as an enterprise SaaS product, we must abandon URL scraping for Instagram entirely. The architecture must be updated so that Creators complete a full **OAuth Authentication Flow** natively within their dashboard, granting the platform formal Read Access to the Instagram Graph API. This officially authorizes the platform to pull 100% accurate, back-end funnel metrics.
