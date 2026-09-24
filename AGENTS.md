# Passkey Lab

- Do not create OpenAI Sites resources. Deployments use the owner’s Cloudflare account and require explicit user authorization.
- Production target: Cloudflare Worker `howdopasskeyswork` at `https://howdopasskeyswork.com`. Local development is `npm run dev`; deploy with `npm run deploy` when authorized.
- Keep the explainer clearly labeled as a simulation; it must not collect biometric data or register real credentials.
- Preserve domain binding, signature verification, and synced/device-bound distinctions when editing explanations.
- The interface intentionally uses a light palette and `color-scheme: light` for native controls.
- Keyboard navigation QA must use consecutive page-level key presses across panel boundaries, without locator actions that refocus elements between presses. Check the second key after each transition and the final wraparound.

- Lead the default explainer with the visitor’s sign-in experience. Keep key pairs, challenges, signatures, and providers in optional explanations; preserve technical accuracy there.
- When changing disclosure styles, scope expanded-icon transforms to the direct icon child. Verify nested headings stay upright, and pause media when its containing disclosure closes.
