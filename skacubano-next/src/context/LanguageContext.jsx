"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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
      home: "Back to home",
      toggleMenu: "Open or close the menu",
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
      adminBtn: "Admin Panel",
      loading: "Loading the Ska Cubano vintage gallery...",
      noBandPhotos: "There are no photos in the band gallery yet.",
      scrollLeft: "Scroll left",
      scrollRight: "Scroll right",
      prevPhoto: "Previous photo",
      nextPhoto: "Next photo",
      photoAlt: "Ska Cubano photo",
      photoNumber: "No.",
      backToMembers: "← Back to Band Members",
      profilePhoto: "Profile Photo",
      memberPhotosTitle: "PHOTO GALLERY OF",
      noMemberPhotos: "No additional photos have been added yet for",
      defaultBio: "A key member of Ska Cubano.",
      defaultBioDetail: "A standout member of the international Ska Cubano ensemble.",
      viewProfile: "View profile of",
    },
    // Visor de fotos (lightbox)
    lightbox: {
      dialogLabel: "Photo viewer",
      close: "Close (Esc)",
      prev: "Previous (Left arrow)",
      next: "Next (Right arrow)",
      archive: "SKA CUBANO ARCHIVE",
      mainPhoto: "★ MAIN PHOTO",
    },
    // Página 404
    notFound: {
      badge: "★ Error 404 ★",
      title: "PAGE NOT FOUND",
      text: "This song isn't on the setlist. The page you're looking for doesn't exist or has been moved.",
      homeBtn: "Back to the home page",
      galleryBtn: "See the gallery",
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
      heading: "Ska Cubano – Jamaican ska and Cuban son, from Santiago de Cuba to London",
      photoAlt: "Ska Cubano live on stage",
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
      videoFallback: "Your browser does not support HTML5 video.",
      events: [
        {
          year: "2001",
          title: "SANTIAGO DE CUBA",
          subtitle: "The idea of an alternative history",
          text: "Investment manager Peter A. Scott decides to recreate an 'alternative history in which Cuban ska had emerged naturally'. He travels to Santiago de Cuba with the charismatic singer and DJ Natty Bo (Nathan Lerner) to rehearse and record their debut album with local talents such as singer Beny Billy (Juan Manuel Villy Carbonell).",
          stamp: "CUBA • 2001",
          caption: "Santiago de Cuba 2001 • First rehearsals"
        },
        {
          year: "2004",
          title: "DEBUT ALBUM & BIG BAND",
          subtitle: "Release of 'Ska Cubano' & London Connection",
          text: "In 2004, the band releases their self-titled debut album, 'Ska Cubano'. Later that year, the line-up consolidates in London with top-tier Caribbean and international musicians, including Rey Crespo and Ernesto Estruch (Havana), Dr. Sleepy (Montserrat), Eddie 'Tan Tan' Thornton (Jamaica), Miss Megoo (Japan) and Trevor Edwards (London), with Beny Billy constantly traveling from Cuba for tours and recordings.",
          stamp: "DEBUT ALBUM • 2004",
          caption: "2004 • Debut album 'Ska Cubano' & Big Band"
        },
        {
          year: "2005",
          title: "¡AY CARAMBA!",
          subtitle: "BBC World Music Award Nomination",
          text: "They release their acclaimed second album, '¡Ay Caramba!', which is nominated for the prestigious BBC World Music Award in the 'Crossover' category. The music press describes it as 'imaginative, full of melody, wit and a joyful fusion of irresistible rhythms'. In 2006, Venezuelan singer Carlos Peña joins as co-lead vocalist.",
          stamp: "BBC AWARD • 2005",
          caption: "¡Ay Caramba! • BBC World Music Award"
        },
        {
          year: "2010",
          title: "MAMBO SKA",
          subtitle: "High-octane sound",
          text: "They release 'Mambo Ska', described by the prestigious magazine All About Jazz as 'a loud, messy, irresistible explosion of high-octane music'. Their popular song 'Soy Campesino' becomes a Christmas advertising phenomenon in the UK for the Comet chain.",
          stamp: "MAMBO • 2010",
          caption: "Mambo Ska 2010 • High-octane sound"
        },
        {
          year: "LEGACY",
          title: "GLOBAL TOURS",
          subtitle: "Conquered over 30 countries",
          text: "With one of the most energetic and festive live shows in the world, Ska Cubano performs on major international stages and festivals such as Glastonbury, WOMAD and Big Day Out, taking their infectious fusion to every corner of the planet.",
          stamp: "WORLD TOUR",
          caption: "World Tour • Glastonbury & WOMAD"
        }
      ]
    },
    // Albums
    albums: {
      badge: "— Musical Selection —",
      title: "DISCOGRAPHY",
      tracklist: "Tracklist",
      play: "Play",
      pause: "Pause",
      listenOn: "Listen on",
      songs: "songs",
      types: { studio: "Studio album", remix: "Remix album" },
      playAlbum: "Play a preview of",
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
      },
      tagline: "★ World Tours 2004 — 2014 • London to Santiago ★",
      playVideo: "Play video",
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
        errorSend: "There was a problem sending your message. Please try again.",
        errorNetwork: "Connection error. Please check your internet connection.",
        dateLocale: "en-GB",
        followUs: "Follow Us"
      }
    },
    // Footer
    footer: {
      description: "The explosive clash of classic Jamaican ska and infectious Cuban rhythms.",
      quickLinks: "Quick Links",
      rights: "Ska Cubano. All rights reserved.",
      legacyText: "Santiago de Cuba to London • 2001 — Present",
      designedBy: "Designed & Developed by"
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
      home: "Volver al inicio",
      toggleMenu: "Abrir o cerrar el menú",
    },
    gallery: {
      badge: "★ Archivo y Recuerdos ★",
      title: "GALERÍA DE FOTOS",
      subtitle: "Revive los conciertos legendarios, momentos de camerino y perfiles individuales de la orquesta Ska Cubano.",
      tabBand: "Galería General",
      tabMembers: "Integrantes",
      allPhotos: "Todas las fotos",
      memberProfile: "Perfil del Integrante",
      mainPhoto: "Foto Principal",
      additionalPhotos: "Fotos Adicionales",
      noPhotos: "No hay fotos disponibles en esta categoría.",
      backToTop: "Volver Arriba",
      adminBtn: "Panel Admin",
      loading: "Cargando galería vintage Ska Cubano...",
      noBandPhotos: "No hay fotografías en la galería general de la banda.",
      scrollLeft: "Desplazar a la izquierda",
      scrollRight: "Desplazar a la derecha",
      prevPhoto: "Fotografía anterior",
      nextPhoto: "Fotografía siguiente",
      photoAlt: "Foto de Ska Cubano",
      photoNumber: "Nº",
      backToMembers: "← Volver a Integrantes",
      profilePhoto: "Foto de Perfil",
      memberPhotosTitle: "GALERÍA DE FOTOS DE",
      noMemberPhotos: "Aún no se han añadido fotos adicionales para",
      defaultBio: "Integrante fundamental de Ska Cubano.",
      defaultBioDetail: "Integrante destacado del ensamble internacional Ska Cubano.",
      viewProfile: "Ver el perfil de",
    },
    // Visor de fotos (lightbox)
    lightbox: {
      dialogLabel: "Visor de fotos",
      close: "Cerrar (Esc)",
      prev: "Anterior (Flecha izquierda)",
      next: "Siguiente (Flecha derecha)",
      archive: "ARCHIVO SKA CUBANO",
      mainPhoto: "★ FOTO PRINCIPAL",
    },
    // Página 404
    notFound: {
      badge: "★ Error 404 ★",
      title: "PÁGINA NO ENCONTRADA",
      text: "Esta canción no está en el repertorio. La página que buscas no existe o se ha movido.",
      homeBtn: "Volver a la portada",
      galleryBtn: "Ver la galería",
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
      heading: "Ska Cubano – ska jamaicano y son cubano, de Santiago de Cuba a Londres",
      photoAlt: "Ska Cubano en directo",
    },
    // History
    history: {
      badge: "— Nuestra Trayectoria —",
      title: "HISTORIA",
      videoBadge: "★ PRESENTACIÓN OFICIAL Y DOCUMENTAL ★",
      videoTitle: "La Historia de Ska Cubano",
      videoDesc: "Descubre el origen, la energía y la fusión del Ska jamaicano con el auténtico sabor del Son cubano en este vídeo de presentación oficial.",
      quote: `"Aunque la banda hoy no está en activo, la fusión mágica del Ska jamaicano y el Son cubano sigue resonando en sus grabaciones y en la memoria de miles de fans en todo el mundo."`,
      tag: "★ ORIGINAL SKA & SON ★",
      videoFallback: "Tu navegador no soporta el reproductor de vídeo HTML5.",
      events: [
        {
          year: "2001",
          title: "SANTIAGO DE CUBA",
          subtitle: "La idea de una historia alternativa",
          text: "El gestor de inversiones Peter A. Scott decide recrear una 'historia alternativa en la que el ska cubano hubiera surgido de forma natural'. Viaja a Santiago de Cuba con el carismático cantante y DJ Natty Bo (Nathan Lerner) para ensayar y grabar su álbum debut con talentos locales como el cantante Beny Billy (Juan Manuel Villy Carbonell).",
          stamp: "CUBA • 2001",
          caption: "Santiago de Cuba 2001 • Primeros ensayos"
        },
        {
          year: "2004",
          title: "ÁLBUM DEBUT Y LA BIG BAND",
          subtitle: "Lanzamiento de 'Ska Cubano' y Conexión Londres-Caribe",
          text: "En 2004 ve la luz su primer álbum homónimo, 'Ska Cubano'. Ese mismo año la banda se consolida en Londres reuniendo a músicos caribeños e internacionales de primer nivel, incluyendo a Rey Crespo y Ernesto Estruch (La Habana), Dr. Sleepy (Montserrat), Eddie 'Tan Tan' Thornton (Jamaica), Miss Megoo (Japón) y Trevor Edwards (Londres), con Beny Billy viajando constantemente desde Cuba para giras y grabaciones.",
          stamp: "ÁLBUM DEBUT • 2004",
          caption: "2004 • Primer álbum 'Ska Cubano' & Big Band"
        },
        {
          year: "2005",
          title: "¡AY CARAMBA!",
          subtitle: "Nominación a los Premios BBC",
          text: "Lanzan su aclamado segundo álbum, '¡Ay Caramba!', que es nominado a los prestigiosos premios BBC World Music Award en la categoría 'Crossover'. La prensa musical lo describe como 'imaginativo, lleno de melodía, ingenio y una fusión alegre de ritmos irresistibles'. En 2006, el cantante venezolano Carlos Peña se une como co-líder vocal.",
          stamp: "PREMIO BBC • 2005",
          caption: "¡Ay Caramba! • Premio BBC World Music"
        },
        {
          year: "2010",
          title: "MAMBO SKA",
          subtitle: "Sonido de alto octanaje",
          text: "Se publica 'Mambo Ska', calificado por la prestigiosa revista All About Jazz como 'una explosión ruidosa, desordenada e irresistible de música de alto octanaje'. Su popular tema 'Soy Campesino' se convierte en un fenómeno publicitario navideño en el Reino Unido para la cadena Comet.",
          stamp: "MAMBO • 2010",
          caption: "Mambo Ska 2010 • Sonido de alto octanaje"
        },
        {
          year: "LEGADO",
          title: "GIRAS GLOBALES",
          subtitle: "Más de 30 países conquistados",
          text: "Con uno de los directos más enérgicos y fiesteros del mundo, Ska Cubano se presenta en los principales escenarios y festivales internacionales de prestigio como Glastonbury, WOMAD y Big Day Out, llevando su fusión contagiosa a rincones de todo el planeta.",
          stamp: "GIRA MUNDIAL",
          caption: "World Tour • Glastonbury & WOMAD"
        }
      ]
    },
    // Albums
    albums: {
      badge: "— Selección Musical —",
      title: "DISCOGRAFÍA",
      tracklist: "Tracklist",
      play: "Reproducir",
      pause: "Pausar",
      listenOn: "Escúchalo en",
      songs: "canciones",
      types: { studio: "Álbum de estudio", remix: "Álbum de remezclas" },
      playAlbum: "Escuchar un fragmento de",
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
      },
      tagline: "★ Giras mundiales 2004 — 2014 • Londres a Santiago ★",
      playVideo: "Reproducir vídeo",
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
        errorSend: "Hubo un problema al enviar el mensaje. Inténtalo de nuevo.",
        errorNetwork: "Error de conexión. Revisa tu internet.",
        dateLocale: "es-ES",
        followUs: "Síguenos"
      }
    },
    // Footer
    footer: {
      description: "La explosiva colisión entre el ska jamaicano clásico y los ritmos contagiosos de Cuba.",
      quickLinks: "Enlaces Rápidos",
      rights: "Ska Cubano. Todos los derechos reservados.",
      legacyText: "Santiago de Cuba a Londres • 2001 — Presente",
      designedBy: "Diseñado y Desarrollado por"
    }
  }
};

