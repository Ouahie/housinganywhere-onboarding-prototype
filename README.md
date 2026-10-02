# HousingAnywhere — Private Investor Onboarding Prototype

Educational prototype for the VU Amsterdam course **Introduction to E-Business & Online Commerce**.

## Goal

The prototype redesigns HousingAnywhere's private-landlord onboarding from a high-touch process into a scalable, guided digital journey for **Private Investors / On-the-Side Portfolio landlords**.

The core design principle is:

> Reduce unnecessary time and effort without removing the landlord's control over a valuable asset.

## Prototype flow

1. Account & landlord identification
2. Digital verification
3. Interactive platform rules
4. Property details
5. Media & listing transparency
6. Pricing & availability
7. Tenant requirements & screening
8. Listing preview & compliance check
9. Publish & next steps

## Key platform rules included

- Communication remains on-platform
- No physical viewings
- Listings must accurately represent the property
- Tenant payment is handled securely through the platform and payout follows the move-in protection period

## Run locally

No build tools are needed.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

You can also open `index.html` directly in a browser, although using a small local server is recommended.

## GitHub Pages

Because the prototype is static HTML/CSS/JavaScript, it can be hosted directly with GitHub Pages.

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch and `/ (root)`.
5. Save.

## Demo mode

The welcome screen includes **Load demo profile**, which pre-fills a fictional private-investor example so the complete flow can be demonstrated quickly.

## Important

This is an educational concept prototype and is not a live HousingAnywhere service. Some UX elements, automated checks and verification actions are simulated to demonstrate the proposed future-state journey.
