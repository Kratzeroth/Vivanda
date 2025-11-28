<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function ensureGuestSession(PDO $pdo, ?string $guestToken): array
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS chatbot_guest_sessions (
            id_guest INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            guest_token VARCHAR(64) NOT NULL UNIQUE,
            id_usuario INT(11) NOT NULL,
            creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_chatbot_guest_usuario FOREIGN KEY (id_usuario)
                REFERENCES usuarios (id_usuario) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci"
    );

    $normalizedToken = $guestToken ? preg_replace('/[^a-fA-F0-9]/', '', $guestToken) : null;

    if ($normalizedToken) {
        $stmt = $pdo->prepare('SELECT guest_token, id_usuario FROM chatbot_guest_sessions WHERE guest_token = ? LIMIT 1');
        $stmt->execute([$normalizedToken]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($existing) {
            return [
                'guest_token' => $existing['guest_token'],
                'id_usuario' => (int)$existing['id_usuario'],
            ];
        }
    }

    for ($attempt = 0; $attempt < 5; $attempt++) {
        $newToken = bin2hex(random_bytes(16));
        $email = 'guest_' . $newToken . '@guest.vivanda';

        try {
            $pdo->beginTransaction();

            $stmtInsertUser = $pdo->prepare(
                "INSERT INTO usuarios (nombres, apellidos, telefono, correo, foto_perfil)
                 VALUES ('Invitado', 'Chatbot', NULL, ?, NULL)"
            );
            $stmtInsertUser->execute([$email]);
            $idUsuario = (int)$pdo->lastInsertId();

            $stmtInsertSession = $pdo->prepare(
                'INSERT INTO chatbot_guest_sessions (guest_token, id_usuario) VALUES (?, ?)'
            );
            $stmtInsertSession->execute([$newToken, $idUsuario]);

            $pdo->commit();

            return [
                'guest_token' => $newToken,
                'id_usuario' => $idUsuario,
            ];
        } catch (PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }

            // Duplicate token or email, retry with new token
            if ($e->getCode() !== '23000') {
                throw $e;
            }
        }
    }

    throw new RuntimeException('No se pudo crear sesión de invitado.');
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        respond(['status' => 'error', 'message' => 'Método no permitido.'], 405);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input) || empty($input)) {
        $input = $_POST ?? [];
    }

    $idUsuario = isset($input['id_usuario']) ? (int)$input['id_usuario'] : 0;
    $pregunta = isset($input['pregunta']) ? trim((string)$input['pregunta']) : '';
    $respuesta = isset($input['respuesta']) ? trim((string)$input['respuesta']) : '';
    $guestToken = isset($input['guest_token']) ? (string)$input['guest_token'] : null;

    if ($pregunta === '' && $respuesta === '') {
        respond(['status' => 'error', 'message' => 'Se requiere al menos pregunta o respuesta.'], 400);
    }

    if ($idUsuario > 0) {
        $stmt = $pdo->prepare('SELECT id_usuario FROM usuarios WHERE id_usuario = ? LIMIT 1');
        $stmt->execute([$idUsuario]);
        if (!$stmt->fetch(PDO::FETCH_ASSOC)) {
            respond(['status' => 'error', 'message' => 'Usuario no encontrado.'], 404);
        }
    } else {
        $guestSession = ensureGuestSession($pdo, $guestToken);
        $idUsuario = $guestSession['id_usuario'];
        $guestToken = $guestSession['guest_token'];
    }

    $stmtLog = $pdo->prepare(
        'INSERT INTO chatbot_logs (id_usuario, pregunta, respuesta) VALUES (?, ?, ?)'
    );
    $stmtLog->execute([
        $idUsuario,
        $pregunta !== '' ? $pregunta : null,
        $respuesta !== '' ? $respuesta : null,
    ]);

    respond([
        'status' => 'success',
        'id_usuario' => $idUsuario,
        'guest_token' => $guestToken,
    ]);
} catch (RuntimeException $e) {
    respond([
        'status' => 'error',
        'message' => $e->getMessage(),
    ], 500);
} catch (PDOException $e) {
    respond([
        'status' => 'error',
        'message' => 'Error en base de datos: ' . $e->getMessage(),
    ], 500);
}
