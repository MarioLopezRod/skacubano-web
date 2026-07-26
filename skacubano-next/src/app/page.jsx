import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Albums from '../components/Albums';
import Shows from '../components/Shows';
import GallerySection from '../components/GallerySection';
import History from '../components/History';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0a07] text-[#faf6ee]">
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