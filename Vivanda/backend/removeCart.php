<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require "db.php"; // este ya debe definir $pdo (PDO)

$data = json_decode(file_get_contents("php://input"), true);
$id_usuario = $data["id_usuario"] ?? null;
$id_producto = $data["id_producto"] ?? null;

if (!$id_usuario || !$id_producto) {
    echo json_encode(["status" => "error", "message" => "Faltan parámetros"]);
    exit;
}

try {
    // Buscar el último carrito del usuario
    $stmt = $pdo->prepare("SELECT id_carrito FROM carrito WHERE id_usuario=? ORDER BY fecha_creacion DESC LIMIT 1");
    $stmt->execute([$id_usuario]);
    $carrito = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$carrito) {
        echo json_encode(["status" => "error", "message" => "Carrito no encontrado"]);
        exit;
    }

    $id_carrito = $carrito["id_carrito"];

    // Verificar producto en carrito_detalle
    $q = $pdo->prepare("
        SELECT cd.cantidad, p.precio
        FROM carrito_detalle cd
        INNER JOIN productos p ON cd.id_producto = p.id_producto
        WHERE cd.id_carrito=? AND cd.id_producto=? LIMIT 1
    ");
    $q->execute([$id_carrito, $id_producto]);
    $row = $q->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(["status" => "error", "message" => "Producto no encontrado en carrito_detalle", "debug" => [$id_carrito, $id_producto]]);
        exit;
    }

    $cantidad = $row["cantidad"];
    $precio   = $row["precio"];

    // Eliminar producto
    $delete = $pdo->prepare("DELETE FROM carrito_detalle WHERE id_carrito=? AND id_producto=?");
    $ok = $delete->execute([$id_carrito, $id_producto]);

    if ($ok && $delete->rowCount() > 0) {
        echo json_encode([
            "status" => "success",
            "message" => "Producto eliminado",
            "cantidad_eliminada" => $cantidad,
            "precio_eliminado" => $precio
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se pudo eliminar", "debug" => [$id_carrito, $id_producto]]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
