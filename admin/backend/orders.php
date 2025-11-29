<?php
// admin/backend/orders.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Content-Type: application/json');
require_once 'db.php';

try {
    $sql = "SELECT p.id_pedido, CONCAT(u.nombres, ' ', u.apellidos) AS cliente, p.total, p.estado, p.fecha_pedido
            FROM pedidos p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            ORDER BY p.fecha_pedido DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $orders = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $orders[] = [
            'id' => $row['id_pedido'],
            'customer' => $row['cliente'],
            'total' => (float)$row['total'],
            'status' => ucfirst($row['estado']),
            'date' => substr($row['fecha_pedido'], 0, 10)
        ];
    }
    echo json_encode($orders);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener pedidos: " . $e->getMessage()]);
}
