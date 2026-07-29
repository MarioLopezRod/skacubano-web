"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar
    nav: {
      music: "Music",
      shows: "Shows",
      gallery: "Gallery",
      history: "History",
      contact: "Contact",
    },
    gallery: {
      badge: "★ Archive & Memories ★",
      title: "PHOTO GALLERY",
      subtitle: "Relive the legendary concerts, backstage memories, and individual profiles of the Ska Cubano Big Band.",
      tabBand: "Band Gallery",
      tabMembers: "Band Members",
      allPhotos: "All Photos",
      memberProfile: "Member Profile",
      mainPhoto: "Main Photo",
      additionalPhotos: "Additional Photos",
      noPhotos: "No photos available in this category.",
      backToTop: "Back to Top",
      adminBtn: "Admin Panel"
    },
    // Hero
    hero: {
      badge: "★ Santiago de Cuba • London ★",
      title1: "SKA",
      title2: "CUBANO",
      slogan: "The explosive clash of classic Jamaican ska and the infectious rhythms of Cuba, son, mambo and cumbia.",
      exploreBtn: "Explore Music",
      storyBtn: "Our Story",
      scrollDown: "Scroll Down",
    },
    // History
    history: {
      badge: "— Our Journey —",
      title: "HISTORY",
      videoBadge: "★ OFFICIAL PRESENTATION & DOCUMENTARY ★",
      videoTitle: "The Story of Ska Cubano",
      videoDesc: "Discover the origin, energy, and fusion of Jamaican Ska with the authentic flavor of Cuban Son in this official presentation video.",
      quote: `"Although the band is not active today, the magical fusion of Jamaican Ska and Cuban Son continues to resonate in their recordings and in the memory of thousands of fans worldwide."`,
      tag: "★ ORIGINAL SKA & SON ★",
      events: [
        {
          year: "2001",
          title: "SANTIAGO DE CUBA",
          subtitle: "The idea of an alternative history",
          text: "Investment manager Peter A. Scott decides to recreate an 'alternative history in which Cuban ska had emerged naturally'. He travels to Santiago de Cuba with the charismatic singer and DJ Natty Bo (Nathan Lerner) to rehearse and record their debut album with local talents such as singer Beny Billy (Juan Manuel Villy Carbonell).",
          stamp: "CUBA • 2001"
        },
        {
          year: "2004",
          title: "THE BIG BAND",
          subtitle: "London - Caribbean Connection",
          text: "In late 2004, the band consolidates in London with top-tier Caribbean and international musicians, including Rey Crespo and Ernesto Estruch (Havana), Dr. Sleepy (Montserrat), Eddie 'Tan Tan' Thornton (Jamaica), Miss Megoo (Japan) and Trevor Edwards (London), with Beny Billy constantly traveling from Cuba for tours and recordings.",
          stamp: "LONDON • 2004"
        },
        {
          year: "2005",
          title: "¡AY CARAMBA!",
          subtitle: "BBC World Music Award Nomination",
          text: "They release their acclaimed second album, '¡Ay Caramba!', which is nominated for the prestigious BBC World Music Award in the 'Crossover' category. The music press describes it as 'imaginative, full of melody, wit and a joyful fusion of irresistible rhythms'. In 2006, Venezuelan singer Carlos Peña joins as co-lead vocalist.",
          stamp: "BBC AWARD • 2005"
        },
        {
          year: "2010",
          title: "MAMBO SKA",
          subtitle: "High-octane sound",
          text: "They release 'Mambo Ska', described by the prestigious magazine All About Jazz as 'a loud, messy, irresistible explosion of high-octane music'. Their popular song 'Soy Campesino' becomes a Christmas advertising phenomenon in the UK for the Comet chain.",
          stamp: "MAMBO • 2010"
        },
        {
          year: "LEGACY",
          title: "GLOBAL TOURS",
          subtitle: "Conquered over 30 countries",
          text: "With one of the most energetic and festive live shows in the world, Ska Cubano performs on major international stages and festivals such as Glastonbury, WOMAD and Big Day Out, taking their infectious fusion to every corner of the planet.",
          stamp: "WORLD TOUR"
        }
      ]
    },
    // Albums
    albums: {
      badge: "— Musical Selection —",
      title: "DISCOGRAPHY",
    },
    // Shows
    shows: {
      badge: "— Historic Concerts —",
      title: "TOURS & SHOWS",
      subtitle: "Ska Cubano has toured over 30 countries, bringing their explosive live show to the world's most prestigious music stages.",
      tableHeader: {
        festival: "FESTIVAL / TOUR",
        location: "LOCATION & STAGE",
        details: "PERFORMANCE DETAILS",
        status: "STATUS",
      },
      tagline: "★ World Tours 2004 — 2014 • London to Santiago ★",
      data: [
        {
          festival: "GLASTONBURY FESTIVAL",
          location: "Pilton, United Kingdom",
          year: "Tour Milestones",
          details: "Main World Music stage. Considered one of the most energetic ska concerts of the festival.",
          badge: "MYTHIC"
        },
        {
          festival: "WOMAD FESTIVAL",
          location: "UK, Spain, Australia",
          year: "Global Tour",
          details: "Headline performance across multiple international venues of the world music festival founded by Peter Gabriel.",
          badge: "HEADLINER"
        },
        {
          festival: "FUJI ROCK FESTIVAL",
          location: "Naeba, Japan",
          year: "Asia Tour",
          details: "Packed crowd at Asia's most important mountain festival during their acclaimed Japanese tour.",
          badge: "SOLD OUT"
        },
        {
          festival: "ROSKILDE FESTIVAL",
          location: "Roskilde, Denmark",
          year: "European Tour",
          details: "The heart of Northern Europe vibrating to the rhythm of traditional mambo-ska on a memorable night.",
          badge: "LEGEND"
        },
        {
          festival: "BIG DAY OUT",
          location: "Sydney, Melbourne, Australia",
          year: "Oceania Tour",
          details: "Massive tour through major cities in Australia and New Zealand, marking a milestone down under.",
          badge: "FEATURED"
        },
        {
          festival: "CHICAGO WORLD MUSIC",
          location: "Chicago, United States",
          year: "US Tour",
          details: "Conquering the North American audience in a series of concerts with an unparalleled display of brass and percussion.",
          badge: "TRIUMPH"
        }
      ]
    },
    // Contact
    contact: {
      badge: "— Ska Cubano —",
      title: "GET IN TOUCH",
      subtitle: "The legacy of Ska Cubano lives on.\nGet in touch to share a memory or if you need information regarding our services.",
      form: {
        header: "Contact",
        nameLabel: "Name",
        namePlaceholder: "Your full name",
        emailLabel: "Email",
        emailPlaceholder: "your@email.com",
        msgLabel: "Message",
        msgPlaceholder: "Leave us a message. Thank you for your interest in our music and history!",
        sending: "Sending...",
        sendBtn: "— Send Message —",
        success: "✓ Message received — we'll be in touch soon!",
        followUs: "Follow Us"
      }
    },
    // Footer
    footer: {
      description: "The explosive clash of classic Jamaican ska and infectious Cuban rhythms.",
      quickLinks: "Quick Links",
      rights: "Ska Cubano. All rights reserved.",
      legacyText: "Santiago de Cuba to London • 2001 — Present"
    }
  },
  es: {
    // Navbar
    nav: {
      music: "Música",
      shows: "Shows",
      gallery: "Galería",
      history: "Historia",
      contact: "Contacto",
    },
    gallery: {
      badge: "★ Archivo y Recuerdos ★",
      title: "GALERIA DE FOTOS",
      subtitle: "Revive los conciertos legendarios, momentos de camerino y perfiles individuales de la orquesta Ska Cubano.",
      tabBand: "Galería General",
      tabMembers: "Integrantes",
      allPhotos: "Todas las fotos",
      memberProfile: "Perfil del Integrante",
      mainPhoto: "Foto Principal",
      additionalPhotos: "Fotos Adicionales",
      noPhotos: "No hay fotos disponibles en esta categoría.",
      backToTop: "Volver Arriba",
      adminBtn: "Panel Admin"
    },
    // Hero
    hero: {
      badge: "★ Santiago de Cuba • Londres ★",
      title1: "SKA",
      title2: "CUBANO",
      slogan: "La explosiva colisión entre el ska jamaicano clásico y los ritmos contagiosos de Cuba, son, mambo y cumbia.",
      exploreBtn: "Explorar Música",
      storyBtn: "Nuestra Historia",
      scrollDown: "Desplazar Abajo",
    },
    // History
    history: {
      badge: "— Nuestra Trayectoria —",
      title: "HISTORIA",
      videoBadge: "★ PRESENTACIÓN OFICIAL Y DOCUMENTAL ★",
      videoTitle: "La Historia de Ska Cubano",
      videoDesc: "Descubre el origen, la energía y la fusión del Ska jamaicano con el auténtico sabor del Son cubano en este vídeo de presentación oficial.",
      quote: `"Aunque la banda hoy no está en activo, la fusión mágica del Ska jamaicano y el Son cubano sigue resonando en sus grabaciones y en la memoria of miles de fans en todo el mundo."`,
      tag: "★ ORIGINAL SKA & SON ★",
      events: [
        {
          year: "2001",
          title: "SANTIAGO DE CUBA",
          subtitle: "La idea de una historia alternativa",
          text: "El gestor de inversiones Peter A. Scott decide recrear una 'historia alternativa en la que el ska cubano hubiera surgido de forma natural'. Viaja a Santiago de Cuba con el carismático cantante y DJ Natty Bo (Nathan Lerner) para ensayar y grabar su álbum debut con talentos locales como el cantante Beny Billy (Juan Manuel Villy Carbonell).",
          stamp: "CUBA • 2001"
        },
        {
          year: "2004",
          title: "LA BIG BAND",
          subtitle: "Conexión Londres - Caribe",
          text: "A finales de 2004, la banda se consolida en Londres con músicos caribeños e internacionales de primer nivel, incluyendo a Rey Crespo y Ernesto Estruch (La Habana), Dr. Sleepy (Montserrat), Eddie 'Tan Tan' Thornton (Jamaica), Miss Megoo (Japón) y Trevor Edwards (Londres), con Beny Billy viajando constantemente desde Cuba para giras y grabaciones.",
          stamp: "LONDRES • 2004"
        },
        {
          year: "2005",
          title: "¡AY CARAMBA!",
          subtitle: "Nominación a los Premios BBC",
          text: "Lanzan su aclamado segundo álbum, '¡Ay Caramba!', que es nominado a los prestigiosos premios BBC World Music Award en la categoría 'Crossover'. La prensa musical lo describe como 'imaginativo, lleno de melodía, ingenio y una fusión alegre de ritmos irresistibles'. En 2006, el cantante venezolano Carlos Peña se une como co-líder vocal.",
          stamp: "PREMIO BBC • 2005"
        },
        {
          year: "2010",
          title: "MAMBO SKA",
          subtitle: "Sonido de alto octanaje",
          text: "Se publica 'Mambo Ska', calificado por la prestigiosa revista All About Jazz como 'una explosión ruidosa, desordenada e irresistible de música de alto octanaje'. Su popular tema 'Soy Campesino' se convierte en un fenómeno publicitario navideño en el Reino Unido para la cadena Comet.",
          stamp: "MAMBO • 2010"
        },
        {
          year: "LEGADO",
          title: "GIRAS GLOBALES",
          subtitle: "Más de 30 países conquistados",
          text: "Con uno de los directos más enérgicos y fiesteros del mundo, Ska Cubano se presenta en los principales escenarios y festivales internacionales de prestigio como Glastonbury, WOMAD y Big Day Out, llevando su fusión contagiosa a rincones de todo el planeta.",
          stamp: "GIRA MUNDIAL"
        }
      ]
    },
    // Albums
    albums: {
      badge: "— Selección Musical —",
      title: "DISCOGRAFIA",
    },
    // Shows
    shows: {
      badge: "— Conciertos Históricos —",
      title: "GIRAS Y SHOWS",
      subtitle: "Ska Cubano ha recorrido más de 30 países, llevando su directo explosivo a los escenarios más prestigiosos de la música mundial.",
      tableHeader: {
        festival: "FESTIVAL / GIRA",
        location: "LUGAR Y ETAPA",
        details: "DETALLES DE LA ACTUACIÓN",
        status: "ESTADO",
      },
      tagline: "★ Giras mundiales 2004 — 2014 • Londres a Santiago ★",
      data: [
        {
          festival: "GLASTONBURY FESTIVAL",
          location: "Pilton, Reino Unido",
          year: "Hitos Giras",
          details: "Escenario principal de World Music. Considerado uno de los conciertos de ska más enérgicos del festival.",
          badge: "MÍTICO"
        },
        {
          festival: "WOMAD FESTIVAL",
          location: "Reino Unido, España, Australia",
          year: "Gira Global",
          details: "Actuación estelar en múltiples sedes internacionales del festival de músicas del mundo fundado por Peter Gabriel.",
          badge: "ESTELAR"
        },
        {
          festival: "FUJI ROCK FESTIVAL",
          location: "Naeba, Japón",
          year: "Tour Asia",
          details: "Lleno absoluto en los escenarios del festival de montaña más importante de Asia durante su aclamada gira japonesa.",
          badge: "SOLD OUT"
        },
        {
          festival: "ROSKILDE FESTIVAL",
          location: "Roskilde, Dinamarca",
          year: "Gira Europea",
          details: "El corazón del norte de Europa vibrando al ritmo del mambo-ska tradicional en una noche memorable.",
          badge: "LEYENDA"
        },
        {
          festival: "BIG DAY OUT",
          location: "Sídney, Melbourne, Australia",
          year: "Tour Oceanía",
          details: "Gira multitudinaria por las principales ciudades de Australia y Nueva Zelanda, marcando un hito en las antípodas.",
          badge: "DESTACADO"
        },
        {
          festival: "CHICAGO WORLD MUSIC",
          location: "Chicago, Estados Unidos",
          year: "Tour EE.UU.",
          details: "Conquista del público norteamericano en una serie de conciertos con un derroche inigualable de vientos y percusión.",
          badge: "TRIUNFO"
        }
      ]
    },
    // Contact
    contact: {
      badge: "— Ska Cubano —",
      title: "CONTACTO",
      subtitle: "El legado de Ska Cubano sigue vivo.\nPonte en contacto para compartir un recuerdo o consultar información de nuestros servicios.",
      form: {
        header: "Contacto",
        nameLabel: "Nombre",
        namePlaceholder: "Tu nombre completo",
        emailLabel: "Correo Electrónico",
        emailPlaceholder: "tu@email.com",
        msgLabel: "Mensaje",
        msgPlaceholder: "Déjanos un mensaje. ¡Gracias por tu interés en nuestra música e historia!",
        sending: "Enviando...",
        sendBtn: "— Enviar Mensaje —",
        success: "✓ ¡Mensaje recibido! Nos pondremos en contacto pronto.",
        followUs: "Síguenos"
      }
    },
    // Footer
    footer: {
      description: "La explosiva colisión entre el ska jamaicano clásico y los ritmos contagiosos de Cuba.",
      quickLinks: "Enlaces Rápidos",
      rights: "Ska Cubano. Todos los derechos reservados.",
      legacyText: "Santiago de Cuba a Londres • 2001 — Presente"
    }
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "es" : "en"));
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
