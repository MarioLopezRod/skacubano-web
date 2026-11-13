<?php
// API de Ska Cubano en PHP. Sustituye a las rutas de src/app/api (Next.js) con las mismas URLs y respuestas.
// Todas las peticiones a /api/* llegan aquí gracias a api/.htaccess.

// Carpeta de datos (JSON, config.php). Por defecto <raíz web>/data, protegida con .htaccess.
if (!defined('DATA_DIR')) {
    define('DATA_DIR', getenv('SKACUBANO_DATA_DIR') ?: dirname(__DIR__) . '/data');
}
// Raíz pública de la web, donde se guardan /uploads
if (!defined('PUBLIC_DIR')) {
    define('PUBLIC_DIR', getenv('SKACUBANO_PUBLIC_DIR') ?: dirname(__DIR__));
}

// Valor del selector de destino de una foto que solo va al carrusel de la portada
const CARRUSEL_ID = 'carrusel';

// Segundos durante los que vale la clave introducida en /privado/<slug> sin volver a pedirla (12 horas)
const PRIVATE_ACCESS_TTL = 12 * 60 * 60;

// Valores que usan el panel y la API con un significado especial: ningún integrante ni sección puede llamarse así
const RESERVED_GALLERY_IDS = ['banda', 'carrusel', 'todos', 'integrantes', 'member', 'section', 'photo', 'reorder'];

require __DIR__ . '/lib/helpers.php';
require __DIR__ . '/lib/auth.php';

