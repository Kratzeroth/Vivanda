<?php
// pedido_detalle.php - Devuelve el detalle de productos de cada pedido
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header('Content-Type: application/json');
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $sql = "SELECT pd.id_pedido, pd.id_producto, pd.cantidad, pd.precio_unitario, p.nombre_producto, p.id_categoria, c.nombre_categoria
            FROM pedido_detalle pd
            JOIN productos p ON pd.id_producto = p.id_producto
            JOIN categorias c ON p.id_categoria = c.id_categoria
            ORDER BY pd.id_pedido";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $detalles = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $detalles[] = [
            'id_pedido' => $row['id_pedido'],
            'id_producto' => $row['id_producto'],
            'cantidad' => $row['cantidad'],
            'precio_unitario' => $row['precio_unitario'],
            'nombre_producto' => $row['nombre_producto'],
            'id_categoria' => $row['id_categoria'],
            'nombre_categoria' => $row['nombre_categoria']
        ];
    }
    echo json_encode($detalles);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener detalles: " . $e->getMessage()]);
}
