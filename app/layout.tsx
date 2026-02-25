import type {Metadata} from 'next';
import { Rajdhani, JetBrains_Mono, Sora, Poppins } from 'next/font/google';
import './globals.css';

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'SMART MUNICIPAL MITRA',
  description: 'Unified Smart Municipal Platform — Andhra Pradesh Municipal Intelligence Dashboard',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${jetbrainsMono.variable} ${sora.variable} ${poppins.variable}`}>
      <body suppressHydrationWarning className="font-poppins antialiased">{children}</body>
    </html>
  );
}
