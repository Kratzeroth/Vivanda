<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id_usuario"]) || !isset($data["id_producto"])) {
    echo json_encode(["status" => "error", "message" => "Faltan datos"]);
    exit;
}

$id_usuario = intval($data["id_usuario"]);
$id_producto = intval($data["id_producto"]);
$cantidad = isset($data["cantidad"]) ? intval($data["cantidad"]) : 1;

try {
    // 1. Verificar si el usuario ya tiene carrito activo
    $stmt = $pdo->prepare("SELECT id_carrito FROM carrito WHERE id_usuario = ? LIMIT 1");
    $stmt->execute([$id_usuario]);
    $carrito = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($carrito) {
        $id_carrito = $carrito["id_carrito"];
    } else {
        // Crear carrito nuevo
        $stmt = $pdo->prepare("INSERT INTO carrito (id_usuario, fecha_creacion) VALUES (?, NOW())");
        $stmt->execute([$id_usuario]);
        $id_carrito = $pdo->lastInsertId();
    }

    // 2. Revisar si el producto ya está en carrito_detalle
    $stmt = $pdo->prepare("SELECT id_producto FROM carrito_detalle WHERE id_carrito = ? AND id_producto = ?");
    $stmt->execute([$id_carrito, $id_producto]);
    $detalle = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($detalle) {
        // Si ya existe → aumentar cantidad
        $stmt = $pdo->prepare("UPDATE carrito_detalle SET cantidad = cantidad + ? WHERE id_carrito = ? AND id_producto = ?");
        $stmt->execute([$cantidad, $id_carrito, $id_producto]);
    } else {
        // Insertar nuevo producto en el carrito
        $stmt = $pdo->prepare("INSERT INTO carrito_detalle (id_carrito, id_producto, cantidad) VALUES (?, ?, ?)");
        $stmt->execute([$id_carrito, $id_producto, $cantidad]);
    }

    echo json_encode([
        "status" => "success",
        "message" => "Producto agregado al carrito",
        "id_carrito" => $id_carrito
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
