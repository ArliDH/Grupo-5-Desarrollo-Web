<?php
include("../../conexion.php");
session_start();

$rol = $_POST['rol'];
$estado = $_POST['estado'];
$id = (int) $_POST['id']; // Asegurar que sea entero

$sql = "UPDATE usuarios SET rol = ?, estado = ? WHERE id = ?";

$stmt = $con->prepare($sql);
$stmt->bind_param("ssi", $rol, $estado, $id);

if ($stmt->execute()) {
    echo "Usuario actualizado correctamente";
} else {
    echo "Error al actualizar el usuario: " . $stmt->error;
}

$stmt->close();
$con->close();
?>
