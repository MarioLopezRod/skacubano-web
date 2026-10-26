/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

// En desarrollo, las llamadas a /api/* se reenvían al servidor PHP local (php -S localhost:8000 ...).
// En producción la web se compila a ficheros estáticos (carpeta out/) que se suben al hosting junto con la API PHP.
const phpApiUrl = process.env.PHP_API_URL || "http://localhost:8000";

const nextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  ...(isDev
    ? {
        async rewrites() {
          return [{ source: "/api/:path*", destination: `${phpApiUrl}/api/:path*` }];
        },
      }
    : { output: "export" }),
};

export default nextConfig;
