<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include "db.php";

include "db.php";

$stmt = $pdo->query("
    SELECT p.*, u.nombres, u.apellidos, u.foto_perfil 
    FROM publicaciones p
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    ORDER BY p.fecha_publicacion DESC
");

$publicaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($publicaciones);
?>
