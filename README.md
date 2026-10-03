# HousingAnywhere — Rental Platform Prototype v3.0

Educational prototype for the VU Amsterdam course **Introduction to E-Business & Online Commerce**.

## Goal

The prototype redesigns HousingAnywhere's private-landlord onboarding from a high-touch process into a scalable, guided digital journey for **Private Investors / On-the-Side Portfolio landlords**.

The core design principle is:

> Reduce unnecessary time and effort without removing the landlord's control over a valuable asset.

## v3.0 — tenants and landlords

- A landing-page switch provides full tenant and landlord views.
- Tenant view includes illustrative homes, city/budget filters, favourites saved on this device, and home previews linking to live HousingAnywhere searches.
- Navigation is now Benefits, Your journey, Costs & booking, and Help & answers.
- My Account opens a panel for saved homes, continuing the listing journey, and accessing the real platform account.
- A light blue-grey footer includes company, tenant, landlord, support, app store and social links.
- The step 5 kitchen photo is replaced with an actual kitchen.
- The existing nine-step landlord flow remains available. Commission is still shown at the final review, not step 6.

### Backups

The complete v2.0 site is preserved on [`backup/v2.0`](https://github.com/Ouahie/housinganywhere-onboarding-prototype/tree/backup/v2.0), at commit `52b32a8efc2e1e3c6cee6e9bb8415fb504275a18`, before any v3.0 changes.

The original pre-update build is preserved on `backup/pre-onboarding-updates-2026-10-03`.

## What changed in v2

The second prototype iteration brings the UI closer to HousingAnywhere's current public visual language and integrates the project research directly into the experience.

### Research-led design decisions

- **Value before effort** — the landlord sees the relevant benefits before entering data.
- **Segment early** — the flow identifies the small private-investor profile immediately.
- **Digital verification by default** — routine verification replaces the mandatory account-manager call in the current process.
- **Interactive policy education** — four key rules are explained with their purpose and a short comprehension scenario.
- **Progressive listing creation** — property, media, pricing and screening are split into manageable stages.
- **Media coaching** — transparency is translated into practical guidance for a listing that can replace a physical viewing.
- **Transparent fee explanation** — commission logic is visible before publication.
- **Landlord-controlled screening** — the platform structures documents and information while the landlord keeps the final decision.
- **Automated readiness check** — routine completeness and compliance checks are designed to happen before publication.
- **Exception-based human support** — staff intervention remains available when needed rather than being mandatory for every landlord.
- **Save and continue later** — prototype progress is saved locally in the browser.
- **Design-notes mode** — presentation mode can show the research rationale behind each screen.

## Prototype flow

1. Private-investor profile
2. Digital verification
3. Interactive platform rules
4. Property details
5. Media & listing transparency
6. Pricing & availability
7. Tenant requirements & screening
8. Listing preview & readiness check
9. Publish & next steps

## Key platform rules represented

- Communication and booking remain on-platform
- No physical viewings
- Listings must accurately represent the property
- The first payment is handled through the secure booking flow and landlord payout follows the move-in protection period

## Demo mode

On the welcome screen, choose **Try demo profile** to pre-fill a fictional two-property private investor.

Use **Show design notes** in the header to switch from a realistic landlord experience to a presentation mode that explains why each proposed design decision exists.

## Run locally

No build tools are needed.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

This is a static HTML/CSS/JavaScript prototype and can be hosted from the repository root using GitHub Pages.

## Source basis

The prototype is grounded in:

- the HousingAnywhere landlord-process material supplied for the VU project;
- the Challenge 2 requirements and private-investor persona;
- the Week 2 and Week 3 research completed for the project;
- current public HousingAnywhere information on landlord verification, secure payments, fees and platform scale.

## Important

This is an educational concept prototype and is not a live HousingAnywhere service. Verification, automated compliance checks, media coaching and other interactions are simulated to demonstrate the proposed future-state journey.

## Image credits

The new kitchen photograph is hosted locally as `assets/kitchen-v3.jpg` from [Unsplash](https://images.unsplash.com/photo-1556912172-45b7abe8b7e1) (image source: `photo-1556912172-45b7abe8b7e1`). The previous incorrectly labelled kitchen image is now named `assets/living-room-example.jpg` and used only as a living-room example. Room images, home prices and renter profiles are illustrative; they do not represent live listings or verified tenants.

Footer destinations follow the [official HousingAnywhere website](https://housinganywhere.com/). App download links point to its publisher listings on the App Store and Google Play.
