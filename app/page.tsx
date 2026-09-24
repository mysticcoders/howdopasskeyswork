'use client';
// Fixed-size local brand assets use native images; no image-optimization service is required.
/* oxlint-disable next/no-img-element */
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, RotateCcw, KeyRound, Fingerprint, ShieldCheck, Globe, Laptop, LockKeyhole, Check, ShieldX, ExternalLink, Cloud, Play, Pause, MousePointer2, Film } from 'lucide-react';
import { SimpleStory } from '@/components/simple-story';
import { createPlaybackClock, nextLesson } from '@/lib/playback';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type Mode = 'create' | 'signin' | 'phishing';
const lessons = {
  create: [
    { title: 'A new way to say “it’s me.”', text: 'Imagine you’re creating a passkey for mysticcoders.com. The website asks your device to make a credential just for this site.', label: 'Create a passkey', packet: 'Request to create a passkey', direction: 'left', note: 'This is an interactive model. It won’t create a real passkey or ask for your fingerprint.' },
    { title: 'You give the go-ahead.', text: 'Your device asks you to approve with your fingerprint, face, or device PIN. This check happens locally; the website never receives your biometric data or PIN.', label: 'Approve on this device', packet: 'Waiting for your approval', direction: 'none', note: 'Your fingerprint unlocks permission to use a key. It isn’t the key itself.' },
    { title: 'Two keys. Different jobs.', text: 'Your authenticator creates a unique, mathematically related key pair. The private key stays protected by your passkey provider. The public key can safely go to the website.', label: 'Send the public key', packet: 'Public key + credential ID', direction: 'right', note: 'Knowing the public key does not let someone calculate the private key.' },
    { title: 'Ready for next time.', text: 'The website associates the public key with your account. Your provider keeps the private key, ready to prove it’s you when you return.', label: 'Try signing in', packet: 'Passkey registered', direction: 'none', note: 'A synced passkey can be available on your other devices. A device-bound passkey stays on its authenticator.' },
  ],
  signin: [
    { title: 'The website sets a challenge.', text: 'You return to mysticcoders.com. Its server sends a fresh, random challenge—a one-time test that prevents an old sign-in response from being reused.', label: 'Check the website', packet: 'Fresh random challenge', direction: 'left', note: 'For this example, a passkey has already been registered.' },
    { title: 'Your device checks the website.', text: 'The browser checks which site is asking. It only offers credentials scoped to that relying party. You then approve using your device’s unlock method.', label: 'Approve sign-in', packet: 'Site matches: mysticcoders.com', direction: 'none', note: 'A passkey is tied to a relying party, usually identified by the website’s domain.' },
    { title: 'Sign it. Don’t share it.', text: 'The authenticator uses the private key to sign data bound to this challenge and website. It sends back the signature and supporting data—not the private key.', label: 'Verify the signature', packet: 'Signature + supporting data', direction: 'right', note: 'A signature is proof that the matching private key was used.' },
    { title: 'The proof checks out.', text: 'The server checks the signature with your stored public key. It also validates the challenge, origin, and required verification flags. If everything matches, you’re signed in.', label: 'Try a fake website', packet: 'Verified. You’re signed in.', direction: 'none', note: 'No shared password crossed the network. The private key was never sent to this website.' },
  ],
  phishing: [
    { title: 'Looks familiar. Wrong address.', text: 'A fake login page at mysticcoders-login.example copies the real website. It asks for the passkey you created for mysticcoders.com.', label: 'Try using the passkey', packet: 'Request from a lookalike site', direction: 'left', note: 'The lookalike domain is fictional. This simulation makes no sign-in request to Mystic Coders.' },
    { title: 'The address doesn’t match.', text: 'The browser won’t let this unrelated domain use the real site’s passkey. A convincing logo or page design cannot change that scope.', label: 'See what this protects', packet: 'Blocked: wrong relying party', direction: 'none', note: 'If the fake site creates its own passkey, that credential still won’t sign you into the real site.' },
    { title: 'A fake page can’t borrow your key.', text: 'This domain binding makes passkey sign-in phishing-resistant. There’s no password for you to accidentally type into the impostor’s form.', label: 'Restart the example', packet: 'Your real passkey stays protected', direction: 'none', note: 'Passkeys don’t prevent every attack. Compromised devices, stolen sessions, and weak account recovery still matter.' },
  ],
};
export default function Home() {
  const [mode, setMode] = useState<Mode>('create');
  const [step, setStep] = useState(0);
  const [detail, setDetail] = useState<'private'|'public'|null>(null);
  const [view, setView] = useState('interactive');
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(1);
  const lessonPanelRef = useRef<HTMLElement | null>(null);
  const restoreKeyboardFocus = useRef(false);
  useLayoutEffect(() => {
    if (!restoreKeyboardFocus.current) return;
    restoreKeyboardFocus.current = false;
    lessonPanelRef.current?.focus({ preventScroll: true });
  }, [mode]);
  const data = lessons[mode]; const current = data[step];
  const duration = Math.max(8000, current.text.split(' ').length * 310);
  useEffect(() => {
    const stopWhenHidden = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', stopWhenHidden);
    return () => document.removeEventListener('visibilitychange', stopWhenHidden);
  }, []);
  useEffect(() => {
    if (view !== 'animated' || !playing) return;
    const tick = createPlaybackClock(performance.now(), speed);
    const timer = window.setInterval(() => {
      const now = performance.now();
      const update = tick(now);
      if (!document.hidden) setElapsed(update);
    }, 80);
    return () => window.clearInterval(timer);
  }, [view, playing, speed]);
  useEffect(() => {
    if (elapsed < duration || view !== 'animated') return;
    // This finite scene transition runs only after the external playback clock completes.
    // oxlint-disable-next-line react/react-compiler
    setElapsed(0); setDetail(null);
    if (step < data.length - 1) setStep(step + 1);
    else { setMode(nextLesson(mode)); setStep(0); }
  }, [elapsed, duration, view, step, data.length, mode]);
  const goToStep = (value: number) => { setStep(value); setElapsed(0); setDetail(null); };
  const changeMode = (value: string) => { setMode(value as Mode); setStep(0); setDetail(null); setElapsed(0); };
  const next = () => { if(step < data.length-1) goToStep(step+1); else changeMode(nextLesson(mode)); };
  const hasKeys = mode !== 'create' || step >= 2;
  const blocked = mode === 'phishing' && step > 0;
  return <div id="top" className={`app-shell ${view === 'animated' ? 'animated-mode' : ''} ${playing ? 'is-playing' : 'is-paused'}`}>
    <header className="compact-header">
      <a href="#top" className="compact-logo" aria-label="How do passkeys work — back to top"><img src="/mystic-dragon.webp" alt="" width="27" height="31"/></a>
      <nav aria-label="Page links"><a href="#questions" className="faq-link">FAQ <ArrowRight size={16}/></a><a className="github-link" href="https://github.com/kinabalu/howdopasskeyswork" target="_blank" rel="noreferrer" aria-label="View source on GitHub (opens in a new tab)" title="View source on GitHub"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.524.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.404c1.02.005 2.045.138 3 .404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.652.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a></nav>
    </header>
    <main>
      <SimpleStory />
      <section className="questions" id="questions"><div><span className="eyebrow">GOOD TO KNOW</span><h2>Your everyday questions.</h2><Cloud className="question-icon" size={48}/></div><div className="faqs">{[
        ['Where is my passkey saved?', 'Usually in a password manager, such as Apple Passwords, Google Password Manager, or 1Password. Some passkeys are kept on a physical security key instead. You choose from the options your device offers when you save it.'],
        ['What if I lose my phone?', 'Some passkeys sync: your password manager can make them available on another supported device. Others stay on just one device or security key. For those, you need another sign-in method or the website’s account recovery. Set up a backup before you need it.'],
        ['Can I use another computer?', 'Often, yes. Your password manager may make your passkey available there. Some websites also let you sign in using your nearby phone by scanning a QR code. The options depend on your devices and the website.'],
        ['Does the website get my fingerprint or face?', 'No. Your device checks your face, fingerprint, or device PIN locally. That gives it permission to use your passkey. The website receives proof that your device has the right key, not your face, fingerprint, or PIN.'],
        ['How do I get a passkey?', 'On a website that supports passkeys, look in your account’s sign-in or security settings for “Create a passkey.” Choose where to save it and approve on your device. Next time, choose “Sign in with a passkey.”'],
        ['Do I still need a password?', 'That depends on the website. Some replace passwords with passkeys; others keep both. Check your sign-in and recovery options before removing a password.'],
        ['Does this stop every kind of attack?', 'No. A fake website cannot use the passkey for the real website, but someone could still attack your device, steal an already signed-in session, or abuse account recovery. Passkeys protect an important part of signing in.'],
        ['Is this demo creating a real passkey?', 'No. Everything here is a simulation. It does not collect biometric data, save a real passkey, or sign you into an account. Mystic Coders is our example website; this demo does not claim it offers passkey sign-in.'],
      ].map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
      <details className="technical-layer" onToggle={event=>{if(!event.currentTarget.open)setPlaying(false)}}>
        <summary><div><span className="eyebrow">CURIOUS ABOUT THE DETAILS?</span><h2>Show me how it works</h2><p>Follow the two keys, the proof, and the website check.</p></div><span aria-hidden="true">+</span></summary>
        <div className="technical-content">
      <div className="view-toolbar"><ToggleGroup value={[view]} onValueChange={values=>{if(values.length){setView(values[0]);setPlaying(false);setElapsed(0);}}} aria-label="Presentation mode" className="view-toggle"><ToggleGroupItem value="interactive"><MousePointer2 size={16}/> Interactive mode</ToggleGroupItem><ToggleGroupItem value="animated"><Film size={16}/> Watch mode</ToggleGroupItem></ToggleGroup><span className="view-description">{view==='animated'?'A looping walkthrough. Press play to watch.':'You set the pace. Follow the keys.'}</span></div>
      {view==='animated'&&<div className="playback"><button className="play-button" onClick={()=>setPlaying(!playing)}>{playing?<Pause size={17}/>:<Play size={17}/>} {playing?'Pause':'Play walkthrough'}</button><progress className="timeline" aria-label="Current scene progress" value={Math.min(100,Math.round(elapsed/duration*100))} max={100}/><span className="scene-count">Scene {(mode==='create'?0:mode==='signin'?4:8)+step+1} / 11</span><button className="speed-button" aria-label={`Playback speed ${speed} times. Change speed`} onClick={()=>{setSpeed(speed===1?1.5:speed===1.5?2:1)}}>{speed}×</button><button className="reset" aria-label="Restart walkthrough" onClick={()=>changeMode('create')}><RotateCcw size={16}/></button></div>}
      <Tabs value={mode} onValueChange={v=>changeMode(String(v))} className="lab-tabs">
        <TabsList className="mode-list" aria-label="Choose a passkey lesson">
          <TabsTrigger value="create"><span>01</span> Create a passkey</TabsTrigger>
          <TabsTrigger value="signin"><span>02</span> Sign back in</TabsTrigger>
          <TabsTrigger value="phishing"><span>03</span> Try a fake website</TabsTrigger>
        </TabsList>
        {(['create','signin','phishing'] as Mode[]).map(m=><TabsContent key={m} value={m}>
          {/* Focusable lesson region exposes documented arrow-key navigation without taking over tab controls. */}
          {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
          <section ref={m === mode ? lessonPanelRef : undefined} className="lab" aria-label="Interactive passkey simulation" tabIndex={0} aria-describedby={view==='interactive'?'keyboard-help':undefined} onKeyDown={event=>{
            if(view!=='interactive'||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey) return;
            if(event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable=true],[role=tab]')) return;
            if(event.key==='ArrowRight'){event.preventDefault();restoreKeyboardFocus.current=step===data.length-1;next();}
            if(event.key==='ArrowLeft'){event.preventDefault();if(step>0)goToStep(step-1);else if(mode!=='create'){restoreKeyboardFocus.current=true;const previous=mode==='phishing'?'signin':'create';setMode(previous);goToStep(lessons[previous].length-1);}}
          }}>
            <div className="diagram">
              <div className="diagram-top"><span>UNDER THE HOOD</span><span className="simulation"><span/> {view==='animated'?'Animated simulation':'Interactive simulation'}</span></div>
              <div className="actors">
                <div className="actor"><div className="actor-icon"><Laptop size={32}/></div><h2>Your device</h2><p>Your side of the connection</p><div className={'key-card private '+(hasKeys?'':'waiting')}><LockKeyhole size={20}/><span>{hasKeys?'Private key':'Waiting to create'}<small>{hasKeys?'PROTECTED BY YOUR PROVIDER':'YOUR PASSKEY LIVES HERE'}</small></span>{hasKeys&&<button aria-label="Explain the private key" onClick={()=>setDetail(detail==='private'?null:'private')}>i</button>}</div>{(step===1 && mode!=='phishing')?<div className="device-status"><Fingerprint size={19}/> Local identity check</div>:<div className="device-status"><ShieldCheck size={16}/> {blocked?'No matching passkey shared':'Your secrets stay on your side'}</div>}</div>
                <div className={'connection '+(blocked?'blocked':'')+' direction-'+current.direction}><div className="connection-line"><span className="travel-dot" aria-hidden="true"/>{current.direction==='left'?<ArrowLeft/>:current.direction==='right'?<ArrowRight/>:blocked?<ShieldX/>:<ShieldCheck/>}</div><span key={`${mode}-${step}`} className="packet">{current.packet}</span><span className="connection-caption">{blocked?'DOMAIN CHECK FAILED':mode==='phishing'?'HTTPS, BUT THE WRONG SITE':'SECURE CONNECTION'}</span></div>
                <div className="actor"><div className={'actor-icon '+(mode==='phishing'?'impostor':'mystic-actor')}>{mode==='phishing'?<Globe size={32}/>:<img src="/mystic-dragon.webp" alt="" width="40" height="46"/>}</div><h2>{mode==='phishing'?'The fake website':'Mystic Coders'}</h2><p className={mode==='phishing'?'fake-domain':''}>{mode==='phishing'?'mysticcoders-login.example':'mysticcoders.com'}</p><div className={'key-card public '+(!hasKeys||mode==='phishing'?'waiting':'')}><KeyRound size={20}/><span>{mode==='phishing'?'No matching public key':hasKeys?'Public key':'Waiting for your key'}<small>{mode==='phishing'?'UNRELATED DOMAIN':'STORED WITH YOUR ACCOUNT'}</small></span>{hasKeys&&mode!=='phishing'&&<button aria-label="Explain the public key" onClick={()=>setDetail(detail==='public'?null:'public')}>i</button>}</div><div className="device-status">{mode==='phishing'?<ShieldX size={16}/>:<Check size={16}/>} {mode==='phishing'?'A copied page ≠ the real site':'Never receives your private key'}</div></div>
              </div>
              <div className="diagram-note" aria-live="polite">{detail? <><strong>{detail==='private'?'Private key':'Public key'}</strong> {detail==='private'?'Creates signatures. It is never sent to the website; a provider may securely sync it between your devices.':'Verifies signatures. The website can store it without holding the secret needed to sign in.'}<button onClick={()=>setDetail(null)} aria-label="Close key explanation">×</button></>:<><LockKeyhole size={15}/><span>Your face, fingerprint, and device PIN are never sent to the website.</span></>}</div>
            </div>
            <div className="story" aria-live={playing?'off':'polite'} aria-atomic="true"><div className="step-heading"><span>STEP {String(step+1).padStart(2,'0')} / {String(data.length).padStart(2,'0')}</span><button className="reset" onClick={()=>goToStep(0)} aria-label="Restart current lesson"><RotateCcw size={16}/></button></div><div className="step-dots">{data.map((_,i)=><button key={i} aria-label={`Go to step ${i+1}`} aria-current={i===step?'step':undefined} className={i<=step?'filled':''} onClick={()=>goToStep(i)}/>)}</div><h2>{current.title}</h2><p>{current.text}</p><div className="story-actions"><button className="back" aria-label="Previous step" disabled={step===0} onClick={()=>goToStep(step-1)}><ArrowLeft size={18}/></button><button className="primary-button" onClick={next}>{current.label}<ArrowRight size={18}/></button></div><p className="footnote">{current.note}</p></div>
          </section>
        </TabsContent>)}
      </Tabs>
      {view==='interactive'&&<p id="keyboard-help" className="keyboard-help">Focus the walkthrough and use ← / → to move between steps.</p>}
        </div>
      </details>
      <section className="providers" aria-labelledby="providers-title"><div className="providers-copy"><h2 id="providers-title">Where you might save a passkey</h2><p>You may already use one of these password managers. They can save passkeys too.</p><p className="hardware-note">A physical security key, such as a YubiKey, can also keep passkeys. Those passkeys stay on that key.</p></div><div className="provider-logos"><a href="https://support.apple.com/en-us/120758" target="_blank" rel="noreferrer"><span className="provider-icon"><img src="/apple.svg" alt="" width="24" height="28"/></span><span>Apple<small>Passwords</small></span><ExternalLink size={12}/></a><a href="https://passwords.google/" target="_blank" rel="noreferrer"><span className="provider-icon"><img src="/google-password-manager.webp" alt="" width="30" height="30"/></span><span>Google<small>Password Manager</small></span><ExternalLink size={12}/></a><a href="https://1password.com/product/passkeys" target="_blank" rel="noreferrer"><span className="provider-icon"><img src="/1password.svg" alt="" width="30" height="30"/></span><span>1Password</span><ExternalLink size={12}/></a></div></section>
    </main><footer><a className="footer-maker" href="https://mysticcoders.com" target="_blank" rel="noreferrer"><img className="maker-dragon" src="/mystic-dragon.webp" alt="" width="23" height="27"/>Made by <strong>Mystic Coders</strong> <ExternalLink size={13}/></a><span>A little less mystery. A little more understanding.</span><div><a href="https://fidoalliance.org/passkeys/" target="_blank" rel="noreferrer">FIDO Alliance <ExternalLink size={13}/></a><a href="https://www.w3.org/TR/webauthn-3/" target="_blank" rel="noreferrer">WebAuthn standard <ExternalLink size={13}/></a></div></footer>
  </div>;
}
