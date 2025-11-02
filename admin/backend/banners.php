<?php
// banners.php - CRUD para la tabla banners
require_once 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM banners ORDER BY id_banner DESC";
        $stmt = $pdo->query($sql);
        $banners = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($banners);
        break;
    case 'POST':
        $titulo = $_POST['titulo'] ?? '';
        $activo = isset($_POST['activo']) ? (int)$_POST['activo'] : 1;
        $imagen_url = null;
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . $ext;
            $destDir = realpath(__DIR__ . '/../../cliente/public/imagenes/banners');
            if (!$destDir) {
                mkdir(__DIR__ . '/../../cliente/public/imagenes/banners', 0777, true);
                $destDir = realpath(__DIR__ . '/../../cliente/public/imagenes/banners');
            }
            $dest = $destDir . DIRECTORY_SEPARATOR . $filename;
            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $dest)) {
                $imagen_url = 'imagenes/banners/' . $filename;
            }
        }
        $sql = "INSERT INTO banners (titulo, imagen_url, activo) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $ok = $stmt->execute([$titulo, $imagen_url, $activo]);
        if ($ok) {
            echo json_encode(['success' => true, 'id_banner' => $pdo->lastInsertId()]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error al crear banner']);
        }
        break;
    case 'DELETE':
        $id_banner = isset($_GET['id_banner']) ? (int)$_GET['id_banner'] : 0;
        if ($id_banner > 0) {
            // Eliminar imagen física
            $stmt = $pdo->prepare("SELECT imagen_url FROM banners WHERE id_banner=?");
            $stmt->execute([$id_banner]);
            $banner = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($banner && !empty($banner['imagen_url'])) {
                $imgPath = realpath(__DIR__ . '/../../cliente/public/' . $banner['imagen_url']);
                if ($imgPath && file_exists($imgPath)) {
                    @unlink($imgPath);
                }
            }
            $sql = "DELETE FROM banners WHERE id_banner=?";
            $stmt = $pdo->prepare($sql);
            $ok = $stmt->execute([$id_banner]);
            if ($ok) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Error al borrar banner']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'ID inválido']);
        }
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Método no soportado']);
}
