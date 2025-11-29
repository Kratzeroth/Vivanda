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
    // Obtener todas las categorías
    case 'GET':
        try {
            $sql = "SELECT id_categoria, nombre_categoria, descripcion, imagen_url 
                    FROM categorias 
                    ORDER BY id_categoria DESC";
            $stmt = $pdo->query($sql);
            $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($categorias);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    // Crear o actualizar categoría
    case 'POST':
        $data = $_POST;
        $imagePath = null;

        // Subida de imagen (si existe)
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../../cliente/public/images/categorias/';
            if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);
            $imageName = time() . '_' . basename($_FILES['imagen']['name']);
            $targetFile = $uploadDir . $imageName;
            move_uploaded_file($_FILES['imagen']['tmp_name'], $targetFile);
            $imagePath = 'images/categorias/' . $imageName;
        }

        // Crear nueva categoría
        if (!isset($data['_method'])) {
            try {
                $stmt = $pdo->prepare("INSERT INTO categorias (nombre_categoria, descripcion, imagen_url) VALUES (?, ?, ?)");
                $stmt->execute([
                    trim($data['nombre_categoria']),
                    $data['descripcion'] ?? null,
                    $imagePath
                ]);
                echo json_encode(["status" => "success"]);
            } catch (PDOException $e) {
                if ($e->getCode() == 23000) {
                    echo json_encode(["status" => "error", "message" => "Ya existe una categoría con ese nombre."]);
                } else {
                    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
                }
            }
            exit;
        }

        // Actualizar categoría (PUT simulado)
        if ($data['_method'] === 'PUT') {
            if (!isset($data['id_categoria']) || !isset($data['nombre_categoria'])) {
                echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
                exit;
            }

            // Obtener datos actuales
            $stmt = $pdo->prepare("SELECT nombre_categoria, imagen_url FROM categorias WHERE id_categoria = ?");
            $stmt->execute([$data['id_categoria']]);
            $catRow = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$catRow) {
                echo json_encode(["status" => "error", "message" => "Categoría no encontrada"]);
                exit;
            }

            $nombreActual = trim(mb_strtolower($catRow['nombre_categoria']));
            $nombreNuevo = trim(mb_strtolower($data['nombre_categoria']));
            $oldImage = $catRow['imagen_url'];

            // Validar duplicado solo si cambia el nombre
            if ($nombreActual !== $nombreNuevo) {
                $check = $pdo->prepare("SELECT COUNT(*) FROM categorias WHERE TRIM(LOWER(nombre_categoria)) = ? AND id_categoria != ?");
                $check->execute([$nombreNuevo, $data['id_categoria']]);
                if ($check->fetchColumn() > 0) {
                    echo json_encode(["status" => "error", "message" => "Ya existe una categoría con ese nombre."]);
                    exit;
                }
                $catRow['nombre_categoria'] = $data['nombre_categoria']; // usar el nuevo nombre
            }

            // Reemplazar imagen si se sube una nueva
            if ($imagePath) {
                if (!empty($oldImage)) {
                    $oldFile = __DIR__ . '/../../cliente/public/' . $oldImage;
                    if (file_exists($oldFile)) unlink($oldFile);
                }
                $stmt = $pdo->prepare("UPDATE categorias SET nombre_categoria=?, descripcion=?, imagen_url=? WHERE id_categoria=?");
                $stmt->execute([$catRow['nombre_categoria'], $data['descripcion'], $imagePath, $data['id_categoria']]);
            } else {
                $stmt = $pdo->prepare("UPDATE categorias SET nombre_categoria=?, descripcion=? WHERE id_categoria=?");
                $stmt->execute([$catRow['nombre_categoria'], $data['descripcion'], $data['id_categoria']]);
            }

            echo json_encode(["status" => "success"]);
            exit;
        }

        break;

    // Eliminar categoría
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['id_categoria'])) {
            echo json_encode(["status" => "error", "message" => "ID inválido"]);
            exit;
        }
        try {
            // Eliminar imagen del servidor
            $stmt = $pdo->prepare("SELECT imagen_url FROM categorias WHERE id_categoria = ?");
            $stmt->execute([$data['id_categoria']]);
            $cat = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($cat && !empty($cat['imagen_url'])) {
                $file = __DIR__ . '/../../cliente/public/' . $cat['imagen_url'];
                if (file_exists($file)) unlink($file);
            }

            $stmt = $pdo->prepare("DELETE FROM categorias WHERE id_categoria = ?");
            $stmt->execute([$data['id_categoria']]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Método no permitido"]);
        break;
}
