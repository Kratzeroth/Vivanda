<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db.php'; // usa $pdo (PDO)

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

$id         = $_POST['id_usuario'] ?? null;
$nombres    = $_POST['nombres'] ?? '';
$apellidos  = $_POST['apellidos'] ?? '';
$telefono   = $_POST['telefono'] ?? '';
$correo     = $_POST['correo'] ?? '';
$foto_perfil = null;

if (!$id) {
    echo json_encode(["status" => "error", "message" => "Falta el ID del usuario"]);
    exit;
}

try {
    // 🔹 1. Obtener la foto actual
    $stmtOld = $pdo->prepare("SELECT foto_perfil FROM usuarios WHERE id_usuario = ?");
    $stmtOld->execute([$id]);
    $oldPhoto = $stmtOld->fetchColumn();

    // 🔹 2. Manejo de nueva imagen
    if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
        $carpeta = __DIR__ . "/uploads/perfiles/";
        if (!is_dir($carpeta)) mkdir($carpeta, 0777, true);

        $nombreArchivo = uniqid() . "_" . basename($_FILES['foto_perfil']['name']);
        $rutaDestino = $carpeta . $nombreArchivo;
        $rutaDB = "uploads/perfiles/" . $nombreArchivo;

        if (move_uploaded_file($_FILES['foto_perfil']['tmp_name'], $rutaDestino)) {
            $foto_perfil = $rutaDB;

            // 🔹 3. Eliminar la foto anterior si existe y no es nula
            if ($oldPhoto && file_exists(__DIR__ . "/" . $oldPhoto)) {
                unlink(__DIR__ . "/" . $oldPhoto);
            }
        }
    }

    // 🔹 4. Actualizar datos
    if ($foto_perfil) {
        $sql = "UPDATE usuarios 
                SET nombres = ?, apellidos = ?, telefono = ?, correo = ?, foto_perfil = ? 
                WHERE id_usuario = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nombres, $apellidos, $telefono, $correo, $foto_perfil, $id]);
    } else {
        $sql = "UPDATE usuarios 
                SET nombres = ?, apellidos = ?, telefono = ?, correo = ? 
                WHERE id_usuario = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nombres, $apellidos, $telefono, $correo, $id]);
    }

    echo json_encode(["status" => "success", "message" => "Perfil actualizado correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error al actualizar: " . $e->getMessage()]);
}
?>
