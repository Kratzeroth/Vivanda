<?php
require_once "db.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Si se pide solo las categorías
        if (isset($_GET['categorias'])) {
            $stmt = $pdo->query("SELECT id_categoria, nombre_categoria FROM categorias ORDER BY nombre_categoria");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;
        }
        // Productos con nombre de categoría
        $stmt = $pdo->query("SELECT p.id_producto, p.nombre_producto, p.descripcion, p.precio, p.imagen_url, c.nombre_categoria FROM productos p LEFT JOIN categorias c ON p.id_categoria = c.id_categoria");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'POST':
        // 🧩 Si es una actualización (PUT simulado)
        if (isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
            $data = $_POST;
            $imagePath = null;

            // Buscar imagen actual
            $stmt = $pdo->prepare("SELECT imagen_url FROM productos WHERE id_producto=?");
            $stmt->execute([$data['id_producto']]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            // Si hay nueva imagen, reemplazarla
            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../../cliente/public/images/productos/';
                if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

                // Eliminar la imagen anterior si existe
                if ($product && !empty($product['imagen_url'])) {
                    $oldFile = __DIR__ . '/../../cliente/public/' . $product['imagen_url'];
                    if (file_exists($oldFile)) unlink($oldFile);
                }

                // Guardar la nueva imagen
                $imageName = time() . '_' . basename($_FILES['imagen']['name']);
                $targetFile = $uploadDir . $imageName;
                move_uploaded_file($_FILES['imagen']['tmp_name'], $targetFile);
                $imagePath = 'images/productos/' . $imageName;
            }

            // Actualizar producto
            if ($imagePath) {
                $stmt = $pdo->prepare("UPDATE productos SET nombre_producto=?, descripcion=?, precio=?, imagen_url=? WHERE id_producto=?");
                $stmt->execute([
                    $data['nombre_producto'],
                    $data['descripcion'],
                    $data['precio'],
                    $imagePath,
                    $data['id_producto']
                ]);
            } else {
                $stmt = $pdo->prepare("UPDATE productos SET nombre_producto=?, descripcion=?, precio=? WHERE id_producto=?");
                $stmt->execute([
                    $data['nombre_producto'],
                    $data['descripcion'],
                    $data['precio'],
                    $data['id_producto']
                ]);
            }

            echo json_encode(["status" => "success"]);
            exit;
        }

        // 🟢 Nuevo producto
        $data = $_POST;
        $imagePath = null;

        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../cliente/public/images/productos/';
            if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

            $imageName = time() . '_' . basename($_FILES['imagen']['name']);
            $targetFile = $uploadDir . $imageName;
            move_uploaded_file($_FILES['imagen']['tmp_name'], $targetFile);
            $imagePath = 'images/productos/' . $imageName;
        }

        $id_categoria = isset($data['id_categoria']) ? $data['id_categoria'] : null;
        $stmt = $pdo->prepare("INSERT INTO productos (nombre_producto, descripcion, precio, imagen_url, id_categoria) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['nombre_producto'],
            $data['descripcion'],
            $data['precio'],
            $imagePath,
            $id_categoria
        ]);
        echo json_encode(["status" => "success", "id" => $pdo->lastInsertId()]);
        break;

    case 'DELETE':
        $id = $_GET['id_producto'] ?? null;
        if (!$id) {
            echo json_encode(["status" => "error", "message" => "ID no proporcionado"]);
            exit;
        }

        // Eliminar imagen del servidor
        $stmt = $pdo->prepare("SELECT imagen_url FROM productos WHERE id_producto=?");
        $stmt->execute([$id]);
        $p = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($p && $p['imagen_url']) {
            $path = __DIR__ . '/../../cliente/public/' . $p['imagen_url'];
            if (file_exists($path)) unlink($path);
        }

        $stmt = $pdo->prepare("DELETE FROM productos WHERE id_producto=?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "success"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
