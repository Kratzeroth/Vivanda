<?php
// payments.php - Listar pagos realizados
require_once 'db.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
try {
    $sql = "SELECT p.id_pago, p.id_pedido, p.monto, p.metodo, p.fecha_pago, o.estado, o.total, u.nombres, u.apellidos
            FROM pagos p
            JOIN pedidos o ON p.id_pedido = o.id_pedido
            JOIN usuarios u ON o.id_usuario = u.id_usuario
            ORDER BY p.fecha_pago DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $pagos = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $pagos[] = [
            'id_pago' => $row['id_pago'],
            'id_pedido' => $row['id_pedido'],
            'monto' => $row['monto'],
            'metodo' => $row['metodo'],
            'fecha_pago' => $row['fecha_pago'],
            'estado_pedido' => $row['estado'],
            'total_pedido' => $row['total'],
            'cliente' => $row['nombres'] . ' ' . $row['apellidos']
        ];
    }
    echo json_encode($pagos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener pagos: " . $e->getMessage()]);
}
