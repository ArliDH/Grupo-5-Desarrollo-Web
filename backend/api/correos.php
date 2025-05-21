<?php
session_start();
require_once '../db/conexion.php';

$accion = $_GET['accion'] ?? '';

switch ($accion) {
    case 'listar_entrada':
        $id_usuario = $_SESSION['usuario']['id'];
        $stmt = $con->prepare("SELECT * FROM correos WHERE destinatario_id=? AND eliminado_dest=0 ORDER BY fecha DESC");
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
        $result = $stmt->get_result();
        $correos = [];
        while ($row = $result->fetch_assoc()) {
            $correos[] = $row;
        }
        echo json_encode($correos);
        break;

    case 'listar_salida':
        $id_usuario = $_SESSION['usuario']['id'];
        $stmt = $con->prepare("SELECT * FROM correos WHERE remitente_id=? AND eliminado_rem=0 ORDER BY fecha DESC");
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
        $result = $stmt->get_result();
        $correos = [];
        while ($row = $result->fetch_assoc()) {
            $correos[] = $row;
        }
        echo json_encode($correos);
        break;

    case 'enviar':
        $data = json_decode(file_get_contents("php://input"));
        $remitente = $_SESSION['usuario']['id'];
        $destinatario_id = $data->destinatario_id;
        $asunto = $data->asunto;
        $mensaje = $data->mensaje;

        $stmt = $con->prepare("INSERT INTO correos (remitente_id, destinatario_id, asunto, mensaje, estado, fecha) VALUES (?, ?, ?, ?, 'enviado', NOW())");
        $stmt->bind_param("iiss", $remitente, $destinatario_id, $asunto, $mensaje);
        $stmt->execute();
        echo json_encode(['success' => true]);
        break;

    case 'guardar_borrador':
        $data = json_decode(file_get_contents("php://input"));
        $remitente = $_SESSION['usuario']['id'];
        $destinatario_id = $data->destinatario_id;
        $asunto = $data->asunto;
        $mensaje = $data->mensaje;

        $stmt = $con->prepare("INSERT INTO correos (remitente_id, destinatario_id, asunto, mensaje, estado, fecha) VALUES (?, ?, ?, ?, 'borrador', NOW())");
        $stmt->bind_param("iiss", $remitente, $destinatario_id, $asunto, $mensaje);
        $stmt->execute();
        echo json_encode(['success' => true]);
        break;

    case 'eliminar':
        $id_correo = $_GET['id'];
        $tipo = $_GET['tipo']; // 'entrada' o 'salida'
        if ($tipo == 'entrada') {
            $stmt = $con->prepare("UPDATE correos SET eliminado_dest=1 WHERE id=?");
        } else {
            $stmt = $con->prepare("UPDATE correos SET eliminado_rem=1 WHERE id=?");
        }
        $stmt->bind_param("i", $id_correo);
        $stmt->execute();
        echo json_encode(['success' => true]);
        break;

    case 'ver':
        $id_correo = $_GET['id'];
        $stmt = $con->prepare("SELECT * FROM correos WHERE id=?");
        $stmt->bind_param("i", $id_correo);
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode($result->fetch_assoc());
        break;

    default:
        echo json_encode(['success' => false, 'mensaje' => 'Acción no válida']);
        break;
}
?>
