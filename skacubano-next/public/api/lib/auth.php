<?php
// Autenticación del panel de admin: cookie firmada con HMAC-SHA256 (mismo esquema que lib/auth.js)

const ADMIN_COOKIE = 'skacubano_admin_token';
const ADMIN_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Contraseña con la que se crea config.php la primera vez
const DEFAULT_ADMIN_PASSWORD = 'skacubano2026';
const MIN_ADMIN_PASSWORD_LENGTH = 10;
// bcrypt solo tiene en cuenta los primeros 72 bytes
const MAX_ADMIN_PASSWORD_BYTES = 72;

// Protección contra fuerza bruta: tras 5 fallos desde la misma IP, bloqueo de 15 minutos
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCK_SECONDS = 15 * 60;

// Caché de la configuración durante la petición, compartida por load_config() y save_config()
function &config_cache()
{
    static $config = null;
    return $config;
}

// La configuración (contraseña y secreto) vive en DATA_DIR/config.php, fuera del código desplegado,
// para que subir una nueva versión de la web no la sobrescriba. Si no existe se crea la primera vez.
// La contraseña se guarda como hash (password_hash) en 'admin_password_hash'.
function load_config()
{
    $config = &config_cache();
    if ($config !== null) {
        return $config;
    }

    $path = DATA_DIR . '/config.php';
    if (!file_exists($path)) {
        $initial = [
            'admin_password_hash' => password_hash(DEFAULT_ADMIN_PASSWORD, PASSWORD_DEFAULT),
            'admin_secret' => bin2hex(random_bytes(32)),
        ];
        if (!save_config($initial)) {
            $config = $initial;
        }
        return $config;
    }

    $loaded = require $path;
    $config = is_array($loaded) ? $loaded : [];
    return $config;
}

function save_config($newConfig)
{
    $path = DATA_DIR . '/config.php';
    $php = "<?php\n"
        . "// Configuración del panel de admin de Ska Cubano. La contraseña se cambia desde el panel.\n"
        . "// Si se olvida: borra la línea 'admin_password_hash' y añade 'admin_password' => 'nueva-contraseña',\n"
        . "// (al entrar con ella se guarda de nuevo como hash).\n"
        . "// Si cambias 'admin_secret', se cerrará la sesión de todos los administradores.\n"
        . 'return ' . var_export($newConfig, true) . ";\n";

    // Escritura atómica para no dejar nunca config.php a medias
    $tmp = $path . '.tmp' . getmypid();
    if (file_put_contents($tmp, $php, LOCK_EX) === false || !rename($tmp, $path)) {
        @unlink($tmp);
        return false;
    }
    // Sin esto, OPcache podría seguir usando la versión anterior del fichero durante unos segundos
    if (function_exists('opcache_invalidate')) {
        @opcache_invalidate($path, true);
    }

    $config = &config_cache();
    $config = $newConfig;
    return true;
}

function verify_admin_password($password)
{
    $password = (string) $password;
    if ($password === '') {
        return false;
    }
    $config = load_config();

    // Contraseña en texto plano: config.php antiguo o restablecido a mano. Si es correcta, se pasa a hash.
    if (isset($config['admin_password']) && (string) $config['admin_password'] !== '') {
        if (!hash_equals((string) $config['admin_password'], $password)) {
            return false;
        }
        set_admin_password($password, false);
        return true;
    }

    return !empty($config['admin_password_hash']) && password_verify($password, $config['admin_password_hash']);
}

// Guarda la nueva contraseña como hash. Con $rotateSecret se cierran las demás sesiones abiertas.
function set_admin_password($password, $rotateSecret)
{
    $config = load_config();
    unset($config['admin_password']);
    $config['admin_password_hash'] = password_hash($password, PASSWORD_DEFAULT);
    if ($rotateSecret || empty($config['admin_secret'])) {
        $config['admin_secret'] = bin2hex(random_bytes(32));
    }
    return save_config($config);
}

