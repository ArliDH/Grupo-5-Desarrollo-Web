<?php
session_start();
require_once '../db/conexion.php';

// Recibe los datos del login por POST (JSON)
$data = json_decode(file_get_contents("php://input"));

$email = $data->email ?? '';
$password = $data->password ?? '';

if ($email && $password) {
    $stmt = $pdo->prepare("SELECT id, email, rol FROM usuarios WHERE email=? AND password=? AND estado='activo'");
    $stmt->execute([$email, $password]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        $_SESSION['usuario'] = $usuario;
        echo json_encode(['success' => true, 'rol' => $usuario['rol']]);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Credenciales incorrectas']);
    }
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
}
?>