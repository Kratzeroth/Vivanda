<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php"; // tu conexión mysqli o PDO

// 👇 Importar PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

// Obtener email del body
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "El correo es obligatorio"]);
    exit;
}

// Verificar si existe el correo en usuarios
$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE correo = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(["status" => "error", "message" => "Correo no registrado"]);
    exit;
}

// Generar token seguro
$token = bin2hex(random_bytes(32));
$expiracion = date("Y-m-d H:i:s", strtotime("+1 hour"));

// Guardar en tabla de reset
$stmt = $pdo->prepare("INSERT INTO password_resets (email, token, expiracion) VALUES (?, ?, ?)");
$stmt->execute([$email, $token, $expiracion]);

// Link de reseteo
$resetLink = "http://localhost/Vivanda/vivanda/frontend/reset_password.php?token=$token";

// ---- Enviar correo con PHPMailer ----
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;

    // ⚠️ CAMBIA ESTOS DATOS
    $mail->Username = 'vivanda.devteam@gmail.com';   // tu Gmail real
    $mail->Password = 'uekchrodakankevm';     // tu contraseña de aplicación (Google App Password)

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('vivanda.devteam@gmail.com', 'Vivanda');
    $mail->addAddress($email); // destinatario: el usuario que olvidó la contraseña

    $mail->CharSet = 'UTF-8'; // 👈 evita problemas con acentos y ñ
    $mail->isHTML(true);
    $mail->Subject = "Recuperación de contraseña 🔒 - Vivanda";

    $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;'>
            <h2 style='color: #2e7d32; text-align: center;'>Vivanda</h2>
            <p>Hola,</p>
            <p>Recibimos una solicitud para <b>restablecer tu contraseña</b>. Si fuiste tú, haz clic en el siguiente botón. Este enlace será válido por 1 hora.</p>
            
            <div style='text-align: center; margin: 30px 0;'>
                <a href='$resetLink' style='background-color: #2e7d32; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-size: 16px;'>Restablecer contraseña</a>
            </div>
            
            <p>Si no solicitaste este cambio, puedes ignorar este correo con seguridad.</p>
            
            <p style='margin-top: 40px; font-size: 12px; color: #666; text-align: center;'>
                © " . date('Y') . " Vivanda. Todos los derechos reservados.
            </p>
        </div>
    ";

    $mail->send();
    echo json_encode(["status" => "success", "message" => "Correo enviado. Revisa tu bandeja."]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Error al enviar correo: {$mail->ErrorInfo}"]);
}
?>
