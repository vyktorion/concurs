import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SessionProvider from '@/components/session-provider';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DanceContest Pro - Concursuri de Dans Profesionale',
  description: 'Platforma profesională pentru organizarea și promovarea concursurilor de dans din România. Găsește și participă la cele mai importante evenimente de dans.',
  keywords: 'concursuri dans, competiții dans, evenimente dans, romania, dans sportiv, organizatori',
  authors: [{ name: 'DanceContest Pro' }],
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'DanceContest Pro - Concursuri de Dans Profesionale',
    description: 'Platforma profesională pentru organizarea și promovarea concursurilor de dans din România.',
    siteName: 'DanceContest Pro',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DanceContest Pro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DanceContest Pro - Concursuri de Dans Profesionale',
    description: 'Platforma profesională pentru organizarea și promovarea concursurilor de dans din România.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}