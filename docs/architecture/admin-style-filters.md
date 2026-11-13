# Admin visibility and cosmetic filter collisions

The dashboard's generic `ad-*` class names collide with eight exact generic
selectors in [EasyList's primary filter source](https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_general_hide.txt):
`ad-root`, `ad-main`, `ad-sidebar`, `ad-panel`, `ad-heading`, `ad-detail`,
`ad-notice`, and `ad-primary`.

Applying those cosmetic rules to the deployed frontend reproduced a completely
white `/admin` page at desktop and mobile widths. React still had one root child,
the dashboard's heading existed but was invisible, and no JavaScript page errors
were raised. This explains why an empty-root detector does not catch this failure
mode. Test authentication and database responses were simulated; the selectors
were the exact matching rules from the source above.

All dashboard CSS classes, animation names, and component references now use the
`fc-admin-*` namespace. With the same eight rules applied, the updated production
build displays the dashboard at 1440 px and 390 px widths with no JavaScript errors.
A component regression verifies the heading and sidebar remain visible with those
rules active. Session handling and backend authorization are unchanged.

The independent startup guard also detects hidden main content and presents
`APP_CONTENT_HIDDEN` outside the React root. A browser test deliberately hiding
all `main` elements confirmed the recovery panel remains visible. The guard removes
that diagnostic when the content becomes visible again.

The user reported that disabling ad blocking did not resolve their specific case,
so this confirmed class-name collision is not claimed as the sole cause of their
authenticated production failure. After deployment, remaining hidden-content
issues should produce a visible diagnostic rather than a silent white screen.

Validation: lint, TypeScript, production build, and 97 tests passed. Chromium
fixture results:

| Build / viewport                   | Heading visible with matching rules | Page errors |
| ---------------------------------- | ----------------------------------- | ----------- |
| Deployed build / 1440 px           | No                                  | None        |
| Deployed build / 390 px            | No                                  | None        |
| Updated production build / 1440 px | Yes                                 | None        |
| Updated production build / 390 px  | Yes                                 | None        |

Screenshots use simulated QA accounts and records, not production account data:

- [Reproduced white screen](../../public/images/admin-filter-before-fixture.png)
- [Updated desktop](../../public/images/admin-filter-desktop-fixture.png)
- [Updated mobile](../../public/images/admin-filter-mobile-fixture.png)
