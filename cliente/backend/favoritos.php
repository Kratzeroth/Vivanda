<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS");
header("Content-Type: application/json");

require "db.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data["id_usuario"], $data["id_producto"])) {
        echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("INSERT IGNORE INTO favoritos (id_usuario, id_producto) VALUES (?, ?)");
        $stmt->execute([$data["id_usuario"], $data["id_producto"]]);
        echo json_encode(["status" => "success", "message" => "Producto agregado a favoritos"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data["id_usuario"], $data["id_producto"])) {
        echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("DELETE FROM favoritos WHERE id_usuario = ? AND id_producto = ?");
        $stmt->execute([$data["id_usuario"], $data["id_producto"]]);
        echo json_encode(["status" => "success", "message" => "Producto eliminado de favoritos"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
    exit;
}

if ($method === 'GET') {
    if (!isset($_GET["id_usuario"])) {
        echo json_encode(["status" => "error", "message" => "Falta id_usuario"]);
        exit;
    }
    $id_usuario = $_GET["id_usuario"];
    try {
        $stmt = $pdo->prepare("SELECT id_producto FROM favoritos WHERE id_usuario = ?");
        $stmt->execute([$id_usuario]);
        $favoritos = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo json_encode(["status" => "success", "favoritos" => $favoritos]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
    exit;
}

echo json_encode(["status" => "error", "message" => "Método no soportado"]);
