<?php
// Solo para desarrollo local con el servidor integrado de PHP (no usa .htaccess):
//   php -S localhost:8000 -t public public/api/dev-router.php

// En local los datos (config.php con la contraseña, JSON de la galería y de los enlaces privados) se guardan
// en skacubano-next/.data/, FUERA de public/: así `next dev` no los sirve y `npm run build` no los copia a out/.
if (!defined('DATA_DIR')) {
    define('DATA_DIR', getenv('SKACUBANO_DATA_DIR') ?: dirname(__DIR__, 2) . '/.data');
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (strpos($path, '/api/') === 0) {
    require __DIR__ . '/index.php';
    return true;
}
return false;
