# Passkey Lab

A plain-language passkey explainer at https://howdopasskeyswork.com. A compact dragon logo, FAQ anchor, and GitHub source link sit above the example, followed by the FAQ. There is no introductory hero. The default story simulates sign-in, a fake website, and passkey setup. Optional answers explain the mechanics, and “Show me how it works” reveals an 11-scene technical walkthrough with manual and silent Watch modes.

Everything is an educational simulation: no biometric data, real credentials, accounts, or authentication requests. Mystic Coders is the illustrative website; this does not claim it implements passkey sign-in. The site explains concepts, not a complete production implementation.

## Development and delivery

- `npm install`
- `npm run dev`: Vinext/Vite development at http://127.0.0.1:3000.
- `npm test`: automated playback clock and lesson-cycle regression checks.
- `npx tsc --noEmit`: TypeScript checks.
- `npm run build`: build the Cloudflare Worker and static assets.
- `npm run preview`: serve the compiled Worker locally.
- `npm run deploy`: tests, build, and Cloudflare deployment. Requires explicit owner authorization.
- `python3 scripts/smoke-production.py`: read-only live HTML and exact-byte favicon/logo checks. Run after deployment; it expects the current local version’s content.

Production is Cloudflare Worker `howdopasskeyswork`, with custom domain https://howdopasskeyswork.com. Preview URLs and workers.dev are disabled. The Cloudflare Vite plugin emits `.wrangler/deploy/config.json` pointing to `dist/server/wrangler.json`; static assets use the `ASSETS` binding. No database, runtime speech service, or OpenAI Sites resources are used.

Local runtime limitation: installed workerd supports dates through 2026-05-22, while production configuration uses 2026-09-23. For local artifact checks only, use:

```sh
npx wrangler dev --config dist/server/wrangler.json --compatibility-date 2026-05-22 --port 3001
```

This does not change the production configuration or verify the newer compatibility date.

## Design and behavior

- Lead with three sign-in moments: start, approve, success. Follow with fake-site and setup examples.
- Reveal private/public keys, challenges, signatures, and domain binding on request.
- Explain synced versus device-bound passkeys and recovery in everyday questions.
- Keep the approved light palette and `color-scheme: light`, including native controls.
- Watch mode supports pause/resume, restart, and 1×/1.5×/2× speeds. Closing the technical disclosure or hiding the browser tab pauses it. It has no narration or audio assets.
- Reduced-motion users retain scene progression without moving packets or pulsing icons.
- Official local logo sources are recorded in `public/LOGO-SOURCES.md`.

## Quality and decision record

- **Reading complexity:** Readers struggled with the original explanation. The working hypothesis was that unfamiliar vocabulary and a two-key diagram appeared before a familiar experience. The default now leads with actions and outcomes, with mechanics available on demand. Evidence: desktop/mobile render and interaction checks passed; comprehension still needs audience testing.
- **Disclosure styles:** An overly broad expanded-summary selector rotated a nested heading. Limit transforms to the direct icon child. The corrected expanded disclosure was visually inspected on mobile.
- **Keyboard transitions:** Unmounting a focused lesson panel previously lost focus. Arrow-driven lesson changes now transfer focus to the new panel. Manual checks use consecutive page-level keys, including the second key after each boundary and final wraparound. Beginner Back also retains focus when returning to the first moment.
- **Playback clock:** Deferred state updates previously lost elapsed time. The clock captures each delta; speed changes and pauses preserve position. Four automated regression tests cover deferred ticks, speed, resume, and lesson cycling.
- **Audio removal:** The owner requested removal of Pocket TTS. Removed the audio state/effects, narration controls, footer credit, eleven MP3s, manifest/attribution, generation script, freshness test/build hook, and audio smoke-check entries. Silent playback remains. Avoid keeping deployment checks or product claims for deleted features.
- **Hosting:** An earlier hosted-site workflow did not match the owner’s preference. Project instructions explicitly prohibit OpenAI Sites resources and require authorization for Cloudflare deployment.

Automated checks are local npm/TypeScript commands, not an installed CI workflow. Browser interactions and screenshots are separate manual evidence.

The beginner-flow update passed tests, type checking, focused lint, and the Worker build. Desktop story states, 390px mobile story/FAQ/disclosures, and the 320px initial story were inspected. Consecutive keyboard navigation across technical lesson boundaries and wraparound, beginner restart/Back, and pause-on-collapse passed. The built Worker rendered and hydrated locally using the compatibility-date override.

Still unverified: OS light/dark switching, 200% text enlargement, physical devices, audience comprehension, and execution under the production compatibility date. Current changes are not deployed.

## Next steps

1. Ask 3–5 nondevelopers to explain what is saved, what the website receives, and why a fake site cannot use the passkey after using the short story.
2. Consider a separate “Build this” layer for developers: registration/authentication endpoints, browser calls, stored credential data, server verification, sessions, and recovery. The existing technical walkthrough does not teach all of this.
3. Align the installed Worker tooling with the production date and check OS appearances/enlarged text.
4. Deploy only with explicit authorization, then run the live smoke checks.

Audio/header removal validation: all four playback tests, TypeScript, edited-source lint, and production build passed. Source and built assets have no audio directory. The compiled local preview advanced automatically, paused, and restarted without audio; desktop and 390px mobile layouts were inspected. The page opens directly on the example, and the story heading is now the page h1. Removing the narration control exposed a mobile flex layout problem; the playback button now occupies its own row so its label remains readable. The previous OS appearance, text-enlargement, physical-device, and compatibility-date limitations still apply. No deployment performed.

## Source repository

Source: https://github.com/mysticcoders/howdopasskeyswork. The compact header links to this public repository and to the FAQ below. Local dependencies, build output, environment files, browser artifacts, and caches are excluded from version control. Creating/pushing the repository does not deploy the Cloudflare Worker.

Compact-header validation: playback tests, TypeScript, edited-source lint, and Worker build passed. Desktop and 390px mobile header layouts were inspected; FAQ anchor and logo return-to-top navigation passed. Icons have accessible link names and 44px targets. Existing OS appearance/enlarged-text and local emulator date limitations remain.

Inline key definitions: the first mention of “private key” and “public key” in each beginner answer is an underlined disclosure button. Selecting a term expands its definition below the answer; selecting it again closes it, and changing steps or closing the parent answer resets the definition. This makes explanations available without entering the technical walkthrough. TypeScript, focused lint, and the Worker build passed. Manual desktop/390px mobile inspection, Enter/Space activation, switching definitions, collapse, and later-step behavior passed. OS appearance and enlarged-text checks remain unverified.
