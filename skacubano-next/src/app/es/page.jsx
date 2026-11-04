import HomePage from "../../components/HomePage";
import { homeMetadata } from "../../lib/seo";

// Versión en español de la portada: se genera ya traducida para que Google la indexe en español
export const metadata = homeMetadata("es");

export default function HomeEs() {
  return <HomePage lang="es" />;
}
