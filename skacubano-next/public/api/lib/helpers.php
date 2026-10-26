<?php
// Utilidades comunes de la API (equivalentes a NextResponse, slugify, Date.now()...)

function json_response($data, $status = 200)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Milisegundos desde epoch, como Date.now() en JavaScript
function now_ms()
{
    return (int) floor(microtime(true) * 1000);
}

// Fecha ISO 8601 con milisegundos, como new Date().toISOString()
function now_iso()
{
    $ms = now_ms();
    return gmdate('Y-m-d\TH:i:s', intdiv($ms, 1000)) . sprintf('.%03dZ', $ms % 1000);
}

function read_json_body()
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function slugify($text)
{
    $text = (string) $text;
    $text = mb_strtolower($text, 'UTF-8');
    if (class_exists('Normalizer')) {
        $text = Normalizer::normalize($text, Normalizer::FORM_D);
        $text = preg_replace('/\p{Mn}/u', '', $text);
    } else {
        $text = strtr($text, [
            'á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a', 'ã' => 'a', 'å' => 'a',
            'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e',
            'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i',
            'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o', 'õ' => 'o',
            'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u',
            'ñ' => 'n', 'ç' => 'c',
        ]);
    }
    $text = preg_replace('/[^a-z0-9 -]/', '', $text);
    $text = preg_replace('/\s+/', '-', $text);
    $text = preg_replace('/-+/', '-', $text);
    return $text;
}

// Lee un fichero JSON de datos. Si no existe, lo crea a partir de la semilla del repositorio.
function load_json_store($name, $default)
{
    $path = DATA_DIR . '/' . $name;
    if (!file_exists($path)) {
        $seed = __DIR__ . '/../seed/' . $name;
        if (file_exists($seed)) {
            @copy($seed, $path);
        }
    }
    if (file_exists($path)) {
        $content = file_get_contents($path);
        $data = json_decode($content, true);
        if (is_array($data)) {
            return $data;
        }
        error_log('Error leyendo ' . $name);
    }
    return $default;
}

function save_json_store($name, $data)
{
    $path = DATA_DIR . '/' . $name;
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        return false;
    }
    // Escritura atómica: fichero temporal + rename, para no dejar el JSON a medias
    $tmp = $path . '.tmp' . getmypid();
    if (file_put_contents($tmp, $json, LOCK_EX) === false) {
        return false;
    }
    return rename($tmp, $path);
}

function get_gallery_data()
{
    return load_json_store('galleryData.json', ['integrantes' => [], 'fotos' => []]);
}

function save_gallery_data($data)
{
    return save_json_store('galleryData.json', $data);
}

function get_private_links_data()
{
    return load_json_store('privateLinks.json', ['links' => []]);
}

function save_private_links_data($data)
{
    return save_json_store('privateLinks.json', $data);
}

function default_secciones()
{
    return [['id' => 'banda', 'nombre' => 'Galería General de la Banda', 'slug' => 'banda']];
}

// Normaliza la lista de ficheros subidos con el mismo nombre de campo (files[] o files repetido)
function uploaded_files($field, $source = null)
{
    $source = $source === null ? $_FILES : $source;
    if (!isset($source[$field])) {
        return [];
    }
    $f = $source[$field];
    if (!is_array($f['name'])) {
        return [$f];
    }
    $out = [];
    foreach ($f['name'] as $i => $name) {
        $out[] = [
            'name' => $name,
            'type' => $f['type'][$i],
            'tmp_name' => $f['tmp_name'][$i],
            'error' => $f['error'][$i],
            'size' => $f['size'][$i],
        ];
    }
    return $out;
}

// Extensiones permitidas: evita que se pueda subir un .php y ejecutarlo en el servidor
function allowed_extension($filename, $allowPdf)
{
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if ($allowPdf) {
        $allowed[] = 'pdf';
    }
    return in_array($ext, $allowed, true);
}

function move_upload($file, $destPath)
{
    if (is_uploaded_file($file['tmp_name'])) {
        return move_uploaded_file($file['tmp_name'], $destPath);
    }
    // Ficheros procesados con request_parse_body() en peticiones PUT
    return rename($file['tmp_name'], $destPath);
}

function ensure_dir($dir)
{
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}
