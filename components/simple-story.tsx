'use client';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Fingerprint, Globe, KeyRound, LockKeyhole, ShieldCheck, ShieldX } from 'lucide-react';

const moments = [
  { heading: 'You want to sign in.', copy: 'Imagine you already saved a passkey for this website. Let’s use it.', action: 'Try a pretend sign-in', question: 'What is saved, exactly?', answer: 'Your password manager or security key keeps a secret called a private key. The website keeps a matching public key that can check proof from it. The public key cannot be used to work out your private key.' },
  { heading: 'Your device asks for your OK.', copy: 'Use your face, fingerprint, or device PIN—just like unlocking your device. This gives it permission to use your saved key.', action: 'Pretend to approve', question: 'Does my fingerprint go to the website?', answer: 'No. Your device checks it locally. It then uses the private key to make a digital signature for this sign-in. Your face, fingerprint, and device PIN are never sent to the website.' },
  { heading: 'You’re in.', copy: 'Your device sent proof that it has the right key. The website checked it and signed you in. No password to remember or type.', action: 'What if the website is fake?', question: 'How can the website check the proof?', answer: 'The website sends a fresh, one-time challenge. Your device signs data tied to that challenge and website using the private key. The website checks the signature with your public key, along with the challenge, website address, and required device checks. An old response cannot simply be reused.' },
  { heading: 'Same look. Different address.', copy: 'This pretend website copied the real one. Could it trick you into using your passkey?', action: 'Try the saved passkey', question: 'What does the address change?', answer: 'Your passkey is tied to the real website’s domain (its relying party ID). The browser checks which website is asking. An unrelated domain cannot request the real website’s passkey, even if its page looks identical.' },
  { heading: 'Your passkey won’t work here.', copy: 'Your browser spots the wrong website address. The fake site cannot use the real site’s passkey.', action: 'How do I get a passkey?', question: 'Does this stop every attack?', answer: 'Passkeys resist fake-site sign-in tricks, called phishing. They do not stop every attack: a compromised device, stolen signed-in session, or weak account recovery can still put an account at risk.' },
  { heading: 'Save it once. Use it next time.', copy: 'On a website that supports passkeys, choose “Create a passkey,” pick where to save it, and approve on your device. Then it’s ready for your next visit.', action: 'Try the story again', question: 'Can I use it on another device?', answer: 'Synced passkeys can be made available on other supported devices by your password manager. Device-bound passkeys stay on one device or physical security key. Have another sign-in or recovery option ready in case you lose access.' },
];

type KeyTerm = 'private key' | 'public key';
const keyDefinitions: Record<KeyTerm, string> = {
  'private key': 'A secret number that makes your sign-in proof, called a digital signature. Your password manager or security key protects it. It is never sent to the website. Some password managers securely sync it across your devices; a device-bound passkey stays on one device or security key.',
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
  const fake = step === 3 || step === 4;
  const go = (next: number) => { setStep(next); setExpanded(false); primaryRef.current?.focus({ preventScroll: true }); };
  return <section className="simple-lesson" aria-labelledby="simple-title">
    <div className="simple-heading"><span className="eyebrow">THE 30-SECOND VERSION</span><span className="demo-label">Demo only · No real passkey is created</span></div>
    <div className="simple-layout">
      <div className="simple-copy">
        <p className="simple-progress">{step < 3 ? `SIGNING IN · ${step + 1} OF 3` : fake ? `THE FAKE WEBSITE · ${step - 2} OF 2` : 'READY TO TRY IT FOR REAL?'}</p>
        <div aria-live="polite" aria-atomic="true"><h1 id="simple-title">{moment.heading}</h1><p className="simple-description">{moment.copy}</p></div>
        <div className="simple-actions"><button ref={primaryRef} className="primary-button" onClick={() => go((step + 1) % moments.length)}>{moment.action}<ArrowRight size={18}/></button>{step > 0 && <button className="simple-back" onClick={() => go(step - 1)}><ArrowLeft size={16}/> Back</button>}</div>
        <button className="curiosity-button" aria-expanded={expanded} aria-controls="simple-detail" onClick={() => setExpanded(!expanded)}>{moment.question}<span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
        <div id="simple-detail" hidden={!expanded}>{expanded && <AnswerWithKeys key={step} text={moment.answer}/>}</div>
      </div>
      <div className={`pretend-browser ${fake ? 'pretend-fake' : ''}`} aria-label="Illustration of the pretend sign-in">
        <div className="pretend-address"><Globe size={16}/><span>{fake ? 'mysticcoders-login.example' : 'mysticcoders.com'}</span><span className="example-tag">EXAMPLE</span></div>
        <div className="pretend-screen">
          <span className="pretend-brand">Mystic Coders</span>
          <div className={`pretend-symbol ${step === 4 ? 'blocked-symbol' : ''}`}>{step === 1 ? <Fingerprint size={42}/> : step === 2 ? <Check size={42}/> : step === 4 ? <ShieldX size={42}/> : <KeyRound size={42}/>}</div>
          <h3>{['Welcome back', 'Your device checks it’s you', 'You’re signed in', 'Welcome back', 'No matching passkey', 'Create a passkey'][step]}</h3>
          <p>{['Your passkey is ready to use.', 'Face, fingerprint, or device PIN', 'Your saved key did the work.', 'Looks familiar, doesn’t it?', 'This is the wrong website.', 'Save with your password manager or security key.'][step]}</p>
          <div className="pretend-status">{step === 4 ? <ShieldX size={18}/> : step === 2 ? <ShieldCheck size={18}/> : <LockKeyhole size={18}/>}<span>{['Sign in with a passkey', 'Simulated approval · nothing is scanned', 'Sign-in complete', 'Sign in with a passkey', 'The real site’s passkey stays safe', 'Approve once to save it'][step]}</span></div>
        </div>
        <p className="pretend-caption">{step === 1 ? 'Your face, fingerprint, and PIN stay on your device.' : fake ? 'A copied page cannot change the website’s address.' : 'A pretend account. Nothing to type or download.'}</p>
      </div>
    </div>
    <div className="simple-takeaway"><ShieldCheck size={19}/><p><strong>The thing to remember:</strong> You give the OK. Your device proves it’s you. Your passkey works for the right website.</p></div>
  </section>;
}
