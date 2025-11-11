<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once "db.php"; // tu conexión PDO

if (!isset($_GET['id'])) {
    echo json_encode(["error" => "Falta el ID del usuario"]);
    exit;
}

$id = intval($_GET['id']);

try {
    // 🔹 Obtener usuario
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id_usuario = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["error" => "Usuario no encontrado"]);
        exit;
    }

    // 🔹 Pedidos del usuario
    $stmtPedidos = $pdo->prepare("SELECT * FROM pedidos WHERE id_usuario = ?");
    $stmtPedidos->execute([$id]);
    $pedidos = $stmtPedidos->fetchAll(PDO::FETCH_ASSOC);

    // 🔹 Agregar productos y reseñas a cada pedido
    foreach ($pedidos as &$pedido) {
        $stmtItems = $pdo->prepare("
            SELECT pd.id_producto, p.nombre_producto, p.imagen_url, pd.cantidad, pd.precio_unitario,
                   o.calificacion, o.comentario, o.fecha AS fecha_opinion
            FROM pedido_detalle pd
            JOIN productos p ON pd.id_producto = p.id_producto
            LEFT JOIN opiniones o ON o.id_producto = pd.id_producto AND o.id_usuario = ?
            WHERE pd.id_pedido = ?
        ");
        $stmtItems->execute([$id, $pedido['id_pedido']]);
        $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        // Ajustar ruta de imagen
        foreach ($items as &$item) {
            $item['imagen_url'] = '/' . $item['imagen_url'];
        }

        $pedido['items'] = $items;

        // Agregar reseñas por pedido
        $pedido['reviews'] = [];
        foreach ($items as $it) {
            if ($it['calificacion']) {
                $pedido['reviews'][] = [
                    'sku' => $it['id_producto'],
                    'rating' => intval($it['calificacion']),
                    'comment' => $it['comentario'],
                    'date' => substr($it['fecha_opinion'], 0, 10)
                ];
            }
        }
    }

    // 🔹 Obtener todas las reseñas del usuario (independientes de los pedidos)
    $stmtResenas = $pdo->prepare("
        SELECT o.id_opinion AS id_resena, o.id_producto, p.nombre_producto, o.calificacion AS puntuacion, o.comentario, o.fecha
        FROM opiniones o
        JOIN productos p ON o.id_producto = p.id_producto
        WHERE o.id_usuario = ?
        ORDER BY o.fecha DESC
    ");
    $stmtResenas->execute([$id]);
    $reseñas = $stmtResenas->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "user" => $user,
        "pedidos" => $pedidos,
        "reseñas" => $reseñas
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error en la consulta: " . $e->getMessage()]);
}
?>
