# Blank-page startup recovery

## Evidence and limits

The current production build was confirmed to contain the previous loading fix.
A clean Chromium browser redirects unauthenticated `/admin` visits to login. Both
the ordinary Super Admin route and temporary-password route render when tested
against simulated server responses. The user's authenticated blank screen has
not been reproduced with their real account; Permissions-Policy warnings alone
do not establish its cause.

A separate production fault was reproduced: requesting a nonexistent
`/assets/*.js` resource returned HTTP 200 with `Content-Type: text/html` because
the catch-all SPA rewrite returned `index.html`. Missing chunks after a deployment
must not be treated as application documents.

## Changes

- Exclude API and static resource prefixes from the SPA HTML rewrite. Preserve
  deep links such as `/admin/users`. The negative-lookahead pattern follows
  [Vercel's rewrite configuration](https://vercel.com/docs/project-configuration/vercel-json).
- Add static initial content inside `#root`, plus a script-independent JavaScript
  requirement message. The document is no longer visually empty before React starts.
- Load a small unbundled startup guard before the hashed application module.
  Script/preload failures attempt one reload, capped to once per five minutes
  using a session timestamp. Persistent failures show recovery controls instead
  of a reload loop. No tokens, account data, or roles are stored.
- Detect an empty React root and expose `APP_RENDER_EMPTY` after 1.5 seconds.
  Stalled initialization exposes `APP_STARTUP_INCOMPLETE`. This guard can render
  outside the React root even when the application cannot mount.
- Add an application-level error boundary outside the router. Render failures
  expose `APP_RENDER_FAILED` and reload/login controls without printing exception
  details, secrets, or user records in the recovery interface.

## Validation

Production-build Chromium tests deliberately aborted the actual entry bundle:

| Scenario                         | Result                                                           |
| -------------------------------- | ---------------------------------------------------------------- |
| First entry bundle request fails | Exactly one automatic reload, then login renders                 |
| Bundle fails again after reload  | Exactly two requests, visible `ASSET_LOAD_FAILED`; no loop       |
| Root becomes empty after startup | Visible `APP_RENDER_EMPTY` recovery within two seconds           |
| JavaScript disabled              | Static startup content and JavaScript requirement remain visible |

96 unit/component tests passed, including SPA path exclusions and root error
boundary behavior. Lint, TypeScript, and the production build passed. Existing
formatting failures remain in untouched `AuthLayout.tsx` and `global.css`.

The browser tests use a local production build, not the affected user's session.
Actual Vercel rewrite behavior and the affected account must be checked after
deployment. If the user's problem persists, the visible diagnostic distinguishes
failed assets, incomplete startup, an empty root, and a render failure.

Recovery screenshots contain no production account data:

- [Desktop recovery fixture](../../public/images/startup-recovery-desktop-fixture.png)
- [Mobile recovery fixture](../../public/images/startup-recovery-mobile-fixture.png)
