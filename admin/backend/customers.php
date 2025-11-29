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
    // 🔹 Obtener todos los clientes
    case 'GET':
        try {
            $sql = "SELECT 
                        c.id_cliente,
                        c.nombres,
                        c.apellidos,
                        c.telefono,
                        c.correo,
                        c.fecha_registro,
                        u.id_usuario,
                        u.foto_perfil,
                        cred.activo AS status
                    FROM clientes c
                    LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
                    LEFT JOIN credenciales cred ON u.id_usuario = cred.id_usuario
                    ORDER BY c.fecha_registro DESC";
            $stmt = $pdo->query($sql);
            $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($clientes);
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    // 🔹 Crear un nuevo cliente
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            echo json_encode(["status" => "error", "message" => "Datos inválidos"]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO clientes (nombres, apellidos, telefono, correo) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['nombres'],
                $data['apellidos'],
                $data['telefono'] ?? null,
                $data['correo']
            ]);
            echo json_encode(["status" => "success", "id" => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    // 🔹 Actualizar cliente y estado activo
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['id_cliente'])) {
            echo json_encode(["status" => "error", "message" => "ID no proporcionado"]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE clientes SET nombres=?, apellidos=?, telefono=?, correo=? WHERE id_cliente=?");
            $stmt->execute([
                $data['nombres'],
                $data['apellidos'],
                $data['telefono'],
                $data['correo'],
                $data['id_cliente']
            ]);

            if (isset($data['id_usuario']) && isset($data['status'])) {
                $activo = ($data['status'] === 'activo') ? 1 : 0;
                $stmt2 = $pdo->prepare("UPDATE credenciales SET activo=? WHERE id_usuario=?");
                $stmt2->execute([$activo, $data['id_usuario']]);
            }

            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    // 🔹 Eliminar cliente
    case 'DELETE':
        $id = $_GET['id_cliente'] ?? null;
        if (!$id) {
            echo json_encode(["status" => "error", "message" => "ID no proporcionado"]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM clientes WHERE id_cliente=?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
