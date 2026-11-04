import Navbar from "./Navbar";
import Hero from "./Hero";
import Albums from "./Albums";
import Shows from "./Shows";
import GallerySection from "./GallerySection";
import History from "./History";
import Contact from "./Contact";
import Footer from "./Footer";
import { homeJsonLd } from "../lib/seo";

// Portada completa. La usan "/" (inglés) y "/es" (español); el idioma del contenido
// lo decide LanguageProvider según la URL.
export default function HomePage({ lang }) {
  return (
    <main className="min-h-screen bg-[#0d0a07] text-[#faf6ee]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }}
      />
      <Navbar />
      <Hero />
      <Albums />
      <Shows />
      <GallerySection />
      <History />
      <Contact />
      <Footer />
    </main>
  );
}