ensure_dir(DATA_DIR);
if (!file_exists(DATA_DIR . '/.htaccess')) {
    @file_put_contents(DATA_DIR . '/.htaccess', "Require all denied\n");
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^.*?/api/#', '', rawurldecode($path));
$path = trim($path, '/');
$segments = $path === '' ? [] : explode('/', $path);

// Las peticiones con ficheros van siempre por POST: PHP no rellena $_POST/$_FILES en los PUT con ficheros.

try {
    route($method, $segments);
} catch (Throwable $e) {
    error_log('API error: ' . $e->getMessage());
    json_response(['error' => 'Error interno del servidor'], 500);
}

function route($method, $s)
{
    $n = count($s);
    $first = $n > 0 ? $s[0] : '';

    if ($first === 'admin' && $n === 2) {
        if ($s[1] === 'check' && $method === 'GET') return admin_check();
        if ($s[1] === 'login' && $method === 'POST') return admin_login();
        if ($s[1] === 'logout' && $method === 'POST') return admin_logout();
        if ($s[1] === 'password' && $method === 'POST') return admin_change_password();
    }

    if ($first === 'gallery') {
        if ($n === 1 && $method === 'GET') return json_public_cached(get_gallery_data(), DATA_DIR . '/galleryData.json');
        if ($n === 1 && $method === 'POST') return gallery_upload();
        if ($n === 2 && $s[1] === 'reorder' && $method === 'PUT') return gallery_reorder();
        if ($n === 2 && $s[1] === 'member' && $method === 'POST') return member_create();
        if ($n === 2 && $s[1] === 'section' && $method === 'POST') return section_create();
        if ($n === 4 && $s[1] === 'photo' && $s[3] === 'file' && $method === 'POST') return photo_replace_file($s[2]);
        if ($n === 3) {
            $id = $s[2];
            if ($s[1] === 'photo' && $method === 'PUT') return photo_update($id);
            if ($s[1] === 'photo' && $method === 'DELETE') return photo_delete($id);
            if ($s[1] === 'member' && $method === 'PUT') return member_update($id);
            if ($s[1] === 'member' && $method === 'DELETE') return member_delete($id);
            if ($s[1] === 'section' && $method === 'PUT') return section_update($id);
            if ($s[1] === 'section' && $method === 'DELETE') return section_delete($id);
        }
    }

    if ($first === 'shows' && $n === 1) {
        if ($method === 'GET') return shows_get();
        if ($method === 'PUT') return shows_save();
    }

    if ($first === 'private-links') {
        if ($n === 1 && $method === 'GET') return private_links_list();
        if ($n === 1 && $method === 'POST') return private_link_create();
        if ($n === 2 && $s[1] === 'verify' && $method === 'POST') return private_link_verify();
        if ($n === 2 && $method === 'POST') return private_link_update($s[1]);
        if ($n === 2 && $method === 'DELETE') return private_link_delete($s[1]);
        if ($n === 4 && $s[2] === 'files' && $method === 'GET') return private_file_serve($s[1], $s[3]);
    }

    json_response(['error' => 'Not found'], 404);
}

/* ── Admin ─────────────────────────────────────────────────────────── */

function admin_check()
{
    if (is_admin()) {
        json_response(['authenticated' => true]);
    }
    json_response(['authenticated' => false], 401);
}

function admin_login()
{
    reject_if_locked();
    $body = read_json_body();
    $password = isset($body['password']) ? (string) $body['password'] : '';

    if (verify_admin_password($password)) {
        clear_failed_logins();
        set_admin_cookie(create_signed_token(), 60 * 60 * 24 * 7);
        json_response(['success' => true, 'message' => 'Authenticated successfully']);
    }
    register_failed_login();
    json_response(['error' => 'Contraseña incorrecta'], 401);
}

function admin_change_password()
{
    require_admin();
    // Solo JSON: un formulario de otra web no puede enviar este tipo de petición sin permiso del navegador
    if (!isset($_SERVER['CONTENT_TYPE']) || stripos($_SERVER['CONTENT_TYPE'], 'application/json') !== 0) {
        json_response(['error' => 'Petición no válida'], 400);
    }
    reject_if_locked();

    $body = read_json_body();
    $current = isset($body['currentPassword']) ? (string) $body['currentPassword'] : '';
    $new = isset($body['newPassword']) ? (string) $body['newPassword'] : '';

    if (!verify_admin_password($current)) {
        register_failed_login();
        json_response(['error' => 'La contraseña actual no es correcta'], 401);
    }
    clear_failed_logins();

    $invalid = validate_new_admin_password($new);
    if ($invalid !== null) {
        json_response(['error' => $invalid], 400);
    }
    if ($new === $current) {
        json_response(['error' => 'La nueva contraseña debe ser distinta de la actual'], 400);
    }

    // Se cambia también el secreto: se cierran las sesiones abiertas en otros dispositivos
    if (!set_admin_password($new, true)) {
        json_response(['error' => 'No se pudo guardar la nueva contraseña'], 500);
    }
    set_admin_cookie(create_signed_token(), 60 * 60 * 24 * 7);
    json_response(['success' => true]);
}

function admin_logout()
{
    set_admin_cookie('', 0);
    json_response(['success' => true]);
}

/* ── Galería: fotos ────────────────────────────────────────────────── */

function gallery_upload()
{
    require_admin('No autorizado. Inicie sesión como administrador.');

    $descripcion = isset($_POST['descripcion']) ? $_POST['descripcion'] : '';
    $descripcionEn = isset($_POST['descripcionEn']) ? $_POST['descripcionEn'] : '';
    $fecha = isset($_POST['fecha']) && $_POST['fecha'] !== '' ? $_POST['fecha'] : date('Y');
    $integranteId = isset($_POST['integranteId']) && $_POST['integranteId'] !== 'banda' && $_POST['integranteId'] !== ''
        ? $_POST['integranteId'] : null;
    $esPrincipal = isset($_POST['esPrincipal']) && $_POST['esPrincipal'] === 'true';
    $enCarrusel = isset($_POST['enCarrusel']) && $_POST['enCarrusel'] === 'true';

    // Destino "carrusel": la foto solo se muestra en el carrusel de la portada, no en la galería
    $soloCarrusel = $integranteId === CARRUSEL_ID;
    if ($soloCarrusel) {
        $integranteId = null;
        $esPrincipal = false;
        $enCarrusel = true;
    }

    $data = get_gallery_data();
    // La primera foto de un integrante que todavía no tiene foto principal pasa a serlo
    if ($integranteId && !$esPrincipal && member_exists($data, $integranteId) && !member_has_main_photo($data, $integranteId)) {
        $esPrincipal = true;
    }

    $timestamp = now_ms();
    $filePublicUrl = save_gallery_upload();

    $maxOrder = 0;
    foreach ($data['fotos'] as $f) {
        $fid = isset($f['integranteId']) ? $f['integranteId'] : null;
        if ($fid === $integranteId) {
            $maxOrder = max($maxOrder, isset($f['orden']) ? (int) $f['orden'] : 0);
        }
    }

    $newPhoto = [
        'id' => 'photo_' . $timestamp,
        'url' => $filePublicUrl,
        'descripcion' => $descripcion,
        'descripcionEn' => $descripcionEn,
        'fecha' => $fecha,
        'integranteId' => $integranteId,
        'orden' => $maxOrder + 1,
        'esPrincipal' => $esPrincipal,
        'enCarrusel' => $enCarrusel,
        'soloCarrusel' => $soloCarrusel,
    ];

    if ($esPrincipal && $integranteId) {
        set_member_main_photo($data, $integranteId, $filePublicUrl);
    }

    array_unshift($data['fotos'], $newPhoto);
    save_gallery_data($data);

    json_response(['success' => true, 'photo' => $newPhoto, 'data' => $data]);
}

// Guarda la imagen recibida en el campo 'file' en /uploads/gallery y devuelve su URL pública
// (o responde con error y termina)
function save_gallery_upload()
{
    $files = uploaded_files('file');
    $file = isset($files[0]) ? $files[0] : null;
    if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
        json_response(['error' => 'No file provided'], 400);
    }
    if (!allowed_extension($file['name'], false)) {
        json_response(['error' => 'Tipo de archivo no permitido'], 400);
    }

    $uploadsDir = PUBLIC_DIR . '/uploads/gallery';
    ensure_dir($uploadsDir);

    $originalName = preg_replace('/[^a-zA-Z0-9.-]/', '_', $file['name']);
    $fileName = now_ms() . '_' . $originalName;

    if (!move_upload($file, $uploadsDir . '/' . $fileName)) {
        json_response(['error' => 'Upload failed'], 500);
    }
    return '/uploads/gallery/' . $fileName;
}

