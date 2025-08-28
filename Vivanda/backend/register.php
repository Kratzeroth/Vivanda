<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["nombres"], $data["apellidos"], $data["telefono"], $data["correo"], $data["password"])) {
    echo json_encode(["status" => "error", "message" => "Faltan datos"]);
    exit;
}

try {
    // Insertar usuario
    $stmt = $pdo->prepare("INSERT INTO usuarios (nombres, apellidos, telefono, correo) VALUES (?,?,?,?)");
    $stmt->execute([$data["nombres"], $data["apellidos"], $data["telefono"], $data["correo"]]);
    $id_usuario = $pdo->lastInsertId();

    // Username por defecto = correo antes de @
    $username = explode("@", $data["correo"])[0];
    $passwordHash = password_hash($data["password"], PASSWORD_DEFAULT);

    // Insertar credenciales
    $stmt = $pdo->prepare("INSERT INTO credenciales (id_usuario, username, contrasena_hash, activo) VALUES (?,?,?,1)");
    $stmt->execute([$id_usuario, $username, $passwordHash]);

    // Asignar rol (ejemplo: rol_id=2 -> usuario normal)
    $stmt = $pdo->prepare("INSERT INTO usuario_roles (id_usuario, id_rol) VALUES (?,?)");
    $stmt->execute([$id_usuario, 2]);

    // Guardar registro en historial
    $log = $pdo->prepare("INSERT INTO historial_registros (id_usuario, accion, descripcion) VALUES (?, 'registro', 'Usuario registrado en el sistema')");
    $log->execute([$id_usuario]);

    echo json_encode(["status" => "success", "message" => "Usuario registrado", "username" => $username]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}
