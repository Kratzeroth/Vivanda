<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require "db.php";

$id_usuario = isset($_GET["id_usuario"]) ? intval($_GET["id_usuario"]) : 0;

if ($id_usuario <= 0) {
    echo json_encode(["status" => "error", "message" => "id_usuario inválido"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id_carrito FROM carrito WHERE id_usuario = ? LIMIT 1");
    $stmt->execute([$id_usuario]);
    $carrito = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$carrito) {
        echo json_encode(["status" => "success", "productos" => [], "total" => 0]);
        exit;
    }

    $id_carrito = $carrito["id_carrito"];

    $stmt = $pdo->prepare("
        SELECT 
            cd.id_producto,
            p.nombre_producto AS nombre,
            p.precio,
            p.imagen_url AS imagen,
            cd.cantidad
        FROM carrito_detalle cd
        INNER JOIN productos p ON cd.id_producto = p.id_producto
        WHERE cd.id_carrito = ?
    ");
    $stmt->execute([$id_carrito]);
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $total = 0;
    foreach ($productos as $prod) {
        $total += $prod['precio'] * $prod['cantidad'];
    }

    echo json_encode([
        "status" => "success",
        "id_usuario" => $id_usuario, // 👈 debug
        "id_carrito" => $id_carrito, // 👈 debug
        "productos" => $productos,
        "total" => $total
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
