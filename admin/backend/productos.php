<?php
require_once "db.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Obtener todos los productos con su categoría
$sql = "SELECT p.id_producto, p.nombre_producto, c.nombre_categoria FROM productos p JOIN categorias c ON p.id_categoria = c.id_categoria ORDER BY c.nombre_categoria, p.nombre_producto";
$stmt = $pdo->query($sql);
$productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($productos);
