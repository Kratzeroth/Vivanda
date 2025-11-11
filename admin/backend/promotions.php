<?php
require_once "db.php";

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
            // Marcar como inactivas las promociones expiradas
            $today = date('Y-m-d');
            $pdo->exec("UPDATE promociones SET activo=0 WHERE fecha_fin < '$today' AND activo=1");
            // Obtener todas las promociones con productos asociados
            $sql = "SELECT p.*, GROUP_CONCAT(pr.nombre_producto) as productos
                    FROM promociones p
                    LEFT JOIN producto_promocion pp ON p.id_promocion = pp.id_promocion
                    LEFT JOIN productos pr ON pp.id_producto = pr.id_producto
                    GROUP BY p.id_promocion
                    ORDER BY p.id_promocion DESC";
            $stmt = $pdo->query($sql);
            $promos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($promos as &$promo) {
                $promo['productos'] = $promo['productos'] ? explode(',', $promo['productos']) : [];
            }
            echo json_encode($promos);
            break;
    case 'POST':
        // Crear nueva promoción
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("INSERT INTO promociones (titulo, descripcion, descuento_porcentaje, fecha_inicio, fecha_fin, activo) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['titulo'],
            $data['descripcion'],
            $data['descuento_porcentaje'],
            $data['fecha_inicio'],
            $data['fecha_fin'],
            $data['activo'] ?? 1
        ]);
        $id_promocion = $pdo->lastInsertId();
        // Insertar productos asociados
        if (!empty($data['productos'])) {
            $ins = $pdo->prepare("INSERT INTO producto_promocion (id_producto, id_promocion) VALUES (?, ?)");
            foreach ($data['productos'] as $id_producto) {
                $ins->execute([$id_producto, $id_promocion]);
            }
        }
        echo json_encode(["status" => "success", "id_promocion" => $id_promocion]);
        break;
    case 'PUT':
        // Actualizar promoción
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data['id_promocion'];
        $stmt = $pdo->prepare("UPDATE promociones SET titulo=?, descripcion=?, descuento_porcentaje=?, fecha_inicio=?, fecha_fin=?, activo=? WHERE id_promocion=?");
        $stmt->execute([
            $data['titulo'],
            $data['descripcion'],
            $data['descuento_porcentaje'],
            $data['fecha_inicio'],
            $data['fecha_fin'],
            $data['activo'] ?? 1,
            $id
        ]);
        // Actualizar productos asociados
        $pdo->prepare("DELETE FROM producto_promocion WHERE id_promocion=?")->execute([$id]);
        if (!empty($data['productos'])) {
            $ins = $pdo->prepare("INSERT INTO producto_promocion (id_producto, id_promocion) VALUES (?, ?)");
            foreach ($data['productos'] as $id_producto) {
                $ins->execute([$id_producto, $id]);
            }
        }
        echo json_encode(["status" => "success"]);
        break;
    case 'DELETE':
        // Eliminar promoción
        $id = $_GET['id_promocion'] ?? null;
        if ($id) {
            $pdo->prepare("DELETE FROM producto_promocion WHERE id_promocion=?")->execute([$id]);
            $pdo->prepare("DELETE FROM promociones WHERE id_promocion=?")->execute([$id]);
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Falta id_promocion"]);
        }
        break;
    default:
        echo json_encode(["status" => "error", "message" => "Método no soportado"]);
}
