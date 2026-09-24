# Passkey Lab

An educational explainer for https://howdopasskeyswork.com. Source: https://github.com/mysticcoders/howdopasskeyswork.

A compact header leads to one beginner simulation, everyday FAQs, and an optional **written technical guide**. The guide explains registration, sign-in, signatures, server verification, domain binding, synced/device-bound storage, and illustrative implementation endpoints, with links to primary documentation. There is no second interactive mode, playback, or narration.

Everything is a simulation or explanation. No biometric data, real credentials, accounts, or authentication requests are created. Mystic Coders is the illustrative website; this does not claim it implements passkey sign-in. The endpoint names in the guide are examples, not working backend routes.

## Development and delivery

- `npm install`
- `npm run dev`: Vinext/Vite development, normally at http://127.0.0.1:3000.
- `npm run check`: TypeScript and focused lint of the application components.
- `npm run build`: compile the Cloudflare Worker and static assets.
- `npm run preview`: serve the compiled Worker locally.
- `npm run deploy`: check, build, and deploy. Requires explicit owner authorization.
- `python3 scripts/smoke-production.py`: read-only live HTML and exact-byte favicon/logo checks after deployment.

Production is Cloudflare Worker `howdopasskeyswork` with the custom domain above. The Vite plugin emits `.wrangler/deploy/config.json` pointing to `dist/server/wrangler.json`; static assets use the `ASSETS` binding. No database or OpenAI Sites resources are used.

The checked-in compatibility date is `2026-05-22`, matching the installed Workers runtime. Both `npm run dev` and built previews use that date; no override is needed. Advance it only alongside a runtime update that supports it, and verify both commands. The deployed Worker uses the same compatibility date.

```sh
npm run dev
# Or, after npm run build:
npx wrangler dev --config dist/server/wrangler.json --port 3001
```

Restart the built preview after rebuilding so its asset manifest is refreshed.

## Quality and decisions

- Readers struggled when key-pair mechanics preceded the user experience. The main example uses everyday actions and reveals definitions inline. It now includes account authorization and creation before sign-in. Actual comprehension still needs audience testing.
- Repeating the simulation in the detailed layer added another interaction without enough explanation. It is now a static reading guide with section anchors, numbered steps, protocol fields, and source links. The old playback implementation and its tests were removed with that feature.
- Definition buttons support Enter/Space and expose expanded state. Beginner step changes reset explanations and keep focus on the primary action.
- A broad disclosure style previously rotated nested headings. Expanded-icon styles now target the direct icon child.
- Keep the shared light palette and native `color-scheme: light`. Official logo sources are in `public/LOGO-SOURCES.md`.
- Git excludes dependencies, build output, environment files, browser artifacts, and caches. Repository pushes do not deploy the website.

`npm run check` and the production build are automated local checks. There is no installed CI workflow or current automated browser suite. Visual and interaction checks are performed separately in the browser. The former `npm test` command covered only the removed playback feature; it was replaced with `npm run check` in delivery commands.

The written-guide change passed type/lint and production build checks. Browser inspection covered desktop and 390px mobile layouts, wrapped signature/endpoint examples, section navigation, return navigation, disclosure collapse, and beginner sign-in progression. Keyboard checks confirmed section-anchor focus and the next source link. No horizontal overflow was observed on mobile. OS appearance switching, enlarged text, physical devices, remain unverified. Production deployment is recorded below.

## Latest delivery

- Deployed commit `59aec6f`, including the data fragments and review corrections, to `https://howdopasskeyswork.com`. Cloudflare version: `32e193f4-f490-4363-ad83-2ba15ac7cdd6`. Type/lint and build checks passed. Extended production smoke checks confirmed the corrected hash, all three examples, Windows Hello wording, a single h1, the walkthrough h2, and five exact asset matches. Live browser checks confirmed walkthrough progression and the rendered corrected response fragment.

- Earlier release: deployed reviewed guide commit `97f0d8a` to Cloudflare Worker `howdopasskeyswork`, version `cc3b38b0-bbe2-4882-814c-5bbf485b21ea`. Production HTTPS/content checks and five exact asset comparisons passed; the live beginner sign-in and guide disclosure worked in the browser.
- Data fragments now deployed: decoded registration public key, a 32-byte example challenge represented as base64url, and a shortened sign-in response with the matching challenge. Direction labels and explicit fictional/decoded labels prevent confusing these with complete wire payloads. Never include a private key in a website-bound example.
- Follow-up validation: type/lint and production build passed; all three fragments inspected at desktop and 390px mobile widths. Long values wrap within their cards. OS light/dark switching, enlarged text, and physical devices remain unchecked.

## Review corrections

- The illustrative authenticator-data prefix now matches SHA-256 of `mysticcoders.com` (`JUCtq-qS…`). The earlier copied prefix described a different RP ID. Derive domain-dependent example bytes from the domain shown in the guide; a direct Node crypto calculation confirmed the correction.
- The storage FAQ includes device-local storage such as Windows Hello. The header is the stable page h1, and changing walkthrough titles are h2 elements with their existing appearance.
- Development failed because configuration requested a newer compatibility date than the installed runtime supported. The shared date now matches that runtime; check ordinary development startup as well as builds after future runtime changes.
- Removed the unused Google PNG and empty Python cache directories; logo provenance identifies the served WebP. Python caches were already ignored by Git.

Review-fix validation: `npm run check` and `npm run build` passed. `npm run dev -- --port 3002` served the page, and the built Worker started on port 3003 without a date override. Desktop/mobile browser inspection confirmed preserved heading appearance and readable Windows Hello wording; the accessibility tree exposed the stable h1 and changing h2. These corrections are now deployed; see Latest delivery.

## Creation-first walkthrough (deployed)

Readers could not tell where the first passkey came from because the walkthrough assumed one already existed. It now has eight moments: three for account authorization and creation, three for a later sign-in, and two for a fake site. An existing account must authorize enrollment; a new account can start with a passkey without first having a password. Device approval and website account checks are explained separately. FAQ and technical-guide text follow the same order.

Type/lint and production build checks passed. Desktop inspection covered all eight moments; consecutive page-level Enter presses crossed phase boundaries and wrapped back to creation with focus retained. Mobile inspection covered creation, saved confirmation, prerequisite disclosure, key definitions, FAQ and technical setup text. Back resets disclosures; keyboard opening private/public definitions leaves only one open. OS theme switching, enlarged text, physical devices, and reader comprehension remain unverified. The production smoke script now checks the creation-first heading. Deployment of commit `db8f053` passed type/lint, build, HTTPS content and five exact asset checks. Live browser verification confirmed creation and the subsequent sign-in with consecutive keyboard presses. Cloudflare version: `7a2e569f-c2db-485f-95c2-b6be9b1e4780`.

## Intro sentence (pending deployment)

Added one plain-language comparison of a passkey and password directly above the example. Type/lint and build passed; the introductory layout was inspected at desktop and 390px mobile widths. OS theme switching and enlarged text remain unchecked.

## Next steps

1. Review the live creation-first walkthrough; ask nondevelopers how the first passkey is created, which account it belongs to, what is sent, and why a fake site cannot use it.
2. Verify OS light/dark switching, 200% text enlargement, and physical devices; evaluate a coordinated runtime and compatibility-date upgrade.
3. Run the extended production smoke checks after each authorized deployment.
