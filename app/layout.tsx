import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'How do passkeys work — Mystic Coders', icons: { icon: '/favicon.svg' }, description: 'Understand passkeys in plain language. Try a pretend sign-in, see why fake websites cannot use your passkey, and explore the details when you’re curious.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {return <html lang="en-US"><body>{children}</body></html>}
