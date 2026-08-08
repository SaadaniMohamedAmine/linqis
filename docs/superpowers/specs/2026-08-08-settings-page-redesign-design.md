# Settings page redesign + navigation wiring

## Problem

`/dashboard/settings` exists and works (profile, preferences, API keys, billing,
Notion export, danger zone all fetch/save correctly) but:

1. It's not reachable from anywhere in the UI — no link in `SidebarNav` or `UserMenu`.
2. It renders its own vertical 260px `<aside>` category nav *inside* the main
   content area, stacked next to the global 280px dashboard sidebar — a visual
   "double sidebar" that doesn't match any other page in the app.
3. The category buttons in that aside are dead — no click handlers, only
   "Profile" ever shows as active. No section switching actually happens; every
   section just renders stacked in one long scroll.
4. Visually it does not match the premium language already established on
   `/dashboard`, `/dashboard/integrations`, `/dashboard/analytics`,
   `/dashboard/developers` (hero header with blurred glow accents, `Card`
   components with hover glow, staggered `animate-fade-in-up`, `Badge` status
   pills).

## Goals

- Make Settings reachable: add it to `SidebarNav` and to the `UserMenu` dropdown.
- Eliminate the double-sidebar: drop the internal vertical aside entirely, so
  the global sidebar is the only sidebar on this page.
- Replace it with a horizontal, sticky tab bar for the 5 categories, with real
  tab-switching (one section visible at a time), matching the premium visual
  language used elsewhere in the app (hero header, glows, `Card`, `Badge`,
  staggered fade-in-up).
- Preserve all existing data/business logic untouched (fetching via `getUser`,
  saving via `updateUser`, billing portal redirect, Notion fields) — this is a
  presentation/navigation change, not a behavior change.

## Non-goals

- No changes to `/dashboard/page.tsx` (already redesigned).
- No new API routes or backend changes.
- No changes to what data is collected/saved, only how it's organized in the UI.

## Design

### Navigation wiring

- `src/components/sidebar-nav.tsx`: add `{ href: "/dashboard/settings", label: "Settings", icon: Settings }`
  (lucide-react `Settings` icon) to the `LINKS` array, after `Analytics` and
  before the role-gated `DEVELOPERS_LINK` append. Visible to every workspace
  member (not role-gated), same active-state logic as existing links
  (`pathname.startsWith(href)`).
- `src/components/user-menu.tsx`: add a `Settings` link item (lucide-react
  `Settings` icon) between the name/email block and the `Sign Out` item,
  separated by the existing `DropdownMenu.Separator` pattern. Rendered as
  `DropdownMenu.Item asChild` wrapping a `Link` to `/dashboard/settings`, styled
  like a neutral menu item (`text-text-primary`, `hover:bg-surface`) to
  distinguish it from the danger-styled Sign Out.

### Page structure (`src/app/dashboard/settings/page.tsx`)

Top to bottom:

1. **Hero header** — same pattern as `integrations`/`dashboard`: relative
   `border-b border-border` container, absolute blurred glow blob(s)
   (`bg-success/10 blur-[120px]`), `max-w-[1440px] mx-auto px-8 py-10`, title
   "Settings" + one-line description, `animate-fade-in-up`.
2. **Horizontal tab bar** — sticky under the hero (`sticky top-16 z-10
   bg-background border-b border-border`), five tabs: Profile, Preferences,
   API Keys, Billing, and Danger Zone. Danger Zone is visually separated (pushed
   right with `ml-auto` or a `border-l border-border` divider) and rendered in
   `text-danger` even when inactive, to keep the "this one is different" signal
   the old design had. Active tab: `text-success` + bottom border/underline
   accent (`border-b-2 border-success`), matching the color language used for
   active state in `SidebarNav`. Tab state is local `useState<TabId>`.
3. **Tab panel** — `max-w-[800px] mx-auto` content area, `animate-fade-in-up`,
   renders only the active tab's section(s):
   - **Profile**: unchanged content (avatar, name, email inputs) inside `Card`.
   - **Preferences**: unchanged content (AI Summary Length segmented control,
     Email Notifications toggle) inside `Card`.
   - **API Keys**: OpenAI key card (unchanged) **plus** the Notion Integration
     card (API key + database ID inputs, unchanged) stacked below it — both
     external-credential concerns live in this one tab now.
   - **Billing**: unchanged content (plan status, upgrade/manage button).
   - **Danger Zone**: unchanged content (Clear Data / Delete Account cards).
4. **Save bar** — bottom action bar with "Save Changes" / saved-state text,
   shown only when the active tab is Profile, Preferences, or API Keys (the
   tabs whose fields are covered by `handleSave`). Hidden on Billing and Danger
   Zone, which already have their own inline actions.

### Visual consistency checklist (must match existing pages, not invent new patterns)

- `Card` component for every section container (no bespoke panel styling).
- `Badge` for any status pill if needed (none strictly required here, but keep
  available for consistency if a status indicator is added later).
- Icon-in-rounded-square treatment (`w-10/12 h-10/12 rounded-lg bg-*-bg
  flex items-center justify-center text-*`) for any section-lead icon, same as
  `integrations` cards.
- Staggered `animate-fade-in-up [animation-delay:150ms]` etc. between hero,
  tab bar, and panel content, same cadence as `dashboard`/`integrations`.
- Reuse existing `Button` variants (`primary`/`secondary`/`danger`) — no new
  button styles.

## Data flow

No change. `SettingsPage` keeps all existing state and handlers
(`getUser`/`updateUser`/`handleManageBilling`/`handleSave`). Only the
rendering/layout changes: sections move from "all stacked" to "one active tab
rendered", and the container chrome changes from vertical aside to horizontal
sticky tabs under a hero header.

## Testing

- Manual verification: navigate via sidebar link and via user avatar dropdown,
  confirm both land on `/dashboard/settings`.
- Manual verification: switching tabs shows only the relevant section, active
  tab styling updates, Danger Zone stays visually distinct.
- Manual verification: Save Changes still persists Profile/Preferences/API Keys
  edits (existing `handleSave` behavior unchanged); Billing/Danger Zone actions
  still work as before.
- `npm run typecheck` (or equivalent) passes.
