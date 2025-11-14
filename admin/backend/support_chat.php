<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function respond(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $action = $_GET['action'] ?? 'chats';

        if ($action === 'chats') {
            $query = "SELECT
                        c.id_chat,
                        c.id_usuario,
                        c.id_agente,
                        c.estado,
                        c.fecha_creacion,
                        CONCAT(COALESCE(u.nombres, ''), ' ', COALESCE(u.apellidos, '')) AS usuario_nombre,
                        u.correo AS usuario_correo,
                        (
                            SELECT texto FROM mensajes m
                            WHERE m.id_chat = c.id_chat
                            ORDER BY m.fecha_envio DESC, m.id_mensaje DESC
                            LIMIT 1
                        ) AS last_message,
                        (
                            SELECT fecha_envio FROM mensajes m
                            WHERE m.id_chat = c.id_chat
                            ORDER BY m.fecha_envio DESC, m.id_mensaje DESC
                            LIMIT 1
                        ) AS last_time,
                        (
                            SELECT remitente FROM mensajes m
                            WHERE m.id_chat = c.id_chat
                            ORDER BY m.fecha_envio DESC, m.id_mensaje DESC
                            LIMIT 1
                        ) AS last_sender
                    FROM chats c
                    LEFT JOIN usuarios u ON u.id_usuario = c.id_usuario
                    ORDER BY last_time DESC, c.fecha_creacion DESC";

            $stmt = $pdo->query($query);
            $chats = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($chats as &$chat) {
                $chat['usuario_nombre'] = trim($chat['usuario_nombre']) ?: 'Cliente #' . $chat['id_usuario'];
                $chat['last_time'] = $chat['last_time'] ? date(DATE_ATOM, strtotime($chat['last_time'])) : null;
            }

            respond(['chats' => $chats]);
        }

        if ($action === 'messages') {
            $idChat = isset($_GET['id_chat']) ? (int)$_GET['id_chat'] : 0;
            if ($idChat <= 0) {
                respond(['error' => 'Falta el id_chat.'], 400);
            }

            $stmt = $pdo->prepare("SELECT id_mensaje, id_chat, remitente, texto, fecha_envio
                                    FROM mensajes
                                    WHERE id_chat = ?
                                    ORDER BY fecha_envio ASC, id_mensaje ASC");
            $stmt->execute([$idChat]);
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($messages as &$message) {
                $message['fecha_envio'] = date(DATE_ATOM, strtotime($message['fecha_envio']));
            }

            respond(['messages' => $messages]);
        }

        if ($action === 'user_chat') {
            $idUsuario = isset($_GET['id_usuario']) ? (int)$_GET['id_usuario'] : 0;
            if ($idUsuario <= 0) {
                respond(['error' => 'Falta el id_usuario.'], 400);
            }

            $stmt = $pdo->prepare("SELECT id_chat, id_usuario, id_agente, estado, fecha_creacion
                                    FROM chats
                                    WHERE id_usuario = ?
                                    ORDER BY fecha_creacion DESC
                                    LIMIT 1");
            $stmt->execute([$idUsuario]);
            $chat = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($chat) {
                $chat['fecha_creacion'] = date(DATE_ATOM, strtotime($chat['fecha_creacion']));
                respond(['chat' => $chat]);
            }

            respond(['chat' => null]);
        }

        respond(['error' => 'Acción no soportada.'], 400);
    }

    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) {
            $input = $_POST ?? [];
        }

        $action = $input['action'] ?? 'send';

        if ($action === 'start') {
            $idUsuario = isset($input['id_usuario']) ? (int)$input['id_usuario'] : 0;
            $texto = trim($input['texto'] ?? '');
            if ($idUsuario <= 0) {
                respond(['error' => 'Falta id_usuario para iniciar chat.'], 400);
            }

            $pdo->beginTransaction();

            $stmt = $pdo->prepare("SELECT id_chat, estado FROM chats WHERE id_usuario = ? ORDER BY fecha_creacion DESC LIMIT 1 FOR UPDATE");
            $stmt->execute([$idUsuario]);
            $chat = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($chat && $chat['estado'] !== 'Cerrado') {
                $idChat = (int)$chat['id_chat'];
            } else {
                $stmtInsertChat = $pdo->prepare("INSERT INTO chats (id_usuario, estado) VALUES (?, 'Abierto')");
                $stmtInsertChat->execute([$idUsuario]);
                $idChat = (int)$pdo->lastInsertId();
            }

            if ($texto !== '') {
                $stmtInsertMsg = $pdo->prepare('INSERT INTO mensajes (id_chat, remitente, texto) VALUES (?, ?, ?)');
                $stmtInsertMsg->execute([$idChat, 'user', $texto]);
            }

            $pdo->commit();

            respond([
                'success' => true,
                'chat' => ['id_chat' => $idChat, 'id_usuario' => $idUsuario],
            ]);
        }

        if ($action === 'send') {
            $idChat = isset($input['id_chat']) ? (int)$input['id_chat'] : 0;
            $texto = trim($input['texto'] ?? '');
            $remitente = $input['remitente'] ?? 'agent';
            $idAgente = isset($input['id_agente']) ? (int)$input['id_agente'] : null;
            $idUsuario = isset($input['id_usuario']) ? (int)$input['id_usuario'] : null;

            if ($idChat <= 0 && $idUsuario > 0) {
                $stmtExisting = $pdo->prepare("SELECT id_chat, estado FROM chats WHERE id_usuario = ? AND estado != 'Cerrado' ORDER BY fecha_creacion DESC LIMIT 1");
                $stmtExisting->execute([$idUsuario]);
                $existingChat = $stmtExisting->fetch(PDO::FETCH_ASSOC);
                if ($existingChat) {
                    $idChat = (int)$existingChat['id_chat'];
                }
            }

            if (($idChat <= 0 && $idUsuario === null) || $texto === '' || !in_array($remitente, ['agent', 'user'], true)) {
                respond(['error' => 'Datos incompletos para enviar el mensaje.'], 400);
            }

            $pdo->beginTransaction();

            if ($idChat > 0) {
                $stmtChat = $pdo->prepare('SELECT id_chat, id_agente, id_usuario, estado FROM chats WHERE id_chat = ? FOR UPDATE');
                $stmtChat->execute([$idChat]);
                $chat = $stmtChat->fetch(PDO::FETCH_ASSOC);
            } else {
                $chat = false;
            }

            if (!$chat) {
                if ($idUsuario === null) {
                    $pdo->rollBack();
                    respond(['error' => 'Chat no encontrado.'], 404);
                }

                $stmtInsertChat = $pdo->prepare("INSERT INTO chats (id_usuario, estado) VALUES (?, 'Abierto')");
                $stmtInsertChat->execute([$idUsuario]);
                $idChat = (int)$pdo->lastInsertId();
                $chat = [
                    'id_chat' => $idChat,
                    'id_agente' => null,
                    'id_usuario' => $idUsuario,
                    'estado' => 'Abierto',
                ];
            } else {
                if ($idUsuario === null) {
                    $idUsuario = (int)$chat['id_usuario'];
                }

                if ($chat['estado'] === 'Cerrado') {
                    if ($remitente === 'user' && $idUsuario) {
                        $stmtInsertChat = $pdo->prepare("INSERT INTO chats (id_usuario, estado) VALUES (?, 'Abierto')");
                        $stmtInsertChat->execute([$idUsuario]);
                        $idChat = (int)$pdo->lastInsertId();
                        $chat = [
                            'id_chat' => $idChat,
                            'id_agente' => null,
                            'id_usuario' => $idUsuario,
                            'estado' => 'Abierto',
                        ];
                    } else {
                        $pdo->rollBack();
                        respond(['error' => 'El chat está cerrado.'], 409);
                    }
                }
            }

            if ($remitente === 'agent' && $idAgente) {
                if (empty($chat['id_agente'])) {
                    $stmtUpdateAgent = $pdo->prepare('UPDATE chats SET id_agente = ? WHERE id_chat = ?');
                    $stmtUpdateAgent->execute([$idAgente, $idChat]);
                }
                $pdo->prepare("UPDATE chats SET estado = 'Abierto' WHERE id_chat = ?")
                    ->execute([$idChat]);
            }

            $stmtInsert = $pdo->prepare('INSERT INTO mensajes (id_chat, remitente, texto) VALUES (?, ?, ?)');
            $stmtInsert->execute([$idChat, $remitente, $texto]);
            $idMensaje = (int)$pdo->lastInsertId();

            $pdo->commit();

            respond([
                'success' => true,
                'message' => [
                    'id_mensaje' => $idMensaje,
                    'id_chat' => $idChat,
                    'remitente' => $remitente,
                    'texto' => $texto,
                    'fecha_envio' => date(DATE_ATOM),
                ],
            ]);
        }

        if ($action === 'status') {
            $idChat = isset($input['id_chat']) ? (int)$input['id_chat'] : 0;
            $estado = $input['estado'] ?? '';

            if ($idChat <= 0 || !in_array($estado, ['Abierto', 'Pendiente', 'Cerrado'], true)) {
                respond(['error' => 'Datos inválidos para actualizar estado.'], 400);
            }

            $stmt = $pdo->prepare('UPDATE chats SET estado = ? WHERE id_chat = ?');
            $stmt->execute([$estado, $idChat]);

            respond(['success' => true]);
        }

        if ($action === 'delete') {
            $idChat = isset($input['id_chat']) ? (int)$input['id_chat'] : 0;

            if ($idChat <= 0) {
                respond(['error' => 'ID de chat inválido.'], 400);
            }

            $stmt = $pdo->prepare('DELETE FROM chats WHERE id_chat = ?');
            $stmt->execute([$idChat]);

            if ($stmt->rowCount() === 0) {
                respond(['error' => 'Chat no encontrado.'], 404);
            }

            respond(['success' => true]);
        }

        respond(['error' => 'Acción no soportada.'], 400);
    }

    respond(['error' => 'Método no permitido.'], 405);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    respond(['error' => 'Error en base de datos: ' . $e->getMessage()], 500);
}
