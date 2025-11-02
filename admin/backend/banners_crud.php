<?php
// Permitir CORS para desarrollo local
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
require_once 'db.php';
header('Content-Type: application/json');

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'create':
    $titulo = $_POST['title'] ?? '';
    $imagen_url = null;
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '.' . $ext;
        $destDir = realpath(__DIR__ . '/../../cliente/public/images/banners');
        if (!$destDir) {
            mkdir(__DIR__ . '/../../cliente/public/images/banners', 0777, true);
            $destDir = realpath(__DIR__ . '/../../cliente/public/images/banners');
        }
        $dest = $destDir . DIRECTORY_SEPARATOR . $filename;
        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $dest)) {
            $imagen_url = 'images/banners/' . $filename;
        }
    }
    if (!$imagen_url) {
        echo json_encode(['success' => false, 'error' => 'No se subió ninguna imagen']);
        exit;
    }
    $sql = "INSERT INTO banners (titulo, imagen_url) VALUES (?, ?)";
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([$titulo, $imagen_url]);
    echo json_encode(['success' => $result]);
        break;
    case 'edit':
        $id = $_POST['id'] ?? '';
    $titulo = $_POST['title'] ?? '';
    $imagen_url = null;
    // Si se sube una nueva imagen, procesarla y eliminar la anterior
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        // Obtener la imagen actual de la base de datos
        $stmt = $pdo->prepare('SELECT imagen_url FROM banners WHERE id_banner = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $imagen_actual = $row ? $row['imagen_url'] : '';

        $ext = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '.' . $ext;
        $destDir = realpath(__DIR__ . '/../../cliente/public/images/banners');
        if (!$destDir) {
            mkdir(__DIR__ . '/../../cliente/public/images/banners', 0777, true);
            $destDir = realpath(__DIR__ . '/../../cliente/public/images/banners');
        }
        $dest = $destDir . DIRECTORY_SEPARATOR . $filename;
        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $dest)) {
            $imagen_url = 'images/banners/' . $filename;
            // Eliminar la imagen anterior si existe
            if ($imagen_actual) {
                $imgPath = realpath(__DIR__ . '/../../cliente/public/' . $imagen_actual);
                if ($imgPath && file_exists($imgPath)) {
                    unlink($imgPath);
                }
            }
        }
    }
    // Si no se sube imagen, mantener la actual
    if (!$imagen_url) {
        // Obtener la imagen actual de la base de datos
        $stmt = $pdo->prepare('SELECT imagen_url FROM banners WHERE id_banner = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $imagen_url = $row ? $row['imagen_url'] : '';
    }
    $sql = "UPDATE banners SET titulo = ?, imagen_url = ? WHERE id_banner = ?";
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([$titulo, $imagen_url, $id]);
        echo json_encode(['success' => $result]);
        break;
    case 'delete':
        $id = $_POST['id'] ?? '';
    $sql = "DELETE FROM banners WHERE id_banner = ?";
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([$id]);
        echo json_encode(['success' => $result]);
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}
