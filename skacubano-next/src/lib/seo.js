// Configuración SEO de la web: dominio, textos por idioma y datos estructurados (schema.org).
import { albums } from "../data/albums";

// Dominio público. Se puede cambiar sin tocar código con la variable NEXT_PUBLIC_SITE_URL al compilar.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://skacubano.com").replace(/\/$/, "");
export const SITE_NAME = "Ska Cubano";

// Perfiles oficiales (los mismos que enlaza la web)
export const SOCIAL_PROFILES = [
  "https://facebook.com/skacubano",
  "https://instagram.com/skacubano",
  "https://x.com/skcubano",
  "https://en.wikipedia.org/wiki/Ska_Cubano",
];

export const seoText = {
  en: {
    path: "/",
    locale: "en_GB",
    title: "Ska Cubano – Official Site",
    description:
      "Official site of Ska Cubano, the band fusing Jamaican ska with Cuban son, mambo and cumbia: albums, legendary live shows, history, photos and contact.",
  },
  es: {
    path: "/es",
    locale: "es_ES",
    title: "Ska Cubano – Web oficial",
    description:
      "Web oficial de Ska Cubano, la banda que fusiona el ska jamaicano con el son, el mambo y la cumbia de Cuba: discos, conciertos, historia, fotos y contacto.",
  },
};

// Enlaces entre las versiones de idioma (hreflang) para la portada
export const homeAlternates = {
  en: "/",
  es: "/es",
  "x-default": "/",
};

// Imagen para compartir en redes (src/app/opengraph-image.jpg). Se pone explícita porque una página
// que define su propio openGraph deja de heredar la imagen del layout.
export const shareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Ska Cubano",
};

// Metadatos completos de la portada en un idioma
export function homeMetadata(lang) {
  const text = seoText[lang];
  return {
    title: { absolute: text.title },
    description: text.description,
    alternates: { canonical: text.path, languages: homeAlternates },
    openGraph: {
      type: "website",
      url: text.path,
      siteName: SITE_NAME,
      title: text.title,
      description: text.description,
      locale: text.locale,
      alternateLocale: lang === "en" ? [seoText.es.locale] : [seoText.en.locale],
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: text.title,
      description: text.description,
      images: [shareImage.url],
    },
  };
}

const abs = (path) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

// Datos estructurados para Google: el grupo, sus discos y la propia web
export function homeJsonLd(lang) {
  const text = seoText[lang];
  const bandId = `${SITE_URL}/#band`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicGroup",
        "@id": bandId,
        name: SITE_NAME,
        url: abs(text.path),
        description: text.description,
        logo: abs("/images/logos/logoSkaCubano.png"),
        image: abs("/opengraph-image.jpg"),
        genre: ["Ska", "Son cubano", "Mambo", "Cumbia", "Latin"],
        foundingDate: "2001",
        foundingLocation: { "@type": "Place", name: "Santiago de Cuba, Cuba" },
        sameAs: SOCIAL_PROFILES,
        album: albums.map((album) => ({
          "@type": "MusicAlbum",
          name: album.title,
          datePublished: album.year,
          image: abs(album.cover),
          byArtist: { "@id": bandId },
          sameAs: [album.links?.sp, album.links?.ap, album.links?.yt].filter(Boolean),
          ...(album.tracks?.length ? { numTracks: album.tracks.length } : {}),
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: abs("/"),
        name: SITE_NAME,
        inLanguage: lang === "es" ? "es" : "en",
        publisher: { "@id": bandId },
      },
    ],
  };
}
