// Después de `next build`, quita de out/ los datos y las fotos que se hayan generado al probar en local.
// Next copia public/ entero dentro de out/: si quedara public/data/ (contraseña, galería, enlaces privados)
// o public/uploads/gallery/ (fotos de prueba), al subir out/ al hosting se sobrescribirían los datos reales.
import { rmSync, existsSync } from "node:fs";

for (const dir of ["out/data", "out/uploads/gallery"]) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`postbuild: eliminada ${dir} (datos de pruebas en local, no se suben al hosting)`);
  }
}
