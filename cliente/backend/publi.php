<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include "db.php";

include "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id_usuario = $_POST["id_usuario"] ?? null;
    $texto = $_POST["texto"] ?? null;
    $imagen_url = null;

    // Validar usuario
    if (!$id_usuario) {
        echo json_encode(["error" => "ID de usuario requerido"]);
        exit;
    }

    // Manejar subida de imagen si existe
    if (isset($_FILES["imagen"]) && $_FILES["imagen"]["error"] === UPLOAD_ERR_OK) {
        $carpetaDestino = "uploads/publicaciones/";
        if (!file_exists($carpetaDestino)) {
            mkdir($carpetaDestino, 0777, true);
        }

        $nombreArchivo = uniqid() . "_" . basename($_FILES["imagen"]["name"]);
        $rutaDestino = $carpetaDestino . $nombreArchivo;

        if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $rutaDestino)) {
            $imagen_url = $rutaDestino;
        }
    }

    // Guardar publicación
    $stmt = $pdo->prepare("INSERT INTO publicaciones (id_usuario, texto, imagen_url) VALUES (?, ?, ?)");
    $stmt->execute([$id_usuario, $texto, $imagen_url]);

    echo json_encode(["success" => true, "message" => "Publicación creada"]);
}
?>
