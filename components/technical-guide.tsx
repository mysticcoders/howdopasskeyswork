function DataFragment({ title, direction, children, note }: { title: string; direction: string; children: string; note: string }) {
  return <figure className="guide-packet">
    <figcaption><span className="eyebrow">{direction}</span><h4>{title}</h4></figcaption>
    <pre><code>{children}</code></pre>
    <p>{note}</p>
  </figure>;
}

const exampleChallenge = 'qGtaOP6qT7LOKxtrsd-koChtLA69XJ9ltWH-sw9r7U8';

export function TechnicalGuide() {
  return <details className="technical-layer" id="technical-details">
    <summary><div><span className="eyebrow">CURIOUS ABOUT THE DETAILS?</span><h2>What happens at every step</h2><p>The full explanation: who does what, what gets sent, and what the server checks.</p></div><span aria-hidden="true">+</span></summary>
    <article className="technical-guide" aria-label="Detailed explanation of passkeys">
      <p className="guide-intro">The example above shows what signing in feels like. Here is what happens behind those moments, including the setup that comes first. This is a written explanation; it does not create a credential or run an authentication request.</p>
      <nav className="guide-nav" aria-label="Detailed explanation sections"><a href="#passkey-roles">Who does what</a><a href="#passkey-setup">1. Save a passkey</a><a href="#passkey-signin">2. Sign in</a><a href="#passkey-fake">3. A fake website</a><a href="#passkey-building">Building it</a></nav>

      <section id="passkey-roles" className="guide-section" tabIndex={-1}>
        <h3>First, separate the three jobs.</h3>
        <dl className="guide-terms">
          <div><dt>The website’s server</dt><dd>Also called the <em>relying party</em>. It manages your account, asks for proof, and decides whether a response is valid.</dd></div>
          <div><dt>Your browser</dt><dd>Connects the website to the passkey system through WebAuthn, the browser’s authentication API. It knows the page’s actual origin and enforces which website can request which credential.</dd></div>
          <div><dt>The authenticator</dt><dd>The part that creates and uses the keys. It may be provided by your device, a password manager, or a physical security key. Your page’s JavaScript does not get access to its private key.</dd></div>
        </dl>
        <p>There are two related keys. The <strong>private key makes a signature</strong>; the <strong>public key verifies it</strong>. A signature proves that the matching private key was used for particular data. This is not “encrypt with one key and decrypt with the other.” HTTPS separately protects the connection.</p>
        <p className="guide-source">Background: <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API" target="_blank" rel="noreferrer">MDN’s WebAuthn overview ↗</a></p>
      </section>

      <section id="passkey-setup" className="guide-section" tabIndex={-1}>
        <span className="eyebrow">BEFORE THE PRETEND SIGN-IN</span><h3>1. Save a passkey for your account.</h3>
        <ol className="guide-steps">
          <li><h4>The server prepares a registration request.</h4><p>For an existing account, it first checks that you are allowed to add a sign-in method. It creates an unpredictable challenge and associates it with this registration attempt. It sends the browser the challenge, website identity, user identifier, supported algorithms, and credential preferences.</p></li>
          <li><h4>The browser asks to create a credential.</h4><p>The page calls <code>navigator.credentials.create()</code> with <code>publicKey</code> options. The browser checks the website’s eligibility and lets you choose an available passkey provider.</p></li>
          <li><h4>You approve; the authenticator creates the key pair.</h4><p>Your face, fingerprint, or device PIN can authorize the operation locally. The credential is scoped to the website’s relying party ID. The private key stays protected by the authenticator or provider.</p></li>
          <li><h4>The server validates and saves the result.</h4><p>The browser returns a credential ID, client data, and an attestation object containing registration information, including the public key. The server verifies the expected challenge, origin, RP ID and required flags, and processes attestation according to policy. It then links the verified credential to the account.</p></li>
        </ol>
        <DataFragment title="The public key goes to the website here." direction="SETUP · BROWSER → SERVER" note="Illustrative decoded view, with values shortened by …; this is not a complete response or a usable key. The public key is inside the attestation object’s authenticator data, encoded as a COSE key. These labels translate its numeric fields into words. The server extracts and stores it after validating registration.">{`credential ID: kY7p…Q2w
attestationObject → authData
  → credentialPublicKey:
      key type: EC2
      algorithm: ES256
      curve: P-256
      x (hex): 9f2c7a81…
      y (hex): 4b18d6e3…`}</DataFragment>
        <p>The two coordinates, <code>x</code> and <code>y</code>, describe this example’s public key. They are safe for the website to receive. The private key is not part of the registration response.</p>
        <p className="guide-source">Registration details: <a href="https://developers.google.com/identity/passkeys/developer-guides/server-registration" target="_blank" rel="noreferrer">Google’s server registration guide ↗</a></p>
        <aside className="guide-callout"><h4>What gets stored?</h4><p>The server keeps the credential ID, public key, account association, counter and relevant credential metadata. It does not store your private key, fingerprint, face, or device PIN.</p><p>A synced passkey may become available on other supported devices through your provider. A device-bound passkey stays on its authenticator. These are different storage choices; “the private key never goes to the website” does not mean “it can never be synced.”</p><p className="guide-source"><a href="https://fidoalliance.org/passkeys/" target="_blank" rel="noreferrer">FIDO: synced and device-bound passkeys ↗</a></p></aside>
      </section>

      <section id="passkey-signin" className="guide-section" tabIndex={-1}>
        <span className="eyebrow">THE THREE MOMENTS IN THE EXAMPLE</span><h3>2. Use the saved passkey to sign in.</h3>
        <ol className="guide-steps">
          <li><h4>“You want to sign in”: request a fresh challenge.</h4><p>The server generates a new random challenge for this attempt. It keeps enough state to check the response later. A previously recorded response will not match a fresh challenge. The server must enforce expiration and single use; the browser’s prompt timeout alone does not do that.</p><p>The page calls <code>navigator.credentials.get()</code> with the server’s options. A website can identify an account first and list permitted credential IDs, or let a discoverable passkey identify the account.</p></li>
          <li><h4>“Your device asks for your OK”: select and authorize the key.</h4><p>The browser and authenticator locate a credential for the requested relying party. If user verification is required, an appropriate local check must succeed. A touch showing that someone is present and a PIN or biometric check verifying the user are distinct signals.</p></li>
          <li><h4>The authenticator makes the cryptographic proof.</h4><p>It signs the authenticator data together with a hash of the browser’s client data. The client data includes the challenge and page origin; authenticator data includes an RP ID hash and flags. That binds the proof to this attempt and website context.</p><div className="guide-formula"><code>signature = Sign(privateKey, authenticatorData || SHA256(clientDataJSON))</code></div><p>Here, <code>||</code> means joining bytes. The private key is used to calculate the signature; it is not included in the response.</p></li>
          <li><h4>“You’re in”: the server verifies before creating a session.</h4><p>The browser returns the credential ID, signature, authenticator data, client data and, when provided, user handle. The server looks up the saved public key and checks the signature plus the expected challenge, origin, RP ID and required presence/verification flags. It checks account ownership and processes counters and backup flags according to policy.</p><p>Only after successful verification does the application establish its normal signed-in session. An unresolved, cancelled, expired or invalid response must not sign anyone in.</p></li>
        </ol>
        <DataFragment title="A challenge looks like random text." direction="SIGN-IN · SERVER → BROWSER" note="A fictional request-options fragment. This full example challenge represents 32 random bytes written as base64url text. Base64url is a way of writing bytes, not encryption. The challenge is not a password or secret; it must be unpredictable and fresh for each attempt.">{`{
  "challenge": "${exampleChallenge}",
  "rpId": "mysticcoders.com",
  "userVerification": "required"
}`}</DataFragment>
        <DataFragment title="The response ties the proof to that challenge." direction="SIGN-IN · BROWSER → SERVER" note="Illustrative response fragments, unpacked for reading; … marks shortened values. In JSON transport, binary fields such as clientDataJSON, authenticatorData and signature are commonly base64url strings. Here clientDataJSON is decoded so you can see the same challenge coming back. These fragments are not a valid signed response.">{`credential ID: kY7p…Q2w

clientDataJSON (decoded):
{
  "type": "webauthn.get",
  "challenge": "${exampleChallenge}",
  "origin": "https://mysticcoders.com",
  "crossOrigin": false
}

authenticatorData (base64url):
  SZYN5YgO…
signature (base64url):
  MEUCIQDx…`}</DataFragment>
        <p>The credential ID tells the server which saved public key to use. Matching the challenge alone is not enough: the server also checks the signature and website context. The public key was saved during setup; it does not need to be sent again for this sign-in. The private key is never sent to the website.</p>
        <p className="guide-source">Data formats: <a href="https://www.w3.org/TR/webauthn-3/#sctn-attested-credential-data" target="_blank" rel="noreferrer">Registration public key ↗</a> · <a href="https://www.w3.org/TR/webauthn-3/#dictdef-collectedclientdata" target="_blank" rel="noreferrer">Client data fields ↗</a>.</p>
        <p className="guide-source">Protocol checks: <a href="https://www.w3.org/TR/webauthn-3/#sctn-verifying-assertion" target="_blank" rel="noreferrer">WebAuthn assertion verification ↗</a>. Server flow: <a href="https://developers.google.com/identity/passkeys/developer-guides/server-authentication" target="_blank" rel="noreferrer">Google’s authentication guide ↗</a>.</p>
      </section>

      <section id="passkey-fake" className="guide-section" tabIndex={-1}>
        <span className="eyebrow">WHY THE LOOKALIKE FAILS</span><h3>3. Try the same passkey on a fake website.</h3>
        <p>Our real example uses <code>mysticcoders.com</code>. The unrelated <code>mysticcoders-login.example</code> cannot simply claim that RP ID. The browser validates the request against the actual origin, regardless of the page’s logo or wording.</p>
        <p>If the fake page requests a credential for its own domain, it does not get the real site’s credential. If it registers a new key, the real server has not registered that public key for your account. A copied response is also tied to its original challenge and context.</p>
        <p>An RP ID is a domain identifier; an origin also includes the scheme and port. Legitimate subdomains can share an eligible parent RP ID, and WebAuthn defines explicit related-origin arrangements. A lookalike spelling alone grants no access.</p>
        <p>Passkeys protect this sign-in exchange. They do not fix a compromised device, a stolen session cookie, or weak account recovery.</p>
        <p className="guide-source"><a href="https://www.w3.org/TR/webauthn-3/" target="_blank" rel="noreferrer">WebAuthn specification ↗</a> · <a href="https://fidoalliance.org/passkeys/" target="_blank" rel="noreferrer">FIDO’s passkey overview ↗</a></p>
      </section>

      <section id="passkey-building" className="guide-section" tabIndex={-1}>
        <span className="eyebrow">CONNECTING THIS TO AN IMPLEMENTATION</span><h3>Four server operations, plus your account system.</h3>
        <p>These are illustrative endpoint names, not endpoints implemented by this demo. A WebAuthn library can generate options and verify responses; your application still owns account authorization, challenge lifetime, credential storage, sessions, and recovery.</p>
        <dl className="guide-endpoints">
          <div><dt><code>POST /passkeys/register/options</code></dt><dd>Authorize enrollment, create a registration challenge, and return creation options.</dd></div>
          <div><dt><code>POST /passkeys/register/verify</code></dt><dd>Verify the browser’s registration response and save the credential against the authorized account.</dd></div>
          <div><dt><code>POST /passkeys/signin/options</code></dt><dd>Create an authentication challenge and return request options.</dd></div>
          <div><dt><code>POST /passkeys/signin/verify</code></dt><dd>Verify the assertion, consume the challenge, update credential metadata, and establish the session.</dd></div>
        </dl>
        <p>Browser APIs work with binary data. JSON transport needs suitable encoding and decoding; a browser library can handle that conversion and the WebAuthn calls. Handle cancellation and unsupported environments in the UI. Credential management and recovery need their own application flows.</p>
        <p className="guide-source">Implementation references: <a href="https://simplewebauthn.dev/docs/packages/server" target="_blank" rel="noreferrer">SimpleWebAuthn server ↗</a> · <a href="https://simplewebauthn.dev/docs/packages/browser" target="_blank" rel="noreferrer">SimpleWebAuthn browser ↗</a> · <a href="https://www.w3.org/TR/webauthn-3/#sctn-registering-a-new-credential" target="_blank" rel="noreferrer">Complete registration requirements ↗</a></p>
      </section>
      <a className="guide-top" href="#technical-details">Back to the start of the detailed explanation ↑</a>
    </article>
  </details>;
}
