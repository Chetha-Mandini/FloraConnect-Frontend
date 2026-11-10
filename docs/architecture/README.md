# Frontend structure

```text
public/
  images/                  All local image files (photos, SVGs, favicon)
  credits/images.html      Public image attribution page
src/
  app/
    App.tsx                Router bootstrap
    routes.tsx             Client-side route definitions
    AppLayout.tsx          Shared shell for feature placeholders
    RouteLayout.tsx        Scroll reset for route changes
    routes.test.tsx        Route and client-side navigation tests
  pages/home/              Homepage and its presentation data
  pages/                   Feature placeholders and not-found page
  components/
    layout/Brand.tsx       Reusable branding
    ui/                    Shared Icon, Modal, and loading/error/empty states
  features/
    flowers/data/          Typed sample flower catalogue
    health/ApiStatus.tsx   Backend connection status UI
  hooks/                   Shared React hooks as needed
  config/env.ts            Environment-dependent API URL
  services/api/health.ts   HTTP health contract and validation
  styles/global.css        Theme and responsive styling
  main.tsx                 React bootstrap
  vite-env.d.ts            Vite type declarations
  types/                   Shared TypeScript types as needed
  utils/                   Framework-independent helpers as needed
docs/
  assets/image-sources.json Image source and license metadata
  architecture/            Folder conventions
  issues/                  Development backlog
```

## Conventions

- Add page-level screens under pages, reusable visual components under components, and feature-specific UI/data under features.
- Keep route definitions and application-wide composition under app; keep navigation with React Router links rather than full-page anchors.
- Keep HTTP calls in services/api and environment settings in config. Components should not duplicate backend URLs.
- Put shared hooks in hooks and shared types/utilities in types and utils; add these folders when the first shared modules are introduced.
- Keep every local image file in public/images. Reference it with /images/<filename>; Vite serves that folder unchanged. Preserve attribution under public/credits and metadata under docs/assets.
- Keep third-party image licenses intact; they are distinct from the project's source license.
- Use relative imports. Backend code must not be imported into the frontend.
- Run npm run lint, npm run typecheck, npm run format:check, npm test, and npm run build after changes. Generated dist and dependencies are not source folders.
