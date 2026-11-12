# Authentication and registration UI

- /login: real session login, password visibility toggle, validation and API error states.
- /register: account-type selection, personal details, then business/organization application details where required. Staff roles are never offered. All inputs/selects use the shared AuthField/controlClass definitions in src/components/auth/AuthLayout.tsx (44px height, 1px border, consistent focus treatment).
- /verify-email: confirmation link with token in fragment or verification-email resend request.
- /super-admin: Super Admin overview, verification requests, users/staff controls and administrative audit activity.
- /admin: Platform Admin overview and verification requests only; staff management is excluded.
- /account: own profile, password changes and session logout.

The frontend never stores session tokens in browser storage. Auth calls include the server's HttpOnly cookie; mutating authenticated calls send the CSRF token loaded from the session response. Route screens check /auth/me; all actual role/status/ownership decisions are independently enforced by backend APIs. Requests that fail or cannot reach the backend show errors rather than fake authentication or synthetic dashboard counts.

The initial seed Super Admin must replace its temporary password (12?128 characters) before administration. Pending email verification blocks login; pending business/organization applications block management access. The backend's docs/access-control.md describes the initial scope, mail-delivery setup and future modules. An institution title does not set system privileges.

Use npm run dev in both repositories. Vite proxies /api to localhost:3001 and Vercel proxies /api to the backend before the SPA fallback. If VITE_API_BASE_URL is explicitly set it overrides this default; same-origin proxying is preferred so production session cookies are not dependent on cross-site cookie support. Deploy the frontend and backend changes together; this work has not been deployed.

Email sending requires the backend mail-adapter environment settings. Registration reports pending delivery truthfully when those are absent. Production administration still needs MFA and the operational controls described in the backend scope notes.

Validation: lint, typecheck, frontend tests and production build. New flow tests cover public-role choices, registration API payloads, mismatch validation, login failures, temporary-password gating and Platform Admin redirects. Browser checks cover consistent 44px/1px fields, desktop/mobile registration, real seed login/password-change gating and logout. Role-specific overview screenshots use intercepted test fixtures, not live platform statistics.
