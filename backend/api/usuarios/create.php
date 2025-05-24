<?php
include "../../db/conexion.php";
include "../verificarsesion.php";
include "../verificarnivel.php";

$email = $_POST['email'];
$password = $_POST['password'];
$rol = $_POST['rol'];
$estado = $_POST['estado'];
$sql = "INSERT INTO usuarios (email, password, rol, estado) VALUES ('$email', '$password', '$rol', '$estado')";
echo $con->query($sql) ? "ok" : "error";
?>
