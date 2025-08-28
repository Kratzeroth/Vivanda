<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["username"], $data["password"])) {
    echo json_encode(["status" => "error", "message" => "Faltan credenciales"]);
    exit;
}

try {   
    $stmt = $pdo->prepare("SELECT c.id_credencial, c.contrasena_hash, u.id_usuario, u.nombres, u.apellidos, u.correo
                           FROM credenciales c
                           JOIN usuarios u ON c.id_usuario = u.id_usuario
                           WHERE c.username = ? AND c.activo = 1 LIMIT 1");
    $stmt->execute([$data["username"]]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data["password"], $user["contrasena_hash"])) {
        // Guardar login exitoso en historial
        $log = $pdo->prepare("INSERT INTO historial_registros (id_usuario, accion, descripcion) VALUES (?, 'login', 'Inicio de sesión exitoso')");
        $log->execute([$user["id_usuario"]]);

        echo json_encode([
            "status" => "success",
            "message" => "Login correcto",
            "usuario" => [
                "nombre" => $user["nombres"] . " " . $user["apellidos"],
                "correo" => $user["correo"]
            ]
        ]);
    } else {
        // Guardar intento fallido
        $userId = $user ? $user["id_usuario"] : null;
        $log = $pdo->prepare("INSERT INTO historial_registros (id_usuario, accion, descripcion) VALUES (?, 'login_fallido', 'Credenciales inválidas')");
        $log->execute([$userId]);

        echo json_encode(["status" => "error", "message" => "Credenciales inválidas"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}
