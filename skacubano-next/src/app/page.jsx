import Hero from '../components/Hero';
import Albums from '../components/Albums';
import History from '../components/History';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Albums />
      <History />
      <Contact />
      <Footer />
    </main>
  );
}