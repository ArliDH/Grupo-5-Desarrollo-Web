<?php
session_start();
require_once '../db/conexion.php';

$accion = $_GET['accion'] ?? '';

switch ($accion) {
    case 'listar_entrada':
        $id_usuario = $_SESSION['usuario']['id'];
        $stmt = $pdo->prepare("SELECT * FROM correos WHERE destinatario_id=? AND eliminado_dest=0 ORDER BY fecha DESC");
        $stmt->execute([$id_usuario]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'listar_salida':
        $id_usuario = $_SESSION['usuario']['id'];
        $stmt = $pdo->prepare("SELECT * FROM correos WHERE remitente_id=? AND eliminado_rem=0 ORDER BY fecha DESC");
        $stmt->execute([$id_usuario]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'enviar':
        $data = json_decode(file_get_contents("php://input"));
        $remitente = $_SESSION['usuario']['id'];
        $stmt = $pdo->prepare("INSERT INTO correos (remitente_id, destinatario_id, asunto, mensaje, estado, fecha) VALUES (?, ?, ?, ?, 'enviado', NOW())");
        $stmt->execute([$remitente, $data->destinatario_id, $data->asunto, $data->mensaje]);
        echo json_encode(['success' => true]);
        break;

    case 'guardar_borrador':
        $data = json_decode(file_get_contents("php://input"));
        $remitente = $_SESSION['usuario']['id'];
        $stmt = $pdo->prepare("INSERT INTO correos (remitente_id, destinatario_id, asunto, mensaje, estado, fecha) VALUES (?, ?, ?, ?, 'borrador', NOW())");
        $stmt->execute([$remitente, $data->destinatario_id, $data->asunto, $data->mensaje]);
        echo json_encode(['success' => true]);
        break;

    case 'eliminar':
        $id_correo = $_GET['id'];
        $tipo = $_GET['tipo']; // 'entrada' o 'salida'
        if ($tipo == 'entrada') {
            $stmt = $pdo->prepare("UPDATE correos SET eliminado_dest=1 WHERE id=?");
        } else {
            $stmt = $pdo->prepare("UPDATE correos SET eliminado_rem=1 WHERE id=?");
        }
        $stmt->execute([$id_correo]);
        echo json_encode(['success' => true]);
        break;

    case 'ver':
        $id_correo = $_GET['id'];
        $stmt = $pdo->prepare("SELECT * FROM correos WHERE id=?");
        $stmt->execute([$id_correo]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        break;

    // ...otros casos según lo que pida el frontend

    default:
        echo json_encode(['success' => false, 'mensaje' => 'Acción no válida']);
        break;
}
?>
