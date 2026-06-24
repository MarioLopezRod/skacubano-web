import Hero from '../components/Hero';
import Albums from '../components/Albums';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Albums />
      <Contact />
      <Footer />
    </main>
  );
}