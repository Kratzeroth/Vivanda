<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require "db.php";

try {
    // Traer productos
        $stmt = $pdo->query("
    SELECT p.id_producto, 
           p.nombre_producto, 
           p.descripcion, 
           p.precio, 
           p.imagen_url,
           p.destacado,
           c.nombre_categoria AS categoria_nombre,
           IFNULL(AVG(o.calificacion),0) AS calificacion
    FROM productos p
    LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
    LEFT JOIN opiniones o ON p.id_producto = o.id_producto
    GROUP BY p.id_producto
    ORDER BY p.fecha_creacion DESC
");

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Traer promociones activas
    $stmt2 = $pdo->query("
        SELECT pp.id_producto, pr.id_promocion, pr.descuento_porcentaje
        FROM producto_promocion pp
        JOIN promociones pr ON pp.id_promocion = pr.id_promocion
        WHERE pr.activo = 1
          AND CURDATE() >= pr.fecha_inicio
          AND CURDATE() <= pr.fecha_fin
    ");
    $promos = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "products" => $products, "promotions" => $promos]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
