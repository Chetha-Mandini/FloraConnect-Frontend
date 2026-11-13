# Super Admin implementation map

User creation, controlled role assignment and server-enforced per-user permission
grants are now implemented. See [User access management](user-access-management.md)
for the current contract and safeguards; it supersedes the original limitations below.

## Existing architecture

React/TypeScript, React Router, Tailwind and scoped CSS on the frontend; Express,
Mongoose and MongoDB on the backend. No Prisma schema is present. Existing entities:
User, Application, Organization, Membership, BusinessProfile, Session and AuditLog.
Cookie sessions, CSRF tokens, trusted origins, role middleware, password rotation,
and transactional application approvals are reused.

## Implemented routes and operations

- `/admin/*`: lazy-loaded Super Admin workspace. All data APIs under `/api/admin/*`
  require an authenticated, active, email-verified SUPER_ADMIN with no outstanding
  temporary-password requirement. The UI also checks the authenticated role.
- `/super-admin/*`: compatibility redirect to `/admin`.
- `/platform-admin`: existing restricted staff dashboard, using `/api/platform-admin`.
  This prefix only permits PLATFORM_ADMIN. Staff cannot access Super Admin APIs,
  user management, or audit logs.
- Overview: six actual database counts, pending approvals, recent audit activity,
  and registration charts. Analytics support 7/30/90 days and custom date ranges.
- Users: server pagination, search, status and sorting; details; name/phone/address
  edits; suspension/reactivation; user creation and controlled role/permission assignment. Mutations
  require reasons and confirmations. Account and staff changes revoke sessions.
- Organizations and businesses: paginated searchable directories and details.
- Verification: paginated application search, type/status filters, evidence links,
  and existing transactional approval/rejection with reasons.
- Roles: seven exact backend identifiers and actual assigned-user counts. Existing
  role ceilings and configurable per-user permissions come from the backend policy.
- Audit logs: paginated browsing of existing action, reason and timestamp records.
- Profile: existing authenticated profile API and verified password-change component.

Search values go in POST bodies, not browser URLs or query strings. All such
requests retain session, CSRF and origin protection. Requests are cancellable,
search is debounced, and lists return at most 20 records per page. Unsupported
modules show capability requirements rather than fabricated data.

## UUID rollout (required before deploying updated clients)

Administrative resources now have an immutable UUID v4 `publicId` with a unique
sparse index. Internal ObjectIds and foreign keys remain unchanged. API serializers
return `id: publicId`; mutations accept UUIDs only, never ObjectIds. There is no
fallback accepting internal IDs. UUIDs confer no authorization.

From the backend directory run `npm run migrate:public-ids` against the intended
database before deploying the updated frontend and backend. The repeatable script
assigns UUIDs only to records missing them, preserves references, and creates unique
indexes. This script is supplied but was not executed against a live database as
part of development. Existing clients using ObjectId resource URLs must be upgraded
with this API change. Do not share migration output containing record contents.

## Missing backend capabilities and proposed schema changes

These are proposals, not silently added production fields or implemented workflows:

| Domain                    | Required persistence and policies                                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Listings                  | UUID, approved seller reference, flower details, validated images, currency/price/stock, persistent publication status, owner-scoped mutations                             |
| Orders                    | UUID, buyer and seller references, immutable item snapshots and totals, status history, explicitly authorized correction transitions                                       |
| Posts/events              | UUID, organization/author references, draft approval preventing self-approval, publication state, event dates and cancellation policy                                      |
| Reports                   | UUID, reporter/target references, category/evidence, reviewer, notes and resolution history; no automatic removal                                                          |
| Settings                  | Validated persistent configuration, runtime enforcement, audit trail; registration switches must govern registration, security controls must govern sessions               |
| Permissions               | Permission identifiers and configurable role grants if needed; enforcement must precede editable UI                                                                        |
| Organizations/memberships | Transactional suspension effects, admin replacement and membership assignment policies, member directory APIs; detailed representative/document/address fields             |
| Businesses                | Transactional suspension effects and protected ownership APIs; extended profile fields and document policies                                                               |
| User profiles             | Separate first/last names, images, last-login and verification timestamps if required; existing model stores one name and verification boolean                             |
| Audit                     | Persist actor role, resource type, safe before/after values, result and request context; existing historical records store actor/target ObjectIds, action, reason and time |

Organization/business edits, suspensions, removals and membership reassignment are
not exposed as functioning controls until the above policies exist. Audit details
currently omit actor/target identity rather than disclose internal IDs or invent
historical fields. Orders and listing metrics cannot be computed from the reference
flower catalogue. There is no notifications API. MFA, global permission editing,
payments, refunds, tracking and retention-based removal are not implemented.
Controlled Super Admin grants require current-password verification and explicit
acknowledgement. Self-access changes and removal of the last active Super Admin
are blocked. Super Admin suspension remains blocked.

## Validation

Backend tests exercise session/role/CSRF/origin boundaries, transactional approvals,
UUID generation and validation, and explicit safe serialization. Frontend tests
exercise role redirects, temporary-password gating, private search bodies and
unsupported-domain states. Build/type/lint/format checks run locally. Real database
migration, live MongoDB transaction integration and visual browser/device validation
are separate deployment checks and have not been claimed as completed.