// Borra del disco una imagen de la galería, solo si se subió desde el panel (las de /images son del repositorio)
function delete_gallery_file($url)
{
    if (strpos($url, '/uploads/') === 0 && strpos($url, '..') === false) {
        $filePath = PUBLIC_DIR . $url;
        if (is_file($filePath)) {
            @unlink($filePath);
        }
    }
}

// Sustituye la imagen de una foto conservando sus datos (pie, fecha, integrante, orden, carrusel...)
function photo_replace_file($id)
{
    require_admin();
    $data = get_gallery_data();

    $index = null;
    foreach ($data['fotos'] as $i => $f) {
        if ($f['id'] === $id) {
            $index = $i;
            break;
        }
    }
    if ($index === null) {
        json_response(['error' => 'Photo not found'], 404);
    }

    $oldUrl = $data['fotos'][$index]['url'];
    $newUrl = save_gallery_upload();
    $data['fotos'][$index]['url'] = $newUrl;

    // Si era la foto de perfil de algún integrante, se actualiza también
    foreach ($data['integrantes'] as &$m) {
        if (isset($m['fotoPrincipalUrl']) && $m['fotoPrincipalUrl'] === $oldUrl) {
            $m['fotoPrincipalUrl'] = $newUrl;
        }
    }
    unset($m);

    if (!save_gallery_data($data)) {
        delete_gallery_file($newUrl);
        json_response(['error' => 'No se pudo guardar'], 500);
    }
    delete_gallery_file($oldUrl);
    json_response(['success' => true, 'photo' => $data['fotos'][$index], 'data' => $data]);
}

// Marca como no principal todas las fotos del integrante y actualiza su foto de perfil
function set_member_main_photo(&$data, $memberId, $url)
{
    foreach ($data['fotos'] as &$f) {
        if (isset($f['integranteId']) && $f['integranteId'] === $memberId) {
            $f['esPrincipal'] = false;
        }
    }
    unset($f);
    foreach ($data['integrantes'] as &$m) {
        if ($m['id'] === $memberId) {
            $m['fotoPrincipalUrl'] = $url;
        }
    }
    unset($m);
}

function gallery_reorder()
{
    require_admin();
    $body = read_json_body();
    $items = isset($body['items']) && is_array($body['items']) ? $body['items'] : [];

    $orders = [];
    foreach ($items as $item) {
        if (isset($item['id'], $item['orden'])) {
            $orders[$item['id']] = (int) $item['orden'];
        }
    }

    $data = get_gallery_data();
    foreach ($data['fotos'] as &$f) {
        if (isset($orders[$f['id']])) {
            $f['orden'] = $orders[$f['id']];
        }
    }
    unset($f);

    save_gallery_data($data);
    json_response(['success' => true, 'data' => $data]);
}

function photo_update($id)
{
    require_admin();
    $body = read_json_body();
    $data = get_gallery_data();

    $index = null;
    foreach ($data['fotos'] as $i => $f) {
        if ($f['id'] === $id) {
            $index = $i;
            break;
        }
    }
    if ($index === null) {
        json_response(['error' => 'Photo not found'], 404);
    }

    $current = $data['fotos'][$index];
    $currentMember = isset($current['integranteId']) ? $current['integranteId'] : null;
    $soloCarrusel = !empty($current['soloCarrusel']);
    if (array_key_exists('integranteId', $body)) {
        $soloCarrusel = $body['integranteId'] === CARRUSEL_ID;
        $targetMemberId = ($body['integranteId'] === 'banda' || $body['integranteId'] === '' || $soloCarrusel) ? null : $body['integranteId'];
        if ($soloCarrusel) {
            $body['esPrincipal'] = false;
        }
    } else {
        $targetMemberId = $currentMember;
    }

    if (!empty($body['esPrincipal']) && $targetMemberId) {
        set_member_main_photo($data, $targetMemberId, $current['url']);
    }

    $photo = $data['fotos'][$index];
    $photo['descripcion'] = array_key_exists('descripcion', $body) ? $body['descripcion'] : (isset($current['descripcion']) ? $current['descripcion'] : '');
    $photo['descripcionEn'] = array_key_exists('descripcionEn', $body) ? $body['descripcionEn'] : (isset($current['descripcionEn']) ? $current['descripcionEn'] : '');
    $photo['fecha'] = array_key_exists('fecha', $body) ? $body['fecha'] : (isset($current['fecha']) ? $current['fecha'] : '');
    $photo['integranteId'] = $targetMemberId;
    $photo['esPrincipal'] = array_key_exists('esPrincipal', $body) ? (bool) $body['esPrincipal'] : !empty($current['esPrincipal']);
    // Fotos que se muestran en el carrusel de la portada (hero)
    $photo['enCarrusel'] = $soloCarrusel || (array_key_exists('enCarrusel', $body) ? (bool) $body['enCarrusel'] : !empty($current['enCarrusel']));
    $photo['soloCarrusel'] = $soloCarrusel;
    $data['fotos'][$index] = $photo;

    save_gallery_data($data);
    json_response(['success' => true, 'photo' => $photo, 'data' => $data]);
}

