# Passkey Lab

- Do not create OpenAI Sites resources. Deployments use the owner’s Cloudflare account and require explicit user authorization.
- Production target: Cloudflare Worker `howdopasskeyswork` at `https://howdopasskeyswork.com`. Local development is `npm run dev`; deploy with `npm run deploy` when authorized.
- Keep the explainer clearly labeled as a simulation; it must not collect biometric data or register real credentials.
- Preserve domain binding, signature verification, and synced/device-bound distinctions when editing explanations.
- The interface intentionally uses a light palette and `color-scheme: light` for native controls.
- The beginner example is the only interactive walkthrough. Keep the detailed layer a written explanation with in-page navigation and specification links. Test disclosures and navigation with consecutive page-level key presses.

- Lead the default explainer with the visitor’s sign-in experience. Keep key pairs, challenges, signatures, and providers in optional explanations; preserve technical accuracy there.
- When changing disclosure styles, scope expanded-icon transforms to the direct icon child. Verify nested headings stay upright, and pause media when its containing disclosure closes.
