# Develop deployment environment

The `develop` frontend is https://flora-connect-frontend-qemd.vercel.app and its
backend is https://flora-connect-backend-infr.vercel.app.

In the development frontend Vercel project, set these **Config** values in the
environment used by the deployment, then redeploy:

```dotenv
VITE_API_BASE_URL=/api
BACKEND_API_BASE_URL=https://flora-connect-backend-infr.vercel.app/api
```

If `develop` is a Preview branch in the existing project, scope these values to
Preview / `develop`. If it is the Production branch of a separate development
project, scope them to that project's Production environment. Do not overwrite the
existing main deployment's backend setting. Branch names alone do not select
Vercel environment-variable scopes.

The browser uses same-origin `/api`; the server adapter selects the backend from
environment configuration and forwards origin, session and CSRF headers. This
avoids cross-site session cookies between the two Vercel domains. Configure the
backend's exact origin allowlist as described in its companion deployment guide.
Never put MongoDB credentials or other private values in `VITE_*` settings.

Local paired development uses `.env` with `VITE_API_BASE_URL=/api` and
`API_PROXY_TARGET=http://localhost:3001`; start the backend with `npm run dev` and
then run `npm run dev` here. The local proxy uses `API_PROXY_TARGET`, whereas the
Vercel server adapter uses `BACKEND_API_BASE_URL`. To deliberately test the remote
development backend locally, set `API_PROXY_TARGET` to
`https://flora-connect-backend-infr.vercel.app` and restart Vite; the backend must
then explicitly allow the local browser origin in an appropriate nonproduction
test environment.

Check `/api/health` through both the frontend and backend after redeployment, then
test sign-in and role-protected navigation. Health is a liveness check and does not
verify database readiness or account credentials.

On 2026-11-14 the frontend HTML returned 200, but its `/api/health` returned 500
and the backend `/api/health` returned Vercel `FUNCTION_INVOCATION_FAILED`.
This is an observed hosted runtime failure, not proof of a specific missing
variable. Inspect backend function logs for the first startup exception. Check the
deployed commit and environment values; malformed `FRONTEND_ORIGINS` can throw
during module initialization. Do not disable origin checks to mask this failure.
Local environment files do not update Vercel settings.
