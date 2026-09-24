'use client';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Fingerprint, Globe, KeyRound, LockKeyhole, ShieldCheck, ShieldX } from 'lucide-react';

const moments = [
  { phase: 'CREATE IT · 1 OF 3', heading: 'First, connect a passkey to your account.', copy: 'Already have an account? Sign in the usual way, then choose “Create a passkey” in its security settings. New here? Some websites let you create one as you sign up.', action: 'Pretend to choose “Create a passkey”', question: 'Do I need a password first?', answer: 'Not always. An existing account needs an authorized way to add a passkey: that might involve a password, an email link, another passkey, or an already signed-in session. A new account can start with a passkey and no password. The website decides whether to check your email or identity too. For this example, imagine you have already signed in to your existing account.', screen: 'Your account settings', screenCopy: 'For this example, you have already signed in.', status: 'Add a new way to sign in', icon: 'key' },
  { phase: 'CREATE IT · 2 OF 3', heading: 'Choose where to save it. Give your OK.', copy: 'Your device offers places to save the passkey: a password manager, the device itself, or a security key. Choose one and approve, often with your face, fingerprint, or device PIN.', action: 'Pretend to approve creation', question: 'Am I choosing a new password?', answer: 'No. Your device or passkey provider creates a pair of related numbers for you: a private key and a public key. You do not invent, type, or memorize them. Unlocking your device approves this operation; it does not by itself tell the website which existing account belongs to you.', screen: 'Create a passkey', screenCopy: 'Choose an available place to save it.', status: 'Simulated approval · nothing is scanned', icon: 'fingerprint' },
  { phase: 'CREATE IT · 3 OF 3', heading: 'Saved. The website can recognize it now.', copy: 'Your device or provider creates the keys and keeps the secret part. The website saves the matching public part with your account, ready to check your next sign-in.', action: 'Come back and sign in', question: 'What went to the website?', answer: 'The public key and a credential ID go to the website as part of the registration response. The website checks the response before saving them with your account. Your device, password manager, or security key protects the private key; it is not sent to the website. Your face, fingerprint, and device PIN stay local too.', screen: 'Passkey saved', screenCopy: 'This account now has a passkey.', status: 'Setup complete · ready for another visit', icon: 'check' },
  { phase: 'USE IT · 1 OF 3', heading: 'Next visit: choose your saved passkey.', copy: 'You return to the same website and choose “Sign in with a passkey.” Your device finds the passkey you saved for it.', action: 'Try a pretend sign-in', question: 'Do I enter my old password too?', answer: 'Usually, no. A passkey can be the sign-in method itself, rather than an extra step after a password. Your device may ask you to unlock it to use the key. The website can still require additional checks under its own security rules.', screen: 'Welcome back', screenCopy: 'Use the passkey you just saved.', status: 'Sign in with a passkey', icon: 'key' },
  { phase: 'USE IT · 2 OF 3', heading: 'Your device asks for your OK.', copy: 'Approve using your face, fingerprint, or device PIN—just like unlocking your device. This lets it use your saved key to make proof for this sign-in.', action: 'Pretend to approve sign-in', question: 'Does my fingerprint go to the website?', answer: 'No. Your device checks it locally. It then uses the private key to make a digital signature for this sign-in. Your face, fingerprint, and device PIN are never sent to the website.', screen: 'Your device checks it’s you', screenCopy: 'Face, fingerprint, or device PIN', status: 'Simulated approval · nothing is scanned', icon: 'fingerprint' },
  { phase: 'USE IT · 3 OF 3', heading: 'You’re in.', copy: 'The website checks the proof using the public part it saved during setup. It matches, so you’re signed in. You did not send the secret part or type a password.', action: 'What if the website is fake?', question: 'How can the website check the proof?', answer: 'The website sends a fresh, one-time challenge. Your device signs data tied to that challenge and website using the private key. The website checks the signature with your public key, along with the challenge, website address, and required device checks. An old response cannot simply be reused.', screen: 'You’re signed in', screenCopy: 'The key saved during setup did the work.', status: 'Sign-in complete', icon: 'check' },
  { phase: 'A FAKE WEBSITE · 1 OF 2', heading: 'Same look. Different address.', copy: 'This pretend website copied the real one. Could it trick you into using your passkey?', action: 'Try the saved passkey', question: 'What does the address change?', answer: 'Your passkey is tied to the real website’s domain (its relying party ID). The browser checks which website is asking. An unrelated domain cannot request the real website’s passkey, even if its page looks identical.', screen: 'Welcome back', screenCopy: 'Looks familiar, doesn’t it?', status: 'Sign in with a passkey', icon: 'key', fake: true },
  { phase: 'A FAKE WEBSITE · 2 OF 2', heading: 'Your passkey won’t work here.', copy: 'Your browser spots the wrong website address. The fake site cannot use the real site’s passkey.', action: 'Start again: create a passkey', question: 'Does this stop every attack?', answer: 'Passkeys resist fake-site sign-in tricks, called phishing. They do not stop every attack: a compromised device, stolen signed-in session, or weak account recovery can still put an account at risk.', screen: 'No matching passkey', screenCopy: 'This is the wrong website.', status: 'The real site’s passkey stays safe', icon: 'blocked', fake: true },
];

