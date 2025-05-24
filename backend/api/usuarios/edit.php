<?php
include "../../db/conexion.php";
include "../verificarsesion.php";
include "../verificarnivel.php";

$id = $_POST['id'];
$email = $_POST['email'];
$password = $_POST['password'];
$rol = $_POST['rol'];
$estado = $_POST['estado'];
$sql = "UPDATE usuarios SET email='$email', password='$password', rol='$rol', estado='$estado' WHERE id=$id";
echo $con->query($sql) ? "ok" : "error";
?>
