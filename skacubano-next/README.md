# Ska Cubano — web oficial

La parte visual está hecha con Next.js (React) y se **compila a ficheros estáticos** (HTML, JS, CSS).
Todo lo que se ejecuta en el servidor (login del admin, galería, subida de fotos, enlaces privados)
está en **PHP 8.4** en `public/api/`. Así la web funciona en el hosting compartido de names.co.uk,
que no tiene Node.js: Node solo hace falta en vuestro ordenador para compilar.

## Estructura

| Ruta | Qué es |
| --- | --- |
| `src/` | Código React de la web, la galería, el panel de admin y los enlaces privados |
| `public/api/index.php` | API en PHP (mismas URLs que antes: `/api/gallery`, `/api/admin/login`...) |
| `public/api/lib/` | Funciones de la API: autenticación, lectura/escritura de los JSON |
| `public/api/seed/` | Datos iniciales de la galería y los enlaces privados (solo se usan la primera vez) |
| `public/.htaccess` | Reglas de Apache: URLs limpias, `/privado/<slug>`, `/api/*` y bloqueo de `/data` |
| `public/uploads/` | Ficheros subidos desde el panel de admin |

En el servidor, la API guarda los datos en la carpeta `data/` (en la raíz de la web, bloqueada para
los visitantes):

- `data/galleryData.json`: integrantes, fotos y secciones de la galería.
- `data/privateLinks.json`: enlaces privados (riders técnicos) y sus claves.
- `data/config.php`: contraseña del panel de admin (guardada como hash, nunca en texto plano).
- `data/login_attempts.json`: intentos fallidos de contraseña, para bloquear durante 15 minutos una IP
  tras 5 fallos.

La primera vez que se usa la API, si estos ficheros no existen, se crean a partir de `public/api/seed/`.

## Desarrollo en local

Hace falta Node.js y PHP 8.2 o superior. En dos terminales:

```bash
npm install
npm run dev:php   # API PHP en http://localhost:8000
npm run dev       # web en http://localhost:3000 (reenvía /api/* a PHP)
```

En local los datos (contraseña, galería, enlaces privados) se guardan en `.data/`, fuera de `public/`,
y las fotos subidas en `public/uploads/gallery/`. Ninguna de las dos carpetas se sube al repositorio.
Si tenías datos de pruebas en la antigua `public/data/`, puedes moverlos a `.data/` o borrarlos.

`npm run build` borra de `out/` las carpetas `data/` y `uploads/gallery/` por si quedaran restos de pruebas
en `public/`: así nunca se suben al hosting ni sobrescriben los datos reales.

## Web de prueba en Vercel (solo test, no es el proyecto final)

Estos ficheros existen **solo** para que funcione la web de prueba en `skacubano-web-test.vercel.app`.
No se usan en names.co.uk y se pueden borrar cuando ya no haga falta esa prueba:

| Fichero | Para qué sirve en Vercel |
| --- | --- |
| `vercel.json` | Ejecuta la API con el runtime `vercel-php` y reescribe `/api/*` y `/privado/<slug>` |
| `api/index.php` | Entrada de la API en Vercel: datos en `/tmp` y contraseña desde variables de entorno |
| `scripts/vercel-postbuild.mjs` + script `build:vercel` | Quita el PHP y los JSON semilla de los ficheros estáticos |

En Vercel hay que definir las variables `ADMIN_PASSWORD` y `ADMIN_SECRET` (texto largo aleatorio).
Vercel no guarda ficheros de forma permanente: se puede ver la galería e iniciar sesión, pero los cambios
hechos desde el panel (fotos, integrantes, contraseña) se pierden al cabo de un rato.

## Compilar y subir al hosting (names.co.uk)

1. Compilar:

   ```bash
   npm run build
   ```

   Esto genera la carpeta `out/` con la web completa (páginas, imágenes, vídeos, API PHP y `.htaccess`).

2. Subir **el contenido** de `out/` a la raíz de la web del hosting (normalmente `public_html/`)
   por FTP o SSH. Al subir, sobrescribid los ficheros existentes, pero **no borréis nunca las carpetas
   `data/` ni `uploads/` del servidor**: ahí están las fotos y los datos que se gestionan desde el panel.

   Con SSH y `rsync` (desde la carpeta del proyecto):

   ```bash
   rsync -av out/ USUARIO@SERVIDOR:public_html/
   ```

   (sin `--delete`, para no borrar `data/` ni `uploads/`).

3. En el panel de names.co.uk (Advanced → PHP settings), seleccionar **PHP 8.4**.

4. La primera vez: entrar en `/admin/login` con la contraseña inicial (`skacubano2026`) para que se cree
   `data/config.php`, y **cambiar la contraseña inmediatamente** (ver abajo).

## Cambiar la contraseña del panel de admin

Desde el panel: botón **🔑 Contraseña** de la barra superior. Pide la contraseña actual y la nueva dos veces
(mínimo 10 caracteres). Al cambiarla se cierran las sesiones abiertas en otros dispositivos.

### Código de recuperación

La primera vez que se cambia la contraseña, el panel muestra un **código de recuperación**
(`XXXX-XXXX-XXXX-XXXX`) una sola vez; en `data/config.php` solo se guarda su hash (`recovery_code_hash`).
Desde el mismo modal se puede generar uno nuevo (pide la contraseña actual y anula el anterior).

### Si se olvida la contraseña

En `/admin/login` → **¿Has olvidado la contraseña?**: con el código de recuperación se pone una contraseña
nueva y se entra al panel. Se cierran las demás sesiones y el código usado se sustituye por uno nuevo, que se
muestra en ese momento. Los intentos fallidos cuentan para el mismo bloqueo que el login (5 fallos → 15 min).

Si tampoco se tiene el código, editar en el servidor el fichero `data/config.php` (por FTP o SSH): borrar la línea de `admin_password_hash`
y añadir una con la contraseña nueva en texto plano:

```php
return array (
  'admin_password' => 'nueva-contraseña',
  'admin_secret' => '...',
  ...
);
```

Al entrar con ella en `/admin/login`, se vuelve a guardar como hash y desaparece el texto plano.
Si además se cambia `admin_secret` (cualquier texto largo y aleatorio), se cierran las sesiones abiertas
de todos los administradores.
