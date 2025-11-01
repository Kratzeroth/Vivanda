<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

require 'db.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents('php://input'), true);
$id_usuario = $data['id_usuario'] ?? null; // usar id_usuario del login
$total = $data['total'] ?? 0;
$metodo_pago = 'tarjeta';

if (!$id_usuario || !$total) {
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
    exit;
}

try {
    // 1️⃣ Verificar carrito activo
    $stmt = $pdo->prepare("SELECT id_carrito FROM carrito WHERE id_usuario = ? LIMIT 1");
    $stmt->execute([$id_usuario]);
    $carrito = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$carrito) {
        echo json_encode(['status'=>'error','message'=>'No se encontró carrito activo']);
        exit;
    }

    $id_carrito = $carrito['id_carrito'];

    // 2️⃣ Crear pedido
    $stmt = $pdo->prepare("INSERT INTO pedidos (id_usuario, total, estado) VALUES (?, ?, 'pagado')");
    $stmt->execute([$id_usuario, $total]);
    $id_pedido = $pdo->lastInsertId();

    // 3️⃣ Insertar detalles del carrito en pedido_detalle
    $stmt = $pdo->prepare("
        SELECT cd.id_producto, cd.cantidad, p.precio 
        FROM carrito_detalle cd
        JOIN productos p ON cd.id_producto = p.id_producto
        WHERE cd.id_carrito = ?
    ");
    $stmt->execute([$id_carrito]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmtInsert = $pdo->prepare("
        INSERT INTO pedido_detalle (id_pedido, id_producto, cantidad, precio_unitario)
        VALUES (?, ?, ?, ?)
    ");
    foreach ($items as $item) {
        $stmtInsert->execute([$id_pedido, $item['id_producto'], $item['cantidad'], $item['precio']]);
    }

    // 4️⃣ Registrar el pago
    $stmt = $pdo->prepare("INSERT INTO pagos (id_pedido, metodo_pago, monto, estado) VALUES (?, ?, ?, 'exitoso')");
    $stmt->execute([$id_pedido, $metodo_pago, $total]);

    // 5️⃣ Limpiar carrito
    $stmt = $pdo->prepare("DELETE FROM carrito_detalle WHERE id_carrito = ?");
    $stmt->execute([$id_carrito]);

    echo json_encode(['status' => 'success', 'message' => 'Pago procesado', 'id_pedido' => $id_pedido]);

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
