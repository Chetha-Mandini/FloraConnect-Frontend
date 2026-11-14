# FloraConnect Frontend

develop branch deployed link 
FE - https://flora-connect-frontend-qemd.vercel.app/
BE - https://flora-connect-backend-infr.vercel.app/api/health
A responsive community homepage built with React, TypeScript, Vite, Tailwind CSS, React Router, Motion for React and Lucide.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:5173. In a second terminal, run `npm run dev` inside `../FloraConnect-Backend`. The backend requires its own `npm install` on a fresh checkout. MongoDB defaults to `mongodb://localhost:27017/floraconnect`; set `MONGODB_URI` in the backend environment to change it. The API health endpoint and homepage remain usable if MongoDB is unavailable.

## Checks

```sh
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
npm run preview
```

The production bundle is generated in `dist/`. On Vercel, select Vite, build with `npm run build` and use `dist` as the output directory. Keep the existing SPA route rewrites. Do not edit generated backend or frontend `dist` files.

## Homepage and routes

The homepage follows the approved reference with an organic Nymphaea nouchali water-lily hero, four quick links, featured flowers, a grower community section, an upcoming events empty state and a curved forest-green footer. Entrances and hover effects respect reduced-motion preferences. Fonts use Inter and Playfair Display with system fallbacks.

`/flowers` supports `?q=` search and `?category=` variety filtering over explicitly labeled sample data. Header search and all four category cards use these filters. `/growers` and `/events` show empty directories until verified records are available. `/contact`, `/privacy` and `/terms` clearly indicate unpublished content. Existing `/login`, `/register`, `/associations` and `/announcements` routes retain their preview behavior. The grower CTA passes `?application=grower` for future registration integration. Unknown paths render the existing 404 page.

## Implementation files

- `src/pages/home/HomePage.tsx`: homepage composition.
- `src/components/home/HomeSections.tsx`: reusable sections, section headings and motion reveals.
- `src/components/layout/Navbar.tsx`, `Footer.tsx`, `Brand.tsx`: shared responsive application shell.
- `src/pages/FlowerCataloguePage.tsx`: searchable sample catalogue.
- `src/pages/CommunityPage.tsx`: empty states for unpublished directories and platform information.
- `src/styles/global.css`: design tokens, responsive layouts and reduced-motion styling.
- `src/app/routes.tsx`: application routes.
- `src/app/routes.test.tsx`: routing, menu and search regression tests.

See [architecture conventions](docs/architecture/README.md) for the full folder structure.

## Backend connection

The footer checks the configured API health endpoint with a ten-second timeout. Copy `.env.example` to `.env.local` for local development. `VITE_API_BASE_URL` is the public API base; `API_PROXY_TARGET` configures the local Vite proxy. On Vercel keep `VITE_API_BASE_URL=/api` and configure server-only `BACKEND_API_BASE_URL` to the HTTPS backend API base. The included serverless proxy preserves same-origin cookie sessions without a fixed backend hostname. Other hosts need an equivalent same-origin proxy. Set backend `FRONTEND_ORIGINS` to the exact HTTPS frontend origin and `FRONTEND_URL` for verification emails. Only the explicitly allowed public API base is exposed by Vite; credentials belong exclusively in backend environment variables.

## Assets and remaining integrations

Local images are in `public/images`. The current national-flower hero shows three blue-violet Nymphaea nouchali water lilies in AI-generated reference-inspired artwork. The original pink-lotus hero is retained as an unused source asset. The original lotus photograph and sunflower photograph are CC0 assets; attribution and existing photo licenses are preserved at `/credits/images.html` and `docs/assets/image-sources.json`. The existing grower artwork is AI generated and does not depict a verified platform member.

No statistics, events, contacts or social URLs are invented. Supply verified email/phone details, social URLs, approved legal policies, and live grower/event APIs to enable those features. Authentication and event APIs do not exist in the current backend; existing login and registration remain clearly labeled previews. The registration role query is not yet consumed by an account service.

## License

Copyright (c) 2026 TourGo organization. All rights reserved.

