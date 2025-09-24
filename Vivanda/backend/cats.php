<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require "db.php";

try {
    $stmt = $pdo->query("
        SELECT id_categoria, nombre_categoria, descripcion, imagen_url
        FROM categorias
        ORDER BY nombre_categoria
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $rows]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