function photo_delete($id)
{
    require_admin();
    $data = get_gallery_data();

    $photo = null;
    foreach ($data['fotos'] as $f) {
        if ($f['id'] === $id) {
            $photo = $f;
            break;
        }
    }
    if ($photo === null) {
        json_response(['error' => 'Photo not found'], 404);
    }

    // Solo se borran del disco las fotos subidas desde el panel (las de /images son del repositorio)
    delete_gallery_file($photo['url']);

    $data['fotos'] = array_values(array_filter($data['fotos'], function ($f) use ($id) {
        return $f['id'] !== $id;
    }));

    $memberId = isset($photo['integranteId']) ? $photo['integranteId'] : null;
    if (!empty($photo['esPrincipal']) && $memberId) {
        foreach ($data['fotos'] as &$f) {
            if (isset($f['integranteId']) && $f['integranteId'] === $memberId) {
                $f['esPrincipal'] = true;
                foreach ($data['integrantes'] as &$m) {
                    if ($m['id'] === $memberId) {
                        $m['fotoPrincipalUrl'] = $f['url'];
                    }
                }
                unset($m);
                break;
            }
        }
        unset($f);
    }

    save_gallery_data($data);
    json_response(['success' => true, 'data' => $data]);
}

/* ── Galería: integrantes ──────────────────────────────────────────── */

// Devuelve $base, o $base-2, $base-3... si ya lo usa otro integrante, otra sección o es un valor reservado.
// Integrantes y secciones comparten el mismo selector de destino al subir fotos, por eso no pueden repetirse.
function unique_gallery_id($data, $base)
{
    $taken = RESERVED_GALLERY_IDS;
    foreach ($data['integrantes'] as $m) {
        $taken[] = $m['id'];
    }
    if (isset($data['secciones'])) {
        foreach ($data['secciones'] as $sec) {
            $taken[] = $sec['id'];
        }
    }
    $id = $base;
    $i = 2;
    while (in_array($id, $taken, true)) {
        $id = $base . '-' . $i++;
    }
    return $id;
}

function member_has_main_photo($data, $memberId)
{
    foreach ($data['integrantes'] as $m) {
        if ($m['id'] === $memberId) {
            return !empty($m['fotoPrincipalUrl']);
        }
    }
    return false;
}

function member_exists($data, $memberId)
{
    foreach ($data['integrantes'] as $m) {
        if ($m['id'] === $memberId) {
            return true;
        }
    }
    return false;
}

function member_create()
{
    require_admin();
    $body = read_json_body();
    $nombre = isset($body['nombre']) ? trim((string) $body['nombre']) : '';
    if ($nombre === '') {
        json_response(['error' => 'El nombre es obligatorio'], 400);
    }

    $data = get_gallery_data();
    $slug = slugify($nombre);
    if ($slug === '') {
        $slug = 'member';
    }
    $slug = unique_gallery_id($data, $slug);

    $newMember = [
        'id' => $slug,
        'nombre' => $body['nombre'],
        'slug' => $slug,
        'rol' => !empty($body['rol']) ? $body['rol'] : 'Integrante',
        'bio' => !empty($body['bio']) ? $body['bio'] : '',
        // Sin foto: la web muestra su primera foto subida o una silueta. La primera foto que se suba será la principal.
        'fotoPrincipalUrl' => !empty($body['fotoPrincipalUrl']) ? $body['fotoPrincipalUrl'] : '',
    ];

    $data['integrantes'][] = $newMember;

    save_gallery_data($data);
    json_response(['success' => true, 'member' => $newMember, 'data' => $data]);
}

function member_update($id)
{
    require_admin();
    $body = read_json_body();
    $data = get_gallery_data();

    foreach ($data['integrantes'] as $i => $m) {
        if ($m['id'] === $id) {
            foreach (['nombre', 'rol', 'bio', 'fotoPrincipalUrl'] as $field) {
                if (array_key_exists($field, $body)) {
                    $m[$field] = $body[$field];
                }
            }
            $data['integrantes'][$i] = $m;
            save_gallery_data($data);
            json_response(['success' => true, 'member' => $m, 'data' => $data]);
        }
    }
    json_response(['error' => 'Integrante no encontrado'], 404);
}

