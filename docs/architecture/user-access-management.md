# Super Admin user and permission controls

Users now has an Add user action and a role/permission editor in each other user's
details. Both are backed by the protected API contract described in the companion
backend's `docs/admin-user-access.md`.

The backend provides all seven role choices, their scopes and supported permission
IDs through `/admin/console/access-policy`. The forms show only permissions within
the selected role, preserve mandatory account capabilities and require explicit
acknowledgement for Super Admin elevation. They collect a reason and the acting
administrator's current password for every creation/access change.

Organization roles select an approved organization through debounced, paginated
search and record organization position separately. Business roles collect the
required name/contact/location fields. Editing preloads the actual access context.
Backend validation enforces the same boundaries regardless of browser state.

New users remain pending verification and must change their temporary password
at first login. The form and saved response describe actual verification state;
email-delivery failure does not pretend the new account is ready to sign in.
Passwords stay in request bodies and are not returned, logged, persisted to browser
storage, or placed in URLs. Access changes revoke the target's existing sessions.

The Roles & Permissions page replaces static boundary notes with a backend-backed
seven-role comparison, actual user counts, available permissions and access-management
guidance. Individual grants can narrow these role ceilings. Global role definitions
remain code-controlled; unsupported operations are not fake editable permissions.
Tables retain readable column widths and scroll horizontally on small screens.

The profile menu is a controlled accessible menu. Outside pointer events, focus
moving outside, Escape and navigation close it. Escape restores trigger focus;
Arrow keys/Home/End navigate its actions. Long account dialogs retain close controls
while scrolling, and native dialog cancellation respects unsaved/busy guards.

The Platform Admin screen starts on a permitted page instead of requesting a
revoked overview, disables unauthorized review controls, and links accounts without
administrative page grants to their own account. Revoked profile editing hides the
edit form while preserving password controls. Server enforcement remains decisive.

## Validation

- All 108 frontend tests passed, including the existing shared action-button fix
  (#43), which keeps first-login password changes usable in admin layouts.
- Lint, TypeScript and production builds passed.
- Chromium production-build fixtures at 1440 px and 390 px verified outside-click
  and Escape menu closing, limited staff creation, an organization member whose
  President position does not elevate the system role, saved feedback, and all
  seven role-policy rows. No JavaScript page errors occurred.
- Browser account/API responses and backend integration transactions/mail are
  simulated. No production users, passwords, roles or live hosting settings were changed.
- Existing formatting issues remain in untouched registration/global-style files.

Deploy the companion backend first or alongside this frontend. There are no new
production frontend secrets. Activation uses the existing verification mail adapter;
without configured delivery, account creation succeeds pending verification and the
UI reports the limitation explicitly.
