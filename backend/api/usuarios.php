<?php
session_start();
require_once '../db/conexion.php';

$accion = $_GET['accion'] ?? '';
switch ($accion) {
    case 'listar':
        $stmt = $pdo->query("SELECT id, email, rol, estado FROM usuarios");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'crear':
        $data = json_decode(file_get_contents("php://input"));
        $stmt = $pdo->prepare("INSERT INTO usuarios (email, password, rol, estado) VALUES (?, ?, ?, 'activo')");
        $stmt->execute([$data->email, $data->password, $data->rol]);
        echo json_encode(['success' => true]);
        break;

    case 'suspender':
        $id = $_GET['id'] ?? '';
        $stmt = $pdo->prepare("UPDATE usuarios SET estado='suspendido' WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    case 'habilitar':
        $id = $_GET['id'] ?? '';
        $stmt = $pdo->prepare("UPDATE usuarios SET estado='activo' WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;
        
    // ...otros casos para editar, eliminar, etc.

    default:
        echo json_encode(['success' => false, 'mensaje' => 'Acción no válida']);
        break;
}
?>