function member_delete($id)
{
    require_admin();
    $data = get_gallery_data();

    $data['integrantes'] = array_values(array_filter($data['integrantes'], function ($m) use ($id) {
        return $m['id'] !== $id;
    }));

    // Las fotos del integrante eliminado pasan a la galería general de la banda
    foreach ($data['fotos'] as &$f) {
        if (isset($f['integranteId']) && $f['integranteId'] === $id) {
            $f['integranteId'] = null;
            $f['esPrincipal'] = false;
        }
    }
    unset($f);

    save_gallery_data($data);
    json_response(['success' => true, 'data' => $data]);
}

/* ── Galería: secciones ────────────────────────────────────────────── */

function section_create()
{
    require_admin();
    $body = read_json_body();
    $nombre = isset($body['nombre']) ? trim((string) $body['nombre']) : '';
    if ($nombre === '') {
        json_response(['error' => 'El nombre de la sección es obligatorio'], 400);
    }

    $data = get_gallery_data();
    if (!isset($data['secciones'])) {
        $data['secciones'] = default_secciones();
    }

    $slug = slugify($nombre);
    if ($slug === '') {
        $slug = 'section';
    }
    // Se compara por nombre (no por id): el id puede llevar sufijo si coincidía con un integrante
    foreach ($data['secciones'] as $sec) {
        if (slugify(isset($sec['nombre']) ? $sec['nombre'] : '') === slugify($nombre)) {
            json_response(['error' => 'Ya existe una sección con ese nombre'], 400);
        }
    }
    $slug = unique_gallery_id($data, $slug);

    $newSection = ['id' => $slug, 'nombre' => $body['nombre'], 'slug' => $slug];
    $data['secciones'][] = $newSection;

    save_gallery_data($data);
    json_response(['success' => true, 'section' => $newSection, 'data' => $data]);
}

function section_update($id)
{
    require_admin();
    $body = read_json_body();
    $data = get_gallery_data();
    if (!isset($data['secciones'])) {
        $data['secciones'] = default_secciones();
    }

    foreach ($data['secciones'] as $i => $sec) {
        if ($sec['id'] === $id) {
            if (!empty($body['nombre'])) {
                $data['secciones'][$i]['nombre'] = $body['nombre'];
            }
            save_gallery_data($data);
            json_response(['success' => true, 'section' => $data['secciones'][$i], 'data' => $data]);
        }
    }
    json_response(['error' => 'Sección no encontrada'], 404);
}

function section_delete($id)
{
    require_admin();
    if ($id === 'banda') {
        json_response(['error' => 'No se puede eliminar la sección principal de la banda'], 400);
    }

    $data = get_gallery_data();
    if (!isset($data['secciones'])) {
        json_response(['success' => true, 'data' => $data]);
    }

    $data['secciones'] = array_values(array_filter($data['secciones'], function ($sec) use ($id) {
        return $sec['id'] !== $id;
    }));

    // Las fotos de la sección eliminada pasan a la galería general de la banda
    foreach ($data['fotos'] as &$f) {
        if (isset($f['seccionId']) && $f['seccionId'] === $id) {
            $f['seccionId'] = null;
            $f['integranteId'] = null;
        }
    }
    unset($f);

    save_gallery_data($data);
    json_response(['success' => true, 'data' => $data]);
}

/* ── Shows (cartelera y vídeos de YouTube) ─────────────────────────── */

function get_shows_data()
{
    $data = load_json_store('shows.json', ['shows' => [], 'videos' => []]);
    if (!isset($data['shows']) || !is_array($data['shows'])) $data['shows'] = [];
    if (!isset($data['videos']) || !is_array($data['videos'])) $data['videos'] = [];
    return $data;
}

// Lectura pública: la pide cada visitante, así que se deja cachear (navegador/proxy) y responde 304 si no ha cambiado
function shows_get()
{
    json_public_cached(get_shows_data(), DATA_DIR . '/shows.json');
}

// Texto bilingüe {es, en}: recorta espacios y limita longitud
function clean_bilingual($value, $maxLen)
{
    $out = [];
    foreach (['es', 'en'] as $lang) {
        $v = is_array($value) && isset($value[$lang]) && is_scalar($value[$lang]) ? trim((string) $value[$lang]) : '';
        $out[$lang] = mb_substr($v, 0, $maxLen, 'UTF-8');
    }
    return $out;
}

function clean_item_id($id, $prefix, $i)
{
    $id = is_string($id) ? $id : '';
    return preg_match('/^[a-zA-Z0-9_-]{1,64}$/', $id) ? $id : $prefix . '_' . now_ms() . '_' . $i;
}

// Acepta un ID de YouTube (11 caracteres) o una URL de YouTube y devuelve el ID, o null si no es válido
function extract_youtube_id($value)
{
    $value = trim((string) $value);
    if (preg_match('/^[A-Za-z0-9_-]{11}$/', $value)) return $value;
    if (preg_match('#(?:youtube\.com/(?:watch\?(?:.*&)?v=|embed/|shorts/|live/)|youtu\.be/)([A-Za-z0-9_-]{11})#', $value, $m)) return $m[1];
    return null;
}

