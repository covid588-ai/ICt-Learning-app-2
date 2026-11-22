import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  display: 'swap',
  variable: '--font-noto-bengali',
});

export const metadata: Metadata = {
  title: {
    default: 'EduLearn - শিখুন, অগ্রসর হন',
    template: '%s | EduLearn',
  },
  description: 'Complete educational learning platform with video lectures, PDF notes, and progress tracking. Learn ICT, Physics, Chemistry, Biology, Mathematics and more.',
  keywords: ['education', 'learning', 'video lectures', 'pdf notes', 'programming', 'ICT', 'Python', 'online courses'],
  authors: [{ name: 'EduLearn Team' }],
  creator: 'EduLearn',
  publisher: 'EduLearn',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: 'https://edulearn.app',
    siteName: 'EduLearn',
    title: 'EduLearn - শিখুন, অগ্রসর হন',
    description: 'Complete educational learning platform with video lectures and PDF notes',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EduLearn Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduLearn',
    description: 'Complete educational learning platform',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-96x96.png',
    apple: '/icons/icon-192x192.png',
  },
  manifest: '/manifest.json',
  themeColor: '#2563eb',
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoBengali.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://drive.google.com" />
        <link rel="dns-prefetch" href="https://drive.usercontent.google.com" />
      </head>
      <body className="font-sans antialiased bg-background-light dark:bg-background-dark text-foreground">
        <Providers>{children}</Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}