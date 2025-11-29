<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_usuario'], $data['id_producto'], $data['calificacion'], $data['comentario'])) {
    echo json_encode(["error" => "Faltan datos requeridos"]);
    exit;
}

$id_usuario = intval($data['id_usuario']);
$id_producto = intval($data['id_producto']);
$calificacion = intval($data['calificacion']);
$comentario = trim($data['comentario']);

try {
    $stmt = $pdo->prepare("INSERT INTO opiniones (id_usuario, id_producto, calificacion, comentario, fecha) VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$id_usuario, $id_producto, $calificacion, $comentario]);
    echo json_encode(["success" => true, "message" => "Reseña guardada correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error al guardar la reseña: " . $e->getMessage()]);
}
?>