type KeyTerm = 'private key' | 'public key';
const keyDefinitions: Record<KeyTerm, string> = {
  'private key': 'A secret number that makes your sign-in proof, called a digital signature. Your device, password manager, or security key protects it. It is never sent to the website. Some password managers securely sync it across your devices; a device-bound passkey stays on one device or security key.',
  'public key': 'The matching number the website keeps with your account. It checks signatures made by your private key. It can check the proof, but cannot make that proof or be used to work out your private key.',
};

function AnswerWithKeys({ text }: { text: string }) {
  const [openKey, setOpenKey] = useState<KeyTerm | null>(null);
  const parts = text.split(/(private key|public key)/g);
  return <>
    <p className="simple-answer">{parts.map((part, index) => {
      if ((part !== 'private key' && part !== 'public key') || parts.indexOf(part) !== index) return part;
      return <button key={part} type="button" className="key-term" aria-expanded={openKey === part} aria-controls={`definition-${part.replace(' ', '-')}`} onClick={() => setOpenKey(openKey === part ? null : part)}>{part}<span aria-hidden="true">{openKey === part ? ' −' : ' +'}</span></button>;
    })}</p>
    {(['private key', 'public key'] as const).filter(term => parts.includes(term)).map(term => <div key={term} id={`definition-${term.replace(' ', '-')}`} className="key-definition" hidden={openKey !== term}><h2>{term === 'private key' ? 'Your private key makes the proof.' : 'The public key checks the proof.'}</h2><p>{keyDefinitions[term]}</p></div>)}
  </>;
}

export function SimpleStory() {
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const moment = moments[step];
  const fake = moment.fake ?? false;
  const go = (next: number) => { setStep(next); setExpanded(false); primaryRef.current?.focus({ preventScroll: true }); };
  return <section className="simple-lesson" aria-labelledby="simple-title">
    <div className="simple-heading"><span className="eyebrow">CREATE IT. THEN USE IT.</span><span className="demo-label">Demo only · No real passkey is created</span></div>
    <div className="simple-layout">
      <div className="simple-copy">
        <p className="simple-progress">{moment.phase}</p>
        <div aria-live="polite" aria-atomic="true"><h2 id="simple-title">{moment.heading}</h2><p className="simple-description">{moment.copy}</p></div>
        <div className="simple-actions"><button ref={primaryRef} className="primary-button" onClick={() => go((step + 1) % moments.length)}>{moment.action}<ArrowRight size={18}/></button>{step > 0 && <button className="simple-back" onClick={() => go(step - 1)}><ArrowLeft size={16}/> Back</button>}</div>
        <button className="curiosity-button" aria-expanded={expanded} aria-controls="simple-detail" onClick={() => setExpanded(!expanded)}>{moment.question}<span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
        <div id="simple-detail" hidden={!expanded}>{expanded && <AnswerWithKeys key={step} text={moment.answer}/>}</div>
      </div>
      <div className={`pretend-browser ${fake ? 'pretend-fake' : ''}`} aria-label="Illustration of pretend passkey setup and sign-in">
        <div className="pretend-address"><Globe size={16}/><span>{fake ? 'mysticcoders-login.example' : 'mysticcoders.com'}</span><span className="example-tag">EXAMPLE</span></div>
        <div className="pretend-screen">
          <span className="pretend-brand">Mystic Coders</span>
          <div className={`pretend-symbol ${moment.icon === 'blocked' ? 'blocked-symbol' : ''}`}>{moment.icon === 'fingerprint' ? <Fingerprint size={42}/> : moment.icon === 'check' ? <Check size={42}/> : moment.icon === 'blocked' ? <ShieldX size={42}/> : <KeyRound size={42}/>}</div>
          <h3>{moment.screen}</h3>
          <p>{moment.screenCopy}</p>
          <div className="pretend-status">{moment.icon === 'blocked' ? <ShieldX size={18}/> : moment.icon === 'check' ? <ShieldCheck size={18}/> : <LockKeyhole size={18}/>}<span>{moment.status}</span></div>
        </div>
        <p className="pretend-caption">{moment.icon === 'fingerprint' ? 'Your face, fingerprint, and PIN stay on your device.' : fake ? 'A copied page cannot change the website’s address.' : 'A pretend account. Nothing to type or download.'}</p>
      </div>
    </div>
    <div className="simple-takeaway"><ShieldCheck size={19}/><p><strong>The thing to remember:</strong> Create it once for your account. Next time, approve to sign in. The secret part never goes to the website.</p></div>
  </section>;
}
