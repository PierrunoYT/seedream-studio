import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seedream Studio",
  description: "Where Dreams Take Shape - Creative studio bringing your visions to life",
  keywords: "creative studio, design, dreams, seedream, branding, web design",
  authors: [{ name: "Seedream Studio" }],
  creator: "Seedream Studio",
  publisher: "Seedream Studio",
  
  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://seedream.studio',
    title: 'Seedream Studio',
    description: 'Where Dreams Take Shape - Creative studio bringing your visions to life',
    siteName: 'Seedream Studio',
    images: [
      {
        url: 'https://seedream.studio/api/og',
        width: 1200,
        height: 630,
        alt: 'Seedream Studio - Where Dreams Take Shape',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Seedream Studio',
    description: 'Where Dreams Take Shape - Creative studio bringing your visions to life',
    images: ['https://seedream.studio/api/og'],
    creator: '@seedreamstudio',
  },
  
  // Additional meta for better compatibility
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
    'twitter:image': 'https://seedream.studio/api/og',
    'twitter:image:width': '1200',
    'twitter:image:height': '630',
    'application-name': 'Seedream Studio',
    'og:site_name': 'Seedream Studio',
    'og:locale': 'en_US',
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  
  manifest: '/favicon/site.webmanifest',
  themeColor: '#667eea',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://seedream.studio',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
