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

    case 'listar_borradores':
        $id_usuario = $_SESSION['usuario']['id'];
        $stmt = $con->prepare("SELECT c.*, u.email as destinatario_email FROM correos c 
                             JOIN usuarios u ON c.destinatario_id = u.id 
                             WHERE c.remitente_id=? AND c.estado='borrador' 
                             AND c.eliminado_rem=0 ORDER BY c.fecha DESC");
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
        $result = $stmt->get_result();
        $correos = [];
        while ($row = $result->fetch_assoc()) {
            $correos[] = $row;
        }
        echo json_encode($correos);
        break;

    case 'enviar_borrador':
        $data = json_decode(file_get_contents("php://input"));
        $id_correo = $data->id;
        
        // Primero obtenemos los datos del borrador
        $stmt = $con->prepare("SELECT * FROM correos WHERE id=? AND estado='borrador'");
        $stmt->bind_param("i", $id_correo);
        $stmt->execute();
        $result = $stmt->get_result();
        $borrador = $result->fetch_assoc();
        
        if ($borrador) {
            // Actualizamos el estado del borrador a enviado
            $stmt = $con->prepare("UPDATE correos SET estado='enviado' WHERE id=?");
            $stmt->bind_param("i", $id_correo);
            $stmt->execute();
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'mensaje' => 'Borrador no encontrado']);
        }
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

    case 'enviar_masivo':
        $data = json_decode(file_get_contents("php://input"));
        $asunto = $data->asunto;
        $mensaje = $data->mensaje;
        $remitente = $_SESSION['usuario']['id'];

        // Obtener todos los usuarios activos
        $stmt = $con->prepare("SELECT id FROM usuarios WHERE estado='activo'");
        $stmt->execute();
        $result = $stmt->get_result();
        $usuarios = [];
        while ($row = $result->fetch_assoc()) {
            $usuarios[] = $row['id'];
        }

        // Enviar correo a cada usuario
        foreach ($usuarios as $destinatario_id) {
            $stmt = $con->prepare("INSERT INTO correos (remitente_id, destinatario_id, asunto, mensaje, estado, fecha) VALUES (?, ?, ?, ?, 'enviado', NOW())");
            $stmt->bind_param("iiss", $remitente, $destinatario_id, $asunto, $mensaje);
            $stmt->execute();
        }

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

    case 'marcar_leido':
        $id_correo = $_GET['id'];
        $stmt = $con->prepare("UPDATE correos SET estado='leido' WHERE id=?");
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
?>```