// Guardado completo (lista de shows + vídeos en su orden). El orden del array es el orden en la web.
function shows_save()
{
    require_admin();
    $body = read_json_body();
    if (!isset($body['shows']) || !is_array($body['shows']) || !isset($body['videos']) || !is_array($body['videos'])) {
        json_response(['error' => 'Formato no válido'], 400);
    }
    if (count($body['shows']) > 200 || count($body['videos']) > 24) {
        json_response(['error' => 'Demasiados elementos'], 400);
    }

    $shows = [];
    foreach (array_values($body['shows']) as $i => $s) {
        if (!is_array($s)) continue;
        $show = [
            'id' => clean_item_id(isset($s['id']) ? $s['id'] : '', 'show', $i),
            'festival' => clean_bilingual(isset($s['festival']) ? $s['festival'] : null, 150),
            'location' => clean_bilingual(isset($s['location']) ? $s['location'] : null, 150),
            'year' => clean_bilingual(isset($s['year']) ? $s['year'] : null, 60),
            'details' => clean_bilingual(isset($s['details']) ? $s['details'] : null, 600),
        ];
        if ($show['festival']['es'] === '' || $show['festival']['en'] === '') {
            json_response(['error' => 'Cada show necesita el nombre en español e inglés (fila ' . ($i + 1) . ')'], 400);
        }
        $shows[] = $show;
    }

    $videos = [];
    foreach (array_values($body['videos']) as $i => $v) {
        if (!is_array($v)) continue;
        $youtubeId = extract_youtube_id(isset($v['youtubeId']) ? $v['youtubeId'] : '');
        if ($youtubeId === null) {
            json_response(['error' => 'Enlace o ID de YouTube no válido (vídeo ' . ($i + 1) . ')'], 400);
        }
        $video = [
            'id' => clean_item_id(isset($v['id']) ? $v['id'] : '', 'video', $i),
            'youtubeId' => $youtubeId,
            'title' => clean_bilingual(isset($v['title']) ? $v['title'] : null, 150),
            'location' => clean_bilingual(isset($v['location']) ? $v['location'] : null, 150),
            'description' => clean_bilingual(isset($v['description']) ? $v['description'] : null, 600),
        ];
        if ($video['title']['es'] === '' || $video['title']['en'] === '') {
            json_response(['error' => 'Cada vídeo necesita título en español e inglés (vídeo ' . ($i + 1) . ')'], 400);
        }
        $videos[] = $video;
    }

    $data = ['shows' => $shows, 'videos' => $videos];
    if (!save_json_store('shows.json', $data)) {
        json_response(['error' => 'No se pudo guardar'], 500);
    }
    json_response(['success' => true, 'data' => $data]);
}

/* ── Enlaces privados (riders técnicos) ────────────────────────────── */

// Los adjuntos (PDF y fotos) se guardan en DATA_DIR/privado, una carpeta que no es accesible desde la web.
// Solo se descargan a través de /api/private-links/<id>/files/<fileId>, que exige haber introducido la clave
// del enlace (cookie firmada) o ser administrador.

function private_files_dir()
{
    return DATA_DIR . '/privado';
}

// Ruta en disco de un adjunto. Si todavía está en la ubicación antigua (/uploads/privado, pública) o solo
// existe en la semilla del repositorio, lo trae a DATA_DIR/privado. Devuelve null si no existe.
function private_file_path($archivo)
{
    $archivo = basename((string) $archivo);
    if ($archivo === '' || $archivo[0] === '.') {
        return null;
    }
    $dir = private_files_dir();
    ensure_dir($dir);
    $path = $dir . '/' . $archivo;
    if (is_file($path)) {
        return $path;
    }
    $old = PUBLIC_DIR . '/uploads/privado/' . $archivo;
    if (is_file($old) && @rename($old, $path)) {
        return $path;
    }
    $seed = __DIR__ . '/seed/privado/' . $archivo;
    if (is_file($seed) && @copy($seed, $path)) {
        return $path;
    }
    return null;
}

function delete_private_file($entry)
{
    if (!empty($entry['archivo'])) {
        $path = private_files_dir() . '/' . basename((string) $entry['archivo']);
        if (is_file($path)) {
            @unlink($path);
        }
    }
}

// Lee los enlaces privados. Los adjuntos guardados con el formato antiguo ('url' => '/uploads/privado/...')
// se pasan al nuevo ('archivo') y se mueven fuera de la carpeta pública.
function load_private_links()
{
    $data = get_private_links_data();
    if (!isset($data['links']) || !is_array($data['links'])) {
        $data['links'] = [];
    }
    $changed = false;
    foreach ($data['links'] as &$link) {
        if (!isset($link['fotos']) || !is_array($link['fotos'])) {
            $link['fotos'] = [];
        }
        foreach ($link['fotos'] as &$f) {
            if (empty($f['archivo']) && isset($f['url']) && preg_match('#^/uploads/privado/([^/]+)$#', $f['url'], $m)) {
                $f['archivo'] = $m[1];
                unset($f['url']);
                $changed = true;
                private_file_path($f['archivo']);
            }
        }
        unset($f);
    }
    unset($link);
    if ($changed) {
        save_private_links_data($data);
    }
    return $data;
}

