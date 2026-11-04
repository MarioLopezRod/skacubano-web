import { shareImage } from "../../lib/seo";

// Metadatos de la galería (la página es de cliente y no puede exportarlos ella misma)
export const metadata = {
  title: "Photo Gallery",
  description:
    "Photos of Ska Cubano and its musicians on stage and behind the scenes, from Santiago de Cuba to festivals around the world.",
  alternates: { canonical: "/galeria" },
  openGraph: { url: "/galeria", title: "Photo Gallery | Ska Cubano", images: [shareImage] },
};

export default function Layout({ children }) {
  return children;
}