No use, copying, modification, distribution, or sublicensing is permitted without prior written permission from TourGo organization. See [LICENSE](LICENSE). Third-party image licenses remain separate.

## Events and footer reference update

The pre-footer section uses two image cards for event categories, with unknown-date badges and an explicit unpublished-events notice. These are not scheduled events. The five-column forest-green footer matches the approved reference with a curved edge, divider lines, script tagline and paired botanical branches. Social marks are decorative until verified profile URLs are supplied; they are not interactive links. Existing API health checking and image credits remain available. Generated event images and their full prompts are documented in `docs/assets/event-artwork-prompts.md`.

## Expanded flower catalogue

`/flowers` includes all 464 named entries from the user-supplied BioExplorer excerpt, plus existing catalogue varieties not already named in the list (469 unique named entries in total). Common-name aliases remain separate where they appear separately in the supplied list; this is not a count of distinct biological species. Descriptions are supplied reference excerpts, not live product listings or verified Sri Lankan cultivation/medical advice.

The catalogue uses five columns at 1400px and wider, four on laptops, three on tablets and one or two on phones. Search, collection filters, A-Z browsing, sorting, URL-backed pagination (40 cards per page) and full-description dialogs work together. Existing homepage category links and header search remain supported.

Data lives in `src/features/flowers/data/flower-reference.json`; the typed catalogue merges it with existing entries in `flowers.ts`. Representative botanical photos are downloaded into `public/images/catalogue`. Per-image author/license metadata is stored in `flower-images.json`, displayed in the detail dialog and published at `/credits/catalogue-images.html`. An explicit botanical fallback is used where no suitable licensed image is available, and image-load failures use the same fallback.

The one-time import helpers use Python's standard library and add no runtime dependencies:

```sh
python scripts/import_flower_reference.py /path/to/supplied-excerpt.txt
python scripts/fetch_flower_photos.py
```

The importer excludes navigation, related-article headings and plant-order classification headings. It preserves the supplied descriptions and only extracts scientific names where explicitly given. The photo helper uses Wikipedia plant pages and Wikimedia Commons license metadata, skips disambiguation pages and unsupported licenses, caches successful local downloads, and never runs in a visitor's browser. Imported facts and representative photography can still require botanical editorial review. Source/count provenance is recorded in `docs/assets/flower-reference-import.json`.

## Catalogue refinement

The starting-letter filter is now a compact dropdown instead of the long A-Z button row. Flower profiles open in a centered, responsive photo-and-description dialog with a sticky close button, background scroll locking and expandable source/photography credits. Every one of the 464 supplied reference entries now has a locally saved, licensed photograph; common-name and cultivar entries may use a labeled representative taxon. An error fallback remains for failed image loads.

## Supplementary flower references

The eight supplied follow-up attachments were audited by `scripts/merge_flower_supplements.py`. Two are identical WFO background articles rather than individual-flower lists. The six A-F BioExplorer guides contain 191 flower entries, all already present in the catalogue. The fuller descriptions are merged by canonical ID from `flower-supplements.json`; no new cards were needed and the catalogue remains at 469 entries. Per-profile source links now point to the corresponding letter guide. Name matching normalizes case, accents, hyphens and straight/curly apostrophes, with the original canonical names, IDs and photos preserved. This is name-level duplicate prevention, not a claim to resolve every taxonomic synonym or merge genus-level and species-level entries.

The complete attachment audit, content hashes, source URLs and matches are in `docs/assets/flower-supplement-audit.json`. The original imported reference excerpts remain preserved separately. Re-run the merge helper with paths to supplied text files as arguments to reproduce the comparison.

## Shared links on Vercel

The root `vercel.json` rewrites application paths to `/index.html` so React Router can resolve direct visits and refreshes, including `/flowers`, `/growers` and `/events`. Existing static assets remain served from the build output. After changing this configuration, deploy the updated branch to Vercel; an older deployment retains its previous routing rules.

Verify the deployment by opening `/flowers` in a new tab and refreshing it, then checking that its JavaScript, stylesheet and flower images load normally. Unknown application routes should display FloraConnect's own not-found page.
