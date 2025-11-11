<?php
// users.php - CRUD para la tabla usuarios

require_once 'db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Obtener todos los usuarios con su rol
        $sql = "SELECT u.*, r.nombre_rol AS rol FROM usuarios u
                LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
                LEFT JOIN roles r ON ur.id_rol = r.id_rol
                ORDER BY u.id_usuario DESC";
        $stmt = $pdo->query($sql);
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($usuarios);
        break;
    case 'POST':
        // Crear usuario
        // Soportar tanto JSON como multipart/form-data
        if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
            $data = json_decode(file_get_contents('php://input'), true);
        } else {
            $data = $_POST;
        }
        $nombres = $data['nombres'] ?? '';
        $apellidos = $data['apellidos'] ?? '';
        $telefono = $data['telefono'] ?? '';
        $correo = $data['correo'] ?? '';
        $foto_perfil = null;
        if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['foto_perfil']['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . $ext;
            // Guardar SIEMPRE en cliente/backend/uploads/perfiles
            $destDir = realpath(__DIR__ . '/../../cliente/backend/uploads/perfiles');
            if (!$destDir) {
                mkdir(__DIR__ . '/../../cliente/backend/uploads/perfiles', 0777, true);
                $destDir = realpath(__DIR__ . '/../../cliente/backend/uploads/perfiles');
            }
            $dest = $destDir . DIRECTORY_SEPARATOR . $filename;
            if (move_uploaded_file($_FILES['foto_perfil']['tmp_name'], $dest)) {
                $foto_perfil = 'uploads/perfiles/' . $filename;
                // Si es edición, eliminar la imagen anterior
                if (isset($data['_method']) && $data['_method'] === 'PUT' && !empty($data['id_usuario'])) {
                    $stmtOld = $pdo->prepare("SELECT foto_perfil FROM usuarios WHERE id_usuario = ?");
                    $stmtOld->execute([$data['id_usuario']]);
                    $old = $stmtOld->fetch(PDO::FETCH_ASSOC);
                    if ($old && !empty($old['foto_perfil'])) {
                        $oldPath = realpath(__DIR__ . '/../../cliente/backend/' . $old['foto_perfil']);
                        if ($oldPath && file_exists($oldPath)) {
                            @unlink($oldPath);
                        }
                    }
                }
            }
        } elseif (!empty($data['foto_perfil'])) {
            $foto_perfil = $data['foto_perfil'];
        }

        // Rol
        $rol = $data['rol'] ?? 'Usuario';
        $id_rol = 2; // Usuario por defecto
        if (strtolower($rol) === 'administrador' || strtolower($rol) === 'admin') {
            $id_rol = 1;
        }
        // Si es edición
        if (isset($data['_method']) && $data['_method'] === 'PUT') {
            $id_usuario = (int)($data['id_usuario'] ?? 0);
            $sql = "UPDATE usuarios SET nombres=?, apellidos=?, telefono=?, correo=?, foto_perfil=? WHERE id_usuario=?";
            $stmt = $pdo->prepare($sql);
            $ok = $stmt->execute([$nombres, $apellidos, $telefono, $correo, $foto_perfil, $id_usuario]);
            if ($ok) {
                // Actualizar rol en usuario_roles
                $pdo->prepare("DELETE FROM usuario_roles WHERE id_usuario=?")->execute([$id_usuario]);
                $pdo->prepare("INSERT INTO usuario_roles (id_usuario, id_rol) VALUES (?, ?)")->execute([$id_usuario, $id_rol]);
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Error al actualizar usuario']);
            }
        } else {
            // Crear
            $sql = "INSERT INTO usuarios (nombres, apellidos, telefono, correo, foto_perfil) VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $ok = $stmt->execute([$nombres, $apellidos, $telefono, $correo, $foto_perfil]);
            if ($ok) {
                $id_usuario = $pdo->lastInsertId();
                $pdo->prepare("INSERT INTO usuario_roles (id_usuario, id_rol) VALUES (?, ?)")->execute([$id_usuario, $id_rol]);
                echo json_encode(['success' => true, 'id_usuario' => $id_usuario]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Error al crear usuario']);
            }
        }
        break;
    // PUT no es necesario, se maneja por POST con _method=PUT
    case 'DELETE':
        // Borrar usuario
        $id_usuario = isset($_GET['id_usuario']) ? (int)$_GET['id_usuario'] : 0;
        if ($id_usuario > 0) {
            $sql = "DELETE FROM usuarios WHERE id_usuario=?";
            $stmt = $pdo->prepare($sql);
            $ok = $stmt->execute([$id_usuario]);
            if ($ok) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Error al borrar usuario']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'ID inválido']);
        }
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Método no soportado']);
}
