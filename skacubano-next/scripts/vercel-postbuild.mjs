// ⚠️ SOLO PARA EL ENTORNO DE PRUEBA EN VERCEL. NO forma parte del proyecto final:
// para names.co.uk se compila con `npm run build`, que no ejecuta este script (allí out/api SÍ hace falta).
//
// Después de `next build`, quita de out/ la API PHP y sus datos semilla.
// En Vercel la API la ejecuta api/index.php (runtime vercel-php); si se dejaran aquí, Vercel serviría
// el código PHP y los JSON (con las claves de los enlaces privados) como ficheros descargables.
import { rmSync } from "node:fs";

for (const dir of ["out/api", "out/data"]) {
  rmSync(dir, { recursive: true, force: true });
}
console.log("vercel-postbuild: eliminadas out/api y out/data de los ficheros estáticos");
