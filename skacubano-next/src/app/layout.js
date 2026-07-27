import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://skacubano.com"),
  title: "Ska Cubano",
  description: "Ska Cubano official website",
  icons: {
    icon: "/images/logos/logoSkaCubano.png",
    shortcut: "/images/logos/logoSkaCubano.png",
    apple: "/images/logos/logoSkaCubano.png",
  },
  openGraph: {
    title: "Ska Cubano",
    description: "Ska Cubano official website",
    images: [
      {
        url: "/images/logos/logoSkaCubano.png",
        alt: "Ska Cubano Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ska Cubano",
    description: "Ska Cubano official website",
    images: ["/images/logos/logoSkaCubano.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ska Cubano",
  "logo": "/images/logos/logoSkaCubano.png",
  "image": "/images/logos/logoSkaCubano.png",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0d0a07] text-[#faf6ee]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}