import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import History from '../components/History';
import Albums from '../components/Albums';
import Shows from '../components/Shows';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0a07] text-[#faf6ee]">
      <Navbar />
      <Hero />
      <History />
      <Albums />
      <Shows />
      <Contact />
      <Footer />
    </main>
  );
}