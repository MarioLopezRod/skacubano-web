<?php
// Autenticación del panel de admin: cookie firmada con HMAC-SHA256 (mismo esquema que lib/auth.js)

const ADMIN_COOKIE = 'skacubano_admin_token';
const ADMIN_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// La configuración (contraseña y secreto) vive en DATA_DIR/config.php, fuera del código desplegado,
// para que subir una nueva versión de la web no la sobrescriba. Si no existe se crea la primera vez.
function load_config()
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $path = DATA_DIR . '/config.php';
    if (!file_exists($path)) {
        $initial = [
            'admin_password' => 'skacubano2026',
            'admin_secret' => bin2hex(random_bytes(32)),
        ];
        $php = "<?php\n"
            . "// Configuración del panel de admin de Ska Cubano.\n"
            . "// Para cambiar la contraseña, edita 'admin_password' y guarda el fichero.\n"
            . "// Si cambias 'admin_secret', se cerrará la sesión de todos los administradores.\n"
            . 'return ' . var_export($initial, true) . ";\n";
        @file_put_contents($path, $php, LOCK_EX);
        $config = $initial;
        return $config;
    }

    $loaded = require $path;
    $config = is_array($loaded) ? $loaded : [];
    return $config;
}

function get_admin_password()
{
    $config = load_config();
    return isset($config['admin_password']) ? (string) $config['admin_password'] : '';
}

function get_admin_secret()
{
    $config = load_config();
    return isset($config['admin_secret']) ? (string) $config['admin_secret'] : '';
}

function base64url_encode($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data)
{
    return base64_decode(strtr($data, '-_', '+/'), true);
}

function create_signed_token()
{
    $payload = [
        'role' => 'admin',
        'iat' => now_ms(),
        'exp' => now_ms() + ADMIN_TOKEN_TTL_MS,
        'nonce' => bin2hex(random_bytes(16)),
    ];
    $payloadB64 = base64url_encode(json_encode($payload));
    $signature = hash_hmac('sha256', $payloadB64, get_admin_secret());
    return $payloadB64 . '.' . $signature;
}

function verify_signed_token($token)
{
    if (!is_string($token) || $token === '') {
        return false;
    }
    $parts = explode('.', $token);
    if (count($parts) !== 2) {
        return false;
    }
    list($payloadB64, $signature) = $parts;

    $secret = get_admin_secret();
    if ($secret === '') {
        return false;
    }
    $expected = hash_hmac('sha256', $payloadB64, $secret);
    if (!hash_equals($expected, $signature)) {
        return false;
    }

    $json = base64url_decode($payloadB64);
    $payload = $json === false ? null : json_decode($json, true);
    if (!is_array($payload) || empty($payload['exp']) || now_ms() > $payload['exp']) {
        return false;
    }
    return true;
}

function is_admin()
{
    return verify_signed_token(isset($_COOKIE[ADMIN_COOKIE]) ? $_COOKIE[ADMIN_COOKIE] : null);
}

function require_admin($message = 'No autorizado')
{
    if (!is_admin()) {
        json_response(['error' => $message], 401);
    }
}

function is_https()
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
}

function set_admin_cookie($value, $maxAgeSeconds)
{
    setcookie(ADMIN_COOKIE, $value, [
        'expires' => $maxAgeSeconds > 0 ? time() + $maxAgeSeconds : time() - 3600,
        'path' => '/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}
