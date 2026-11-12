# API and registration security configuration

API addresses and role names visible to a browser are public information. They are
not passwords or access tokens. Authorization comes from the server-side session,
account state and role checks on every protected request. UUIDs are opaque resource
identifiers and do not grant access.

## Configuration

- Frontend `VITE_API_BASE_URL`: public API base, normally `/api` to preserve same-origin cookie sessions. Direct HTTPS API bases are allowed for deployments whose cookie policy supports them.
- Frontend server `BACKEND_API_BASE_URL`: private HTTPS upstream API base used by the Vercel proxy. It is never bundled into browser code. The proxy forwards only supported API path shapes and authentication headers, limits body size, rejects redirects, and returns generic transport errors. Backend RBAC and CSRF checks still apply.
- Local `API_PROXY_TARGET`: backend origin for Vite development/preview forwarding.
  Copy `.env.example` to `.env.local` and set this for a local backend. It is not a
  browser environment variable.
- Backend `FRONTEND_ORIGINS`: exact comma-separated frontend origins, without paths,
  wildcards or credentials. Production requires HTTPS and permits no browser origins
  if this setting is absent. Include each authorized preview origin explicitly.
- Backend `FRONTEND_URL`: frontend origin used for verification emails. It must be
  configured when mail delivery is enabled; production requires HTTPS.
- Database credentials, email webhook credentials and bootstrap passwords belong
  only in backend environment settings or ignored local files. No credential value
  should be prefixed with `VITE_`.

The fixed production API proxy destination was replaced with a server-side adapter. Before redeploying, keep frontend `VITE_API_BASE_URL=/api`, configure server-only `BACKEND_API_BASE_URL` in the frontend hosting environment, and set `FRONTEND_ORIGINS` and `FRONTEND_URL` on the backend. Rebuild the frontend after changing its public API base. Local environment
files and live hosting settings were not changed automatically.

Only `VITE_API_BASE_URL` is explicitly exposed by Vite. Broad `VITE_*` environment
exposure is disabled. API base URLs reject embedded credentials, query strings,
fragments and insecure production transports. Component API paths are centralized
in `src/config/api.ts`; resource path builders require UUIDs and allowlisted domains.

## Registration contract

Public registration sends `registrationKind` with one of `personal`, `florist`,
`grower`, or `organization`. These are application intents, not system roles.
The backend maps them to its internal account/application types and always creates
an unverified `USER`. Business/organization privileges still require the existing
transactional approval workflow. Organization positions never grant system roles.

The old `accountType` registration input is deliberately rejected. Clients using
it must migrate to `registrationKind`. Unknown top-level fields (including role,
permissions, IDs and verification state) and unknown nested application fields are
rejected. Registration does not accept privileged system role names as intents.
The grower link now uses `?application=grower`; a `role` URL parameter has no effect.

## Privileged operations and secrets

Super Admin endpoints require active verified sessions, server-side SUPER_ADMIN
authorization and completed temporary-password rotation. Mutations retain CSRF and
trusted-origin checks. Staff grants/revocations additionally require the acting
administrator's current password and are rate limited. Their audit records omit
that password and password hash. Mutations reject unexpected fields, and session
revocation follows account status/staff changes.

Credential-bearing API fetches do not follow redirects, bypass browser caches and
send no referrer. Frontend deployment and API responses include anti-framing,
MIME-sniffing and referrer protection headers. Environment files and common private
key formats are ignored by Git. This does not remove any previously published
credential from history or revoke it; no repository-history scan or credential
rotation is claimed by this implementation.