// La portada existe en dos direcciones: "/" (inglés) y "/es" (español), cada una con su HTML ya traducido
const isSpanishHome = (path) => path === "/es" || path === "/es/";
const isHome = (path) => path === "/" || isSpanishHome(path);
// El panel de admin y los enlaces privados solo existen en español
const isSpanishOnly = (path) => /^\/(admin|privado)(\/|$)/.test(path);

// Texto de un dato (foto, integrante...) en el idioma activo: en inglés usa el campo "<campo>En"
// y, mientras no esté traducido, vuelve al texto en español en vez de dejarlo vacío.
export function localized(item, field, lang) {
  if (!item) return "";
  if (lang === "en" && item[`${field}En`]) return item[`${field}En`];
  return item[field] || "";
}

export function LanguageProvider({ children }) {
  const pathname = usePathname() || "/";
  // El idioma inicial sale de la URL, así /es se genera en español al compilar
  const [lang, setLang] = useState(() => (isSpanishHome(pathname) ? "es" : "en"));

  // Al navegar a una de las portadas, el idioma sigue a la URL. En el resto de páginas se mantiene el elegido.
  // (Se ajusta durante el render al cambiar la URL, como recomienda React, en vez de en un efecto)
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (isHome(pathname)) setLang(isSpanishHome(pathname) ? "es" : "en");
  }

  // Idioma del documento (lectores de pantalla, traductor del navegador y buscadores)
  useEffect(() => {
    document.documentElement.lang = isSpanishOnly(pathname) ? "es" : lang;
  }, [lang, pathname]);

  const toggleLanguage = () => {
    const next = lang === "en" ? "es" : "en";
    setLang(next);
    // En la portada, cambia también la dirección (/ ↔ /es) conservando la sección (#music, #shows…)
    if (isHome(window.location.pathname)) {
      const target = (next === "es" ? "/es" : "/") + window.location.hash;
      window.history.replaceState(window.history.state, "", target);
    }
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
