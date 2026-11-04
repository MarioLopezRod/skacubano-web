import { SITE_URL } from "../lib/seo";

// La web se publica como ficheros estáticos: se genera una sola vez al compilar
export const dynamic = "force-static";

// Genera /robots.txt al compilar.
// El panel de admin y los enlaces privados no se bloquean aquí a propósito: llevan "noindex",
// y Google solo puede ver ese "noindex" si se le deja entrar.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
