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
    $pdo->beginTransaction();

    $nombres   = trim($data["nombres"]);
    $apellidos = trim($data["apellidos"]);
    $telefono  = trim($data["telefono"]);
    $correo    = trim($data["correo"]);
    $password  = password_hash($data["password"], PASSWORD_DEFAULT);

    // Username por defecto = parte antes de @
    $username = explode("@", $correo)[0];

    // 1. Verificar si ya existe username
    $stmt = $pdo->prepare("SELECT id_credencial FROM credenciales WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "error", "message" => "El nombre de usuario ya existe"]);
        exit;
    }

    // 2. Buscar si ya existe cliente con ese correo
    $stmt = $pdo->prepare("SELECT id_cliente, id_usuario FROM clientes WHERE correo = ?");
    $stmt->execute([$correo]);
    $cliente = $stmt->fetch(PDO::FETCH_ASSOC);

    // 3. Crear usuario en tabla usuarios
    $stmt = $pdo->prepare("INSERT INTO usuarios (nombres, apellidos, telefono, correo) VALUES (?,?,?,?)");
    $stmt->execute([$nombres, $apellidos, $telefono, $correo]);
    $id_usuario = $pdo->lastInsertId();

    // 4. Insertar credenciales
    $stmt = $pdo->prepare("INSERT INTO credenciales (id_usuario, username, contrasena_hash, activo) VALUES (?,?,?,1)");
    $stmt->execute([$id_usuario, $username, $password]);

    // 5. Asignar rol por defecto → Usuario (id_rol = 2)
    $stmt = $pdo->prepare("INSERT INTO usuario_roles (id_usuario, id_rol) VALUES (?,2)");
    $stmt->execute([$id_usuario]);

    // 6. Manejar cliente
    if ($cliente) {
        // Si ya existía, actualizarlo con el id_usuario
        $stmt = $pdo->prepare("UPDATE clientes SET id_usuario = ? WHERE id_cliente = ?");
        $stmt->execute([$id_usuario, $cliente["id_cliente"]]);
    } else {
        // Si no existía, crearlo
        $stmt = $pdo->prepare("INSERT INTO clientes (nombres, apellidos, telefono, correo, id_usuario) VALUES (?,?,?,?,?)");
        $stmt->execute([$nombres, $apellidos, $telefono, $correo, $id_usuario]);
    }

    // 7. Guardar en historial
    $log = $pdo->prepare("INSERT INTO historial_registros (id_usuario, accion, descripcion) VALUES (?, 'registro', 'Usuario registrado en el sistema')");
    $log->execute([$id_usuario]);

    $pdo->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Usuario registrado correctamente",
        "username" => $username
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}
