import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "IA Profesor",
    template: "%s | IA Profesor",
  },
  description: "Potencia tu aprendizaje, no lo reemplaces. IA Profesor es tu guía personal para resolver problemas.",
  applicationName: "IA Profesor",
  authors: [{ name: "IA Profesor Team" }],
  generator: "Next.js",
  keywords: [
    "IA",
    "Inteligencia Artificial",
    "Educación",
    "Tutor",
    "Aprendizaje",
    "Profesor Virtual",
    "Asistente Educativo"
  ],
  referrer: "origin-when-cross-origin",
  creator: "IA Profesor Team",
  publisher: "IA Profesor",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://iaprofesor.com",
    siteName: "IA Profesor",
    title: "IA Profesor - Tu Asistente Educativo con IA",
    description: "Potencia tu aprendizaje con inteligencia artificial. Tu tutor personal disponible 24/7.",
    images: [
      {
        url: "/iaproflogo.png",
        width: 1200,
        height: 630,
        alt: "IA Profesor - Asistente Educativo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IA Profesor - Tu Asistente Educativo con IA",
    description: "Potencia tu aprendizaje con inteligencia artificial. Tu tutor personal disponible 24/7.",
    images: ["/iaproflogo.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IA Profesor",
  },
  formatDetection: {
    telephone: false,
  },
  category: "education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4f46e5" },
    { media: "(prefers-color-scheme: dark)", color: "#4f46e5" },
  ],
};

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { GlobalErrorBoundary } from "@/components/error";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${plexSans.variable} antialiased`}>
        <AuthProvider>
          <GlobalErrorBoundary>
            {children}
          </GlobalErrorBoundary>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
