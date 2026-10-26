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

// En PHP los PUT multipart no rellenan $_POST/$_FILES. En PHP 8.4 se procesan con request_parse_body().
$putFiles = [];
if ($method === 'PUT' && isset($_SERVER['CONTENT_TYPE']) && stripos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') === 0) {
    if (function_exists('request_parse_body')) {
        list($_POST, $putFiles) = request_parse_body();
    }
}

try {
    route($method, $segments, $putFiles);
} catch (Throwable $e) {
    error_log('API error: ' . $e->getMessage());
    json_response(['error' => 'Error interno del servidor'], 500);
}

function route($method, $s, $putFiles)
{
    $n = count($s);
    $first = $n > 0 ? $s[0] : '';

    if ($first === 'admin' && $n === 2) {
        if ($s[1] === 'check' && $method === 'GET') return admin_check();
        if ($s[1] === 'login' && $method === 'POST') return admin_login();
        if ($s[1] === 'logout' && $method === 'POST') return admin_logout();
    }

    if ($first === 'gallery') {
        if ($n === 1 && $method === 'GET') return json_response(get_gallery_data());
        if ($n === 1 && $method === 'POST') return gallery_upload();
        if ($n === 2 && $s[1] === 'reorder' && $method === 'PUT') return gallery_reorder();
        if ($n === 2 && $s[1] === 'member' && $method === 'POST') return member_create();
        if ($n === 2 && $s[1] === 'section' && $method === 'POST') return section_create();
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

    if ($first === 'private-links') {
        if ($n === 1 && $method === 'GET') return private_links_list();
        if ($n === 1 && $method === 'POST') return private_link_create();
        if ($n === 2 && $s[1] === 'verify' && $method === 'POST') return private_link_verify();
        if ($n === 2 && ($method === 'PUT' || $method === 'POST')) return private_link_update($s[1], $method === 'PUT' ? $putFiles : $_FILES);
        if ($n === 2 && $method === 'DELETE') return private_link_delete($s[1]);
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
    $body = read_json_body();
    $password = isset($body['password']) ? (string) $body['password'] : '';
    $adminPassword = get_admin_password();

    if ($password !== '' && $adminPassword !== '' && hash_equals($adminPassword, $password)) {
        set_admin_cookie(create_signed_token(), 60 * 60 * 24 * 7);
        json_response(['success' => true, 'message' => 'Authenticated successfully']);
    }
    json_response(['error' => 'Contraseña incorrecta'], 401);
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

    $timestamp = now_ms();
    $originalName = preg_replace('/[^a-zA-Z0-9.-]/', '_', $file['name']);
    $fileName = $timestamp . '_' . $originalName;

    if (!move_upload($file, $uploadsDir . '/' . $fileName)) {
        json_response(['error' => 'Upload failed'], 500);
    }

    $filePublicUrl = '/uploads/gallery/' . $fileName;
    $data = get_gallery_data();

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
    ];

    if ($esPrincipal && $integranteId) {
        set_member_main_photo($data, $integranteId, $filePublicUrl);
    }

    array_unshift($data['fotos'], $newPhoto);
    save_gallery_data($data);

    json_response(['success' => true, 'photo' => $newPhoto, 'data' => $data]);
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
    if (array_key_exists('integranteId', $body)) {
        $targetMemberId = ($body['integranteId'] === 'banda' || $body['integranteId'] === '') ? null : $body['integranteId'];
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
    if (strpos($photo['url'], '/uploads/') === 0 && strpos($photo['url'], '..') === false) {
        $filePath = PUBLIC_DIR . $photo['url'];
        if (is_file($filePath)) {
            @unlink($filePath);
        }
    }

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
        $slug = 'member-' . now_ms();
    }

    $newMember = [
        'id' => $slug,
        'nombre' => $body['nombre'],
        'slug' => $slug,
        'rol' => !empty($body['rol']) ? $body['rol'] : 'Integrante',
        'bio' => !empty($body['bio']) ? $body['bio'] : '',
        'fotoPrincipalUrl' => !empty($body['fotoPrincipalUrl']) ? $body['fotoPrincipalUrl'] : '/images/photos/bio_portrait_natty.jpg',
    ];

    if (!isset($data['integrantes'])) {
        $data['integrantes'] = [];
    }
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
        $slug = 'section-' . now_ms();
    }
    foreach ($data['secciones'] as $sec) {
        if ($sec['id'] === $slug) {
            json_response(['error' => 'Ya existe una sección con ese nombre'], 400);
        }
    }

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

/* ── Enlaces privados (riders técnicos) ────────────────────────────── */

function private_links_list()
{
    require_admin();
    json_response(get_private_links_data());
}

// Guarda los ficheros adjuntos de un enlace privado y devuelve sus entradas
function save_private_files($files)
{
    $out = [];
    $uploadDir = PUBLIC_DIR . '/uploads/privado';
    ensure_dir($uploadDir);

    foreach ($files as $i => $file) {
        if ($file['error'] !== UPLOAD_ERR_OK || !allowed_extension($file['name'], true)) {
            continue;
        }
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $isPdf = $ext === 'pdf' || $file['type'] === 'application/pdf';
        $filename = 'doc_' . now_ms() . '_' . $i . '.' . $ext;

        if (move_upload($file, $uploadDir . '/' . $filename)) {
            $out[] = [
                'id' => 'file-' . now_ms() . '-' . $i,
                'url' => '/uploads/privado/' . $filename,
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

    $data = get_private_links_data();
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

    json_response(['success' => true, 'link' => $newLink, 'data' => $data]);
}

function private_link_update($id, $fileSource)
{
    require_admin();
    $data = get_private_links_data();

    foreach ($data['links'] as $i => $link) {
        if ($link['id'] !== $id) {
            continue;
        }

        $fotos = [];
        if (!empty($_POST['existingFotos'])) {
            $decoded = json_decode($_POST['existingFotos'], true);
            if (is_array($decoded)) {
                $fotos = $decoded;
            }
        }
        $fotos = array_merge($fotos, save_private_files(uploaded_files('files', $fileSource)));

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
        json_response(['success' => true, 'link' => $link, 'data' => $data]);
    }
    json_response(['error' => 'Enlace privado no encontrado'], 404);
}

function private_link_delete($id)
{
    require_admin();
    $data = get_private_links_data();
    $data['links'] = array_values(array_filter($data['links'], function ($l) use ($id) {
        return $l['id'] !== $id;
    }));
    save_private_links_data($data);
    json_response(['success' => true, 'data' => $data]);
}

function private_link_verify()
{
    $body = read_json_body();
    $slug = isset($body['slug']) ? (string) $body['slug'] : '';
    $clave = isset($body['clave']) ? (string) $body['clave'] : '';

    if ($slug === '' || $clave === '') {
        json_response(['error' => 'Falta el identificador o la clave de acceso'], 400);
    }

    $data = get_private_links_data();
    foreach ($data['links'] as $link) {
        if ($link['slug'] !== $slug) {
            continue;
        }
        if (trim($link['clave']) !== trim($clave)) {
            json_response(['error' => 'La clave de acceso es incorrecta'], 401);
        }
        // La clave no se devuelve nunca al visitante
        unset($link['clave']);
        json_response(['success' => true, 'link' => $link]);
    }
    json_response(['error' => 'El enlace privado no existe o ha caducado'], 404);
}
