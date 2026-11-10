import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SITE_NAME, SITE_URL, seoText } from "../lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Valores por defecto para todas las páginas. Cada página completa o sustituye lo suyo
// (portada: src/app/page.jsx y src/app/es/page.jsx). Iconos e imagen para redes salen de los
// ficheros de esta carpeta: favicon.ico, icon.png, apple-icon.png y opengraph-image.jpg.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: seoText.en.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: seoText.en.description,
  applicationName: SITE_NAME,
  category: "music",
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: seoText.en.locale,
  },
  twitter: {
    card: "summary_large_image",
    site: "@skcubano",
  },
};

export const viewport = {
  themeColor: "#0d0a07",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Las fuentes de Google se piden desde globals.css: conectar antes acelera la primera carga */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0d0a07] text-[#faf6ee]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
