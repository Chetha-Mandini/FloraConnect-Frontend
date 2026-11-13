# Admin login loading fix

The post-login transition previously discarded the authenticated user returned by
login, waited for a second session request, downloaded a lazy dashboard route with
no initial route fallback, and waited for summary and analytics sequentially.
Supplying a cancellation signal also replaced the API client's default deadline,
allowing stalled requests to remain pending indefinitely.

The login response now provides a 30-second, memory-only handoff. The session hook
immediately renders that server-confirmed account while revalidating it against
`/auth/me`. Expired or denied sessions clear the handoff; logout and password
changes clear it as well. No authorization state is taken from URLs or browser
storage. All privileged API requests retain backend session/role checks.

The dashboard chunk begins preloading while login is in progress. Initial route
loading, navigation, and route failures have visible feedback and recovery options.
Summary and chart requests run concurrently; summary cards render as soon as the
summary response arrives. API requests combine unmount cancellation with a 15-second
deadline instead of dropping the deadline.

## Browser performance evidence

Chromium via Python Playwright, production frontend builds, fresh desktop and
mobile browser pages. Authenticated responses are fixtures; no real administrator
credentials or production account data were used. Measurements start at Sign in
click and include a simulated 300 ms login response. Session verification and chart
responses were each deliberately delayed by 5 seconds; summary by 150 ms.

| Page and viewport                           | Workspace visible | Primary metrics visible |
| ------------------------------------------- | ----------------: | ----------------------: |
| Existing deployed build, 1440 × 1000        |           6.006 s |                11.067 s |
| Existing deployed build, 390 × 844          |           6.014 s |                10.938 s |
| Updated local production build, 1440 × 1000 |           0.899 s |                 0.916 s |
| Updated local production build, 390 × 844   |           0.891 s |                 0.916 s |

No JavaScript page errors were observed. The updated build met the two-second
target in these controlled tests. Baseline assets came from the deployed host and
updated assets from localhost; asset transfer conditions therefore differ. These
measurements do not guarantee a two-second production login on every connection,
especially when the login response itself or serverless cold starts exceed that
budget. Direct visits and refreshes still require server session verification.
Production authenticated verification requires the fix to be deployed.

Automated regressions cover the full login transition with verification/charts
still pending, independent summary rendering, expired/revoked handoffs, route
loading/recovery feedback, and deadlines with cancellation signals.

Screenshots below show simulated QA accounts and records, not production data:

- [Desktop fixture](../../public/images/admin-loading-desktop-fixture.png)
- [Mobile fixture](../../public/images/admin-loading-mobile-fixture.png)
