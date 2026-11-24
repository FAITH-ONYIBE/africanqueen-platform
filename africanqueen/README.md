# africanqueen

Offline-first Progressive Web App (Next.js 14, TypeScript, Tailwind). Frontend only: all data is mock and
all "server" calls go through one stub, so a real backend can be connected later.

## Run
```
npm install
npm run build
npm start        # http://localhost:3000  (the service worker only registers in production)
```
`npm run dev` works for development (no service worker).

## Demo accounts (login page has "Fill ... login" buttons)
| Role   | Email                        | Password   |
|--------|------------------------------|------------|
| Member | amara@africanqueen.demo      | member1234 |
| Admin  | admin@africanqueen.demo      | admin1234  |

You can also register a new member on /join (stored in this browser only).

## Areas
- Public: Home, Courses, Events, Leaderboard, Donate (demo form), Opportunities (+ detail and apply), Mentors (+ profile and request), About, Contact, Log in, Join
- Member (/dashboard): Overview, Profile, Community, Announcements, Directory, Resources, Mentorship, Saved and offline, Notifications, Settings
- Admin (/admin): Overview, Users, Opportunities (create/edit/delete, feeds the public page), Content (announcements), Mentorship (requests and mentors)

## Offline design
- `public/sw.js`: precaches core routes and their JS/CSS on install; network-first for pages with cache fallback; cache-first for hashed assets and images (no repeat downloads); `/offline` fallback.
- IndexedDB (`lib/offline/db.ts`) stores: `saved` (bookmarks with offline text), `drafts` (application drafts, autosaved), `outbox` (queued actions), `submissions` (history/status), `kv` (local app state).
- `lib/offline/actions.ts: submitAction()` is the single entry for server-dependent actions (event registration, applications, mentor requests, messages, posts, connections). Online it sends at once; offline it queues and shows "Queued". `PwaProvider` replays the queue when the connection returns.
- Login, registration, password change and donation are blocked offline with a clear message (they cannot be queued safely).

## Connecting a backend later
Replace the body of `lib/api/client.ts: sendQueuedAction()` with a real `fetch`, replace `lib/auth/session.ts` with real auth,
and swap the `lib/mock-data/*` + `useKV` seeds for API calls. Components do not need to change.

## Important honesty notes
- Authentication here is a front-end demo (session in localStorage). It is not secure and must be replaced by server-side auth.
- The sync step is a simulated delay; no data leaves the browser.
- Photos are placeholders. Add files to `public/images` and pass `src="/images/x.jpg"` to `<Photo>` (see components/home/*, components/donate/CampaignCard.tsx, lib/mock-data/courses.ts).
- Colours live in `tailwind.config.ts` (`brand` block).