// Versión de un enlace para enviar al navegador: los adjuntos llevan la URL de descarga protegida
// y nunca el nombre del fichero en disco
function private_link_out($link)
{
    $out = [];
    foreach ($link['fotos'] as $f) {
        unset($f['archivo']);
        $f['url'] = '/api/private-links/' . rawurlencode($link['id']) . '/files/' . rawurlencode($f['id']);
        $out[] = $f;
    }
    $link['fotos'] = $out;
    return $link;
}

function private_links_out($data)
{
    return ['links' => array_map('private_link_out', $data['links'])];
}

/* Acceso a los adjuntos: cookie firmada por enlace, ligada a su clave (si se cambia la clave, deja de valer) */

function private_access_signature($link, $exp)
{
    $payload = $link['id'] . '|' . $exp . '|' . hash('sha256', (string) $link['clave']);
    return hash_hmac('sha256', $payload, get_admin_secret());
}

function private_access_cookie_name($link)
{
    return 'skacubano_privado_' . substr(hash('sha256', $link['id']), 0, 16);
}

function grant_private_access($link)
{
    $exp = time() + PRIVATE_ACCESS_TTL;
    setcookie(private_access_cookie_name($link), $exp . '.' . private_access_signature($link, $exp), [
        'expires' => $exp,
        'path' => '/api/private-links/' . rawurlencode($link['id']) . '/',
        'secure' => is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function has_private_access($link)
{
    if (get_admin_secret() === '') {
        return false;
    }
    $name = private_access_cookie_name($link);
    $value = isset($_COOKIE[$name]) ? (string) $_COOKIE[$name] : '';
    $parts = explode('.', $value, 2);
    if (count($parts) !== 2 || !ctype_digit($parts[0]) || (int) $parts[0] < time()) {
        return false;
    }
    return hash_equals(private_access_signature($link, $parts[0]), $parts[1]);
}

function private_file_serve($linkId, $fileId)
{
    $data = load_private_links();
    foreach ($data['links'] as $link) {
        if ($link['id'] !== $linkId) {
            continue;
        }
        if (!is_admin() && !has_private_access($link)) {
            json_response(['error' => 'No autorizado'], 401);
        }
        foreach ($link['fotos'] as $f) {
            if ($f['id'] !== $fileId) {
                continue;
            }
            $path = isset($f['archivo']) ? private_file_path($f['archivo']) : null;
            if ($path === null) {
                break;
            }
            $types = [
                'pdf' => 'application/pdf',
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
            ];
            $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            $nombre = isset($f['nombre']) && $f['nombre'] !== '' ? (string) $f['nombre'] : basename($path);
            $ascii = preg_replace('/[^A-Za-z0-9._-]/', '_', $nombre);
            $disposition = isset($_GET['download']) ? 'attachment' : 'inline';

            header('Content-Type: ' . (isset($types[$ext]) ? $types[$ext] : 'application/octet-stream'));
            header('Content-Length: ' . filesize($path));
            header('Content-Disposition: ' . $disposition . '; filename="' . $ascii . '"; filename*=UTF-8\'\'' . rawurlencode($nombre));
            header('X-Content-Type-Options: nosniff');
            header('X-Robots-Tag: noindex, nofollow');
            header('Cache-Control: private, max-age=3600');
            readfile($path);
            exit;
        }
        json_response(['error' => 'Archivo no encontrado'], 404);
    }
    json_response(['error' => 'Enlace privado no encontrado'], 404);
}

function private_links_list()
{
    require_admin();
    json_response(private_links_out(load_private_links()));
}

// Guarda los ficheros adjuntos de un enlace privado (fuera de la carpeta pública) y devuelve sus entradas
function save_private_files($files)
{
    $out = [];
    $uploadDir = private_files_dir();
    ensure_dir($uploadDir);

    foreach ($files as $i => $file) {
        if ($file['error'] !== UPLOAD_ERR_OK || !allowed_extension($file['name'], true)) {
            continue;
        }
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $isPdf = $ext === 'pdf';
        $filename = 'doc_' . now_ms() . '_' . $i . '.' . $ext;

        if (move_upload($file, $uploadDir . '/' . $filename)) {
            $out[] = [
                'id' => 'file-' . now_ms() . '-' . $i,
                'archivo' => $filename,
                'nombre' => $file['name'],
                'esPdf' => $isPdf,
                'tipo' => $isPdf ? 'pdf' : 'imagen',
            ];
        }
    }
    return $out;
}

function private_link_create()
{
    require_admin();
    $titulo = isset($_POST['titulo']) ? $_POST['titulo'] : '';
    $clave = isset($_POST['clave']) ? $_POST['clave'] : '';
    $notas = isset($_POST['notasTecnicas']) ? $_POST['notasTecnicas'] : '';

    if ($titulo === '' || $clave === '') {
        json_response(['error' => 'El título y la clave son obligatorios'], 400);
    }

    $data = load_private_links();
    $slug = slugify($titulo);
    if ($slug === '') {
        $slug = 'stage-' . now_ms();
    }
    foreach ($data['links'] as $l) {
        if ($l['slug'] === $slug) {
            $slug .= '-' . substr((string) now_ms(), -4);
            break;
        }
    }

    $newLink = [
        'id' => 'link-' . now_ms(),
        'titulo' => $titulo,
        'slug' => $slug,
        'clave' => $clave,
        'notasTecnicas' => $notas,
        'fotos' => save_private_files(uploaded_files('files')),
        'creadoEn' => now_iso(),
        'activo' => true,
    ];

    array_unshift($data['links'], $newLink);
    save_private_links_data($data);

    json_response(['success' => true, 'link' => private_link_out($newLink), 'data' => private_links_out($data)]);
}

function private_link_update($id)
{
    require_admin();
    $data = load_private_links();

    foreach ($data['links'] as $i => $link) {
        if ($link['id'] !== $id) {
            continue;
        }

        // El navegador solo indica QUÉ adjuntos se conservan y en qué orden (por id). Los datos de cada uno
        // salen siempre del servidor, para que nadie pueda apuntar a otro fichero del disco.
        $keepIds = [];
        if (!empty($_POST['existingFotos'])) {
            $decoded = json_decode($_POST['existingFotos'], true);
            if (is_array($decoded)) {
                foreach ($decoded as $item) {
                    if (is_array($item) && isset($item['id'])) {
                        $keepIds[] = (string) $item['id'];
                    }
                }
            }
        }
        $current = [];
        foreach ($link['fotos'] as $f) {
            $current[$f['id']] = $f;
        }
        $fotos = [];
        foreach ($keepIds as $keepId) {
            if (isset($current[$keepId])) {
                $fotos[] = $current[$keepId];
                unset($current[$keepId]);
            }
        }
        // Los adjuntos quitados se borran también del disco
        foreach ($current as $removed) {
            delete_private_file($removed);
        }
        $fotos = array_merge($fotos, save_private_files(uploaded_files('files')));

        if (!empty($_POST['titulo'])) {
            $link['titulo'] = $_POST['titulo'];
        }
        if (!empty($_POST['clave'])) {
            $link['clave'] = $_POST['clave'];
        }
        $link['notasTecnicas'] = isset($_POST['notasTecnicas']) ? $_POST['notasTecnicas'] : '';
        $link['fotos'] = $fotos;
        $data['links'][$i] = $link;

        save_private_links_data($data);
        json_response(['success' => true, 'link' => private_link_out($link), 'data' => private_links_out($data)]);
    }
    json_response(['error' => 'Enlace privado no encontrado'], 404);
}

function private_link_delete($id)
{
    require_admin();
    $data = load_private_links();
    $kept = [];
    foreach ($data['links'] as $l) {
        if ($l['id'] === $id) {
            // Al borrar el enlace se borran también sus adjuntos del disco
            foreach ($l['fotos'] as $f) {
                delete_private_file($f);
            }
        } else {
            $kept[] = $l;
        }
    }
    $data['links'] = $kept;
    save_private_links_data($data);
    json_response(['success' => true, 'data' => private_links_out($data)]);
}

function private_link_verify()
{
    $body = read_json_body();
    $slug = isset($body['slug']) ? (string) $body['slug'] : '';
    $clave = isset($body['clave']) ? (string) $body['clave'] : '';

    if ($slug === '' || $clave === '') {
        json_response(['error' => 'Falta el identificador o la clave de acceso'], 400);
    }

    // Protección contra fuerza bruta: tras 5 claves incorrectas desde la misma IP, bloqueo de 15 minutos
    reject_if_locked('privado');

    $data = load_private_links();
    foreach ($data['links'] as $link) {
        if ($link['slug'] !== $slug) {
            continue;
        }
        if (!hash_equals((string) $link['clave'], $clave)) {
            register_failed_login('privado');
            json_response(['error' => 'La clave de acceso es incorrecta'], 401);
        }
        clear_failed_logins('privado');
        // Cookie que permite descargar los adjuntos de este enlace durante unas horas
        grant_private_access($link);
        $out = private_link_out($link);
        // La clave no se devuelve nunca al visitante
        unset($out['clave']);
        json_response(['success' => true, 'link' => $out]);
    }
    // Un slug inexistente también cuenta como intento fallido (si no, se podrían probar slugs sin límite)
    register_failed_login('privado');
    json_response(['error' => 'El enlace privado no existe o ha caducado'], 404);
}
