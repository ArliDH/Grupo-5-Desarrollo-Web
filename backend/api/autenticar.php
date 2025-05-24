<?php
session_start();
include("../db/conexion.php");
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? ''; // SIN hash

$stmt = $con->prepare('SELECT email, nombre, rol FROM usuarios WHERE email=? AND password=?');
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

header('Content-Type: application/json');

if ($result && $result->num_rows > 0) {
    $usuario = $result->fetch_assoc();
    $_SESSION['email'] = $usuario['email'];
    $_SESSION['rol'] = $usuario['rol'];
    echo json_encode([
        "status" => "success",
        "message" => "Bienvenido, {$usuario['nombre']}",
        "rol" => $usuario['rol'],
        "email" => $usuario['email']
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Usuario o contraseña incorrectos"
    ]);
}
?>