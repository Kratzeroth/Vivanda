<?php
header("Content-Type: application/json");
include("db.php");

$sql = "SELECT 
            p.id_producto,
            p.nombre_producto AS title,
            p.descripcion,
            p.precio,
            p.imagen_url,
            c.nombre_categoria AS category,
            pr.descuento_porcentaje,
            pr.titulo AS promo_titulo,
            pr.descripcion AS promo_descripcion
        FROM productos p
        INNER JOIN categorias c ON p.id_categoria = c.id_categoria
        INNER JOIN producto_promocion pp ON p.id_producto = pp.id_producto
        INNER JOIN promociones pr ON pp.id_promocion = pr.id_promocion
        WHERE pr.activo = 1
          AND pr.fecha_inicio <= CURDATE()
          AND pr.fecha_fin >= CURDATE()";

$result = $conn->query($sql);

$ofertas = [];
while ($row = $result->fetch_assoc()) {
    $row["price"] = "S/ " . number_format($row["precio"], 2);
    $row["discount"] = $row["descuento_porcentaje"] . "% OFF";
    $ofertas[] = $row;
}

echo json_encode($ofertas);
?>
