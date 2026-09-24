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

The installed local Worker runtime supports dates through 2026-05-22; production is configured for 2026-09-23. To inspect the built artifact with that local limitation:

```sh
npx wrangler dev --config dist/server/wrangler.json --compatibility-date 2026-05-22 --port 3001
```

This does not change production configuration or verify the newer compatibility date. Restart this preview after rebuilding so its asset manifest is refreshed.

## Quality and decisions

- Readers struggled when key-pair mechanics preceded the user experience. The main example now starts with sign-in and reveals definitions inline. Actual comprehension still needs audience testing.
- Repeating the simulation in the detailed layer added another interaction without enough explanation. It is now a static reading guide with section anchors, numbered steps, protocol fields, and source links. The old playback implementation and its tests were removed with that feature.
- Definition buttons support Enter/Space and expose expanded state. Beginner step changes reset explanations and keep focus on the primary action.
- A broad disclosure style previously rotated nested headings. Expanded-icon styles now target the direct icon child.
- Keep the shared light palette and native `color-scheme: light`. Official logo sources are in `public/LOGO-SOURCES.md`.
- Git excludes dependencies, build output, environment files, browser artifacts, and caches. Repository pushes do not deploy the website.

`npm run check` and the production build are automated local checks. There is no installed CI workflow or current automated browser suite. Visual and interaction checks are performed separately in the browser. The former `npm test` command covered only the removed playback feature; it was replaced with `npm run check` in delivery commands.

The written-guide change passed type/lint and production build checks. Browser inspection covered desktop and 390px mobile layouts, wrapped signature/endpoint examples, section navigation, return navigation, disclosure collapse, and beginner sign-in progression. Keyboard checks confirmed section-anchor focus and the next source link. No horizontal overflow was observed on mobile. OS appearance switching, enlarged text, physical devices, and production deployment remain unverified.

## Next steps

1. Ask nondevelopers to explain what is saved, what is sent, and why a fake website cannot use the passkey after using the example.
2. Verify OS light/dark switching, 200% text enlargement, and physical devices; update the local runtime to support the production date.
3. Deploy only with explicit authorization, then run live smoke checks.
