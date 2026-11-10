<?php
// ⚠️ SOLO PARA EL ENTORNO DE PRUEBA EN VERCEL (skacubano-web-test.vercel.app). NO forma parte del proyecto final.
// En names.co.uk este fichero no se sube ni se usa (no está dentro de out/): allí Apache envía /api/*
// directamente a public/api/index.php gracias al .htaccess.
// Se puede borrar, junto con vercel.json, scripts/vercel-postbuild.mjs y el script "build:vercel"
// de package.json, cuando ya no haga falta la web de prueba en Vercel.
//
// Punto de entrada de la API para el runtime vercel-php.
//
// Vercel no tiene disco persistente: lo único escribible es /tmp, y se borra cuando la función
// se "enfría" o cambia de instancia. Por eso aquí:
//   - Los datos (galería, shows, enlaces privados) se crean en /tmp a partir de public/api/seed/.
//     Se pueden VER, pero lo que se cambie desde el panel se perderá al cabo de un rato.
//   - La contraseña y el secreto de las sesiones salen de variables de entorno del proyecto en Vercel
//     (ADMIN_PASSWORD y ADMIN_SECRET), para que el login funcione igual en todas las instancias.

$tmpRoot = rtrim(sys_get_temp_dir(), '/') . '/skacubano';
if (!getenv('SKACUBANO_DATA_DIR')) {
    putenv('SKACUBANO_DATA_DIR=' . $tmpRoot . '/data');
}
if (!getenv('SKACUBANO_PUBLIC_DIR')) {
    putenv('SKACUBANO_PUBLIC_DIR=' . $tmpRoot . '/public');
}

// config.php inicial a partir de las variables de entorno (si existen)
$dataDir = getenv('SKACUBANO_DATA_DIR');
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}
$configPath = $dataDir . '/config.php';
$envPassword = (string) getenv('ADMIN_PASSWORD');
$envSecret = (string) getenv('ADMIN_SECRET');
if (!file_exists($configPath) && $envPassword !== '' && $envSecret !== '') {
    $config = ['admin_password' => $envPassword, 'admin_secret' => $envSecret];
    @file_put_contents($configPath, '<?php return ' . var_export($config, true) . ";\n");
}

// La reescritura de vercel.json manda la ruta original en ?__path=... por si REQUEST_URI llega como /api/index.php
if (isset($_GET['__path'])) {
    $original = '/api/' . ltrim((string) $_GET['__path'], '/');
    unset($_GET['__path']);
    $query = http_build_query($_GET);
    $_SERVER['REQUEST_URI'] = $original . ($query !== '' ? '?' . $query : '');
}

require __DIR__ . '/../public/api/index.php';
