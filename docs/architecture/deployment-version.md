# Check the deployed frontend version

After deployment, open `/build-info.json` on the exact frontend domain being
tested. It contains only the source commit, branch and build timestamp. Vercel's
Git metadata is preferred; local builds use the checked-out Git revision. No
environment secrets, database settings or tokens are published.

Compare `commit` with the head of `develop`. A missing endpoint or older commit
means the domain still points to a deployment without the latest changes. A build
in Preview does not automatically update a project's Production domain. Verify
the project, deployment status and branch/domain assignment in Vercel.

The HTML shell revalidates in browsers and is not cached by the CDN; hashed assets
retain their existing caching behavior. Build metadata is also served without
caching and is excluded from the SPA fallback.

These changes help detect outdated releases and avoid stale HTML after a release.
They cannot unblock a queued Vercel deployment or promote a Preview deployment.
On 2026-11-14 the development domain served an older bundle while GitHub reported
the latest Vercel deployment as pending. A successful deployment remains required.
