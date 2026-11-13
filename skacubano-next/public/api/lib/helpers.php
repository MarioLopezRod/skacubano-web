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

// Respuesta JSON pública que el navegador puede guardar 1 minuto. Responde 304 (sin cuerpo)
// si el navegador ya tiene la misma versión. Para lecturas que pide cada visitante.
function json_public_cached($data, $sourceFile = null)
{
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $etag = '"' . md5($json) . '"';

    header('Cache-Control: public, max-age=60, stale-while-revalidate=300');
    header('ETag: ' . $etag);
    if ($sourceFile && file_exists($sourceFile)) {
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($sourceFile)) . ' GMT');
    }
    if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
        http_response_code(304);
        exit;
    }
    http_response_code(200);
    header('Content-Type: application/json; charset=utf-8');
    echo $json;
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

// Foto que antes se asignaba por defecto a los integrantes nuevos (es de Natty Bo)
const OLD_DEFAULT_MEMBER_PHOTO = '/images/photos/bio_portrait_natty.jpg';

function get_gallery_data()
{
    $data = load_json_store('galleryData.json', ['integrantes' => [], 'fotos' => []]);
    if (!isset($data['integrantes']) || !is_array($data['integrantes'])) $data['integrantes'] = [];
    if (!isset($data['fotos']) || !is_array($data['fotos'])) $data['fotos'] = [];
    // Los integrantes creados con la foto por defecto antigua pasan a "sin foto" (la web usa entonces
    // su primera foto o una silueta), salvo el propio Natty Bo
    foreach ($data['integrantes'] as &$m) {
        if (isset($m['fotoPrincipalUrl']) && $m['fotoPrincipalUrl'] === OLD_DEFAULT_MEMBER_PHOTO && $m['id'] !== 'natty-bo') {
            $m['fotoPrincipalUrl'] = '';
        }
    }
    unset($m);

    // Antes, las fotos subidas a una sección guardaban la sección en 'integranteId' (y no salían en la web).
    // Se pasan a 'seccionId'. Las que apuntan a un integrante o sección que ya no existe van a la galería general.
    $memberIds = array_column($data['integrantes'], 'id');
    $sectionIds = isset($data['secciones']) && is_array($data['secciones']) ? array_column($data['secciones'], 'id') : [];
    foreach ($data['fotos'] as &$f) {
        $iid = isset($f['integranteId']) ? $f['integranteId'] : null;
        if ($iid !== null && !in_array($iid, $memberIds, true)) {
            $f['integranteId'] = null;
            $f['esPrincipal'] = false;
            if (in_array($iid, $sectionIds, true) && $iid !== 'banda') {
                $f['seccionId'] = $iid;
            }
        }
        $sid = isset($f['seccionId']) ? $f['seccionId'] : null;
        if ($sid !== null && (!in_array($sid, $sectionIds, true) || $sid === 'banda')) {
            $f['seccionId'] = null;
        }
    }
    unset($f);
    return migrate_gallery_data($data);
}

// Cambios de datos que hay que aplicar una sola vez a un galleryData.json ya existente (el del servidor
// se copió de la semilla hace tiempo y no se vuelve a leer). Lo que falte se toma de seed/galleryData.json.
//  - carrusel-por-defecto: las 17 fotos que el carrusel mostraba "por defecto" pasan a ser fotos normales
//    "solo carrusel", para poder quitarlas o mantenerlas desde el panel. Si ya había fotos elegidas para el
//    carrusel, se añaden ocultas (así la portada sigue mostrando lo mismo que antes).
//  - traducciones-en: textos en inglés de las fotos (descripcionEn) e integrantes (rolEn, bioEn), solo
//    donde estén vacíos.
function migrate_gallery_data($data)
{
    $all = ['carrusel-por-defecto', 'traducciones-en'];
    $done = isset($data['migraciones']) && is_array($data['migraciones']) ? $data['migraciones'] : [];
    $pending = array_values(array_diff($all, $done));
    if (!$pending) {
        return $data;
    }

    $seed = json_decode((string) @file_get_contents(__DIR__ . '/../seed/galleryData.json'), true);
    if (!is_array($seed) || !isset($seed['fotos'], $seed['integrantes'])) {
        return $data;
    }
    if (!isset($data['fotos']) || !is_array($data['fotos'])) {
        $data['fotos'] = [];
    }
    if (!isset($data['integrantes']) || !is_array($data['integrantes'])) {
        $data['integrantes'] = [];
    }

    if (in_array('carrusel-por-defecto', $pending, true)) {
        $existingIds = array_column($data['fotos'], 'id');
        $hasCarousel = false;
        foreach ($data['fotos'] as $f) {
            if (!empty($f['enCarrusel'])) {
                $hasCarousel = true;
                break;
            }
        }
        foreach ($seed['fotos'] as $f) {
            if (strpos($f['id'], 'carrusel-') === 0 && !in_array($f['id'], $existingIds, true)) {
                $f['enCarrusel'] = !$hasCarousel;
                $data['fotos'][] = $f;
            }
        }
    }

    if (in_array('traducciones-en', $pending, true)) {
        $seedFotos = array_column($seed['fotos'], null, 'id');
        foreach ($data['fotos'] as &$f) {
            $s = isset($seedFotos[$f['id']]) ? $seedFotos[$f['id']] : null;
            if ($s && empty($f['descripcionEn']) && !empty($s['descripcionEn'])) {
                $f['descripcionEn'] = $s['descripcionEn'];
            }
        }
        unset($f);
        $seedMembers = array_column($seed['integrantes'], null, 'id');
        foreach ($data['integrantes'] as &$m) {
            $s = isset($seedMembers[$m['id']]) ? $seedMembers[$m['id']] : null;
            foreach (['rolEn', 'bioEn'] as $field) {
                if ($s && empty($m[$field]) && !empty($s[$field])) {
                    $m[$field] = $s[$field];
                }
            }
        }
        unset($m);
    }

    $data['migraciones'] = array_values(array_unique(array_merge($done, $pending)));
    save_gallery_data($data);
    return $data;
}

function is_section_id($data, $id)
{
    if ($id === null || $id === 'banda' || !isset($data['secciones'])) {
        return false;
    }
    foreach ($data['secciones'] as $sec) {
        if ($sec['id'] === $id) {
            return true;
        }
    }
    return false;
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

// Solo se aceptan ficheros recibidos en una subida real (POST); nunca rutas arbitrarias del disco
function move_upload($file, $destPath)
{
    return is_uploaded_file($file['tmp_name']) && move_uploaded_file($file['tmp_name'], $destPath);
}

function ensure_dir($dir)
{
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}