// Devuelve el motivo si la nueva contraseña no es válida, o null si lo es
function validate_new_admin_password($password)
{
    if (strlen($password) > MAX_ADMIN_PASSWORD_BYTES) {
        return 'La contraseña es demasiado larga';
    }
    // Los espacios al principio o al final suelen ser un error al copiar y pegar: no se aceptan
    if ($password !== trim($password)) {
        return 'La nueva contraseña no puede empezar ni acabar con espacios';
    }
    // Los espacios no cuentan para la longitud mínima (una contraseña de solo espacios no vale)
    if (mb_strlen(preg_replace('/\s+/u', '', $password), 'UTF-8') < MIN_ADMIN_PASSWORD_LENGTH) {
        return 'La nueva contraseña debe tener al menos ' . MIN_ADMIN_PASSWORD_LENGTH . ' caracteres (sin contar espacios)';
    }
    if ($password === DEFAULT_ADMIN_PASSWORD) {
        return 'La nueva contraseña no puede ser la contraseña inicial';
    }
    return null;
}

/* ── Límite de intentos de contraseña ──────────────────────────────── */

// Hay un contador por IP y por tipo de clave ($scope): 'admin' para el panel y 'privado' para los enlaces
// privados. Así, un visitante que falla la clave de un enlace no bloquea el acceso al panel desde su IP.
// Se cuentan los fallos durante LOGIN_LOCK_SECONDS desde el primero; al llegar a LOGIN_MAX_ATTEMPTS
// se bloquea durante LOGIN_LOCK_SECONDS contados desde ese último fallo.

function login_attempts_key($scope = 'admin')
{
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
    return hash('sha256', $scope === 'admin' ? $ip : $scope . '|' . $ip);
}

// Si la entrada ya no cuenta (ventana de fallos o bloqueo terminados)
function login_attempt_expired($entry, $now)
{
    if (!empty($entry['lockedAt'])) {
        return $now - (int) $entry['lockedAt'] >= LOGIN_LOCK_SECONDS;
    }
    return $now - (int) $entry['first'] >= LOGIN_LOCK_SECONDS;
}

// Segundos que faltan para poder volver a intentarlo, o 0 si no hay bloqueo
function login_lock_remaining($scope = 'admin')
{
    $attempts = load_json_store('login_attempts.json', []);
    $key = login_attempts_key($scope);
    if (!isset($attempts[$key]) || empty($attempts[$key]['lockedAt'])) {
        return 0;
    }
    $remaining = LOGIN_LOCK_SECONDS - (time() - (int) $attempts[$key]['lockedAt']);
    return max(0, $remaining);
}

function register_failed_login($scope = 'admin')
{
    $attempts = load_json_store('login_attempts.json', []);
    $now = time();
    // Se descartan las entradas caducadas para que el fichero no crezca
    $attempts = array_filter($attempts, function ($entry) use ($now) {
        return !login_attempt_expired($entry, $now);
    });
    $key = login_attempts_key($scope);
    if (!isset($attempts[$key])) {
        $attempts[$key] = ['count' => 0, 'first' => $now];
    }
    $attempts[$key]['count']++;
    if ($attempts[$key]['count'] >= LOGIN_MAX_ATTEMPTS && empty($attempts[$key]['lockedAt'])) {
        $attempts[$key]['lockedAt'] = $now;
    }
    save_json_store('login_attempts.json', $attempts);
}

function clear_failed_logins($scope = 'admin')
{
    $attempts = load_json_store('login_attempts.json', []);
    $key = login_attempts_key($scope);
    if (isset($attempts[$key])) {
        unset($attempts[$key]);
        save_json_store('login_attempts.json', $attempts);
    }
}

function reject_if_locked($scope = 'admin')
{
    $remaining = login_lock_remaining($scope);
    if ($remaining > 0) {
        $minutes = (int) ceil($remaining / 60);
        json_response(['error' => 'Demasiados intentos fallidos. Prueba de nuevo en ' . $minutes . ' min.'], 429);
    }
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
