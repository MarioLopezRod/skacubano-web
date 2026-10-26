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
- `data/config.php`: contraseña del panel de admin.

La primera vez que se usa la API, si estos ficheros no existen, se crean a partir de `public/api/seed/`.

## Desarrollo en local

Hace falta Node.js y PHP 8.2 o superior. En dos terminales:

```bash
npm install
npm run dev:php   # API PHP en http://localhost:8000
npm run dev       # web en http://localhost:3000 (reenvía /api/* a PHP)
```

En local los datos se guardan en `public/data/` y las fotos subidas en `public/uploads/gallery/`
(ninguna de las dos carpetas se sube al repositorio).

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

Editar en el servidor el fichero `data/config.php` (por FTP o SSH) y cambiar el valor de `admin_password`:

```php
return array (
  'admin_password' => 'nueva-contraseña',
  'admin_secret' => '...',
);
```

Si además se cambia `admin_secret` (cualquier texto largo y aleatorio), se cierran las sesiones abiertas
de todos los administradores.
