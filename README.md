# FloraConnect Frontend

A responsive FloraConnect frontend built with React 19, TypeScript, Vite, Tailwind CSS, and React Router.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:5173, or the URL printed by Vite. Copy `.env.example` to `.env.local` to override the API base URL for local work; the example points to the local backend. Run the backend with `npm run dev` in FloraConnect-Backend to enable the live connection status. The sample page remains usable when the backend is unavailable.

## Checks and production preview

```sh
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
npm run preview
```

Use `npm run format` to format project files. ESLint checks code quality; Prettier handles consistent formatting. `npm test` runs the focused route tests and `npm run test:watch` runs them in watch mode. The production build is generated in `dist/`. `npm start` is also available as an alias for the local production preview.

## Routes

Client-side navigation is configured in `src/app/routes.tsx`. The homepage is `/`; the feature placeholders are `/flowers`, `/associations`, `/announcements`, `/login`, and `/register`. Unknown paths render the dedicated 404 page. Feature pages are intentionally placeholders; full feature implementations are outside the scope of this foundation.

## Environment variables

`VITE_API_BASE_URL` overrides the API base URL and must include `/api`. When it is unset, development uses `http://localhost:3001/api` and production uses the existing FloraConnect API URL. Vite exposes `VITE_` variables in browser code, so never put credentials, private keys, or other secrets in them.

## Files

- `src/pages/home/HomePage.tsx`: reference-inspired home page, local flower search/category filtering, flower detail dialogs and responsive navigation.
- `src/styles/global.css`: responsive styles.
- `src/main.tsx`: React entry point.
- `index.html`: document title and metadata.
- `vite.config.ts`: Vite, React, and Tailwind configuration.
- `public/images/flowers.jpg`: floral image from Unsplash (photo-1490750967868-88aa4486c946).

Grower profiles are sample content. The join button shows a coming-soon message and does not store or submit information.

For Vercel, select the Vite framework preset, use `npm run build`, and set the output directory to `dist`.

`.gitignore` excludes dependencies, build output, caches, local environment files, logs, editor settings, and test reports. Keep `package-lock.json` committed for reproducible installations.

## Backend connection

The footer checks `/api/health` with a ten-second timeout and offers Retry on failure. Development defaults to `http://localhost:3001/api`; production defaults to `https://flora-connect-backend-gules.vercel.app/api`. Override the base URL with `VITE_API_BASE_URL` in `.env.local` or Vercel environment settings, then restart/rebuild. Include `/api` in the URL. Do not put secrets in VITE variables. No environment changes are needed for the current production domains. Preview deployments require their exact origin to be allowed by the backend.

## License

Copyright (c) 2026 TourGo organization. All rights reserved.

No use, copying, modification, distribution, or sublicensing is permitted without prior written permission from TourGo organization. See [LICENSE](LICENSE).

## Home page design

The botanical homepage includes a custom SVG wordmark, an AI-generated grower hero, six illustrative flower cards, responsive navigation, search/filter controls and accessible native dialogs. Login, registration, associations, notices, marketplace and events show clearly marked previews until their APIs are implemented. Existing API health checking remains in the footer.

Images are served locally from `public/images/`. Third-party image attribution and original license links are available at `/credits/images.html`; these assets retain their original licenses. The hero is an AI-generated illustration and does not depict a verified platform member. No production membership totals, association partnerships or government endorsement are claimed.

## Code organization

See [folder structure and conventions](docs/architecture/README.md). Routes and app composition live in `src/app`; pages live in `src/pages`; reusable UI and layout components live in `src/components`; shared hooks belong in `src/hooks`; feature-specific code lives in `src/features`; API access lives in `src/services/api`; environment configuration lives in `src/config`; shared types and utilities belong in `src/types` and `src/utils` as the application grows. All local image files are in `public/images`; attribution is served at `/credits/images.html` and source/license metadata is in `docs/assets/image-sources.json`.
