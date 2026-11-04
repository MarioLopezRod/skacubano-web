import { SITE_URL } from "../lib/seo";

// La web se publica como ficheros estáticos: se genera una sola vez al compilar
export const dynamic = "force-static";

// Genera /sitemap.xml al compilar con las páginas públicas.
export default function sitemap() {
  const lastModified = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { en: `${SITE_URL}/`, es: `${SITE_URL}/es` } },
    },
    {
      url: `${SITE_URL}/es`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { en: `${SITE_URL}/`, es: `${SITE_URL}/es` } },
    },
    {
      url: `${SITE_URL}/galeria`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
