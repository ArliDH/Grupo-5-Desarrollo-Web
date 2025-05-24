<?php
include "../../db/conexion.php";
include "../verificarsesion.php";

$id = $_POST['id'];
$remitente_id = $_SESSION['usuario']['id'];
$asunto = $_POST['asunto'];
$mensaje = $_POST['mensaje'];
$estado = $_POST['estado'];
$fecha = $_POST['fecha'];

$sql = "UPDATE correos SET asunto='$asunto', mensaje='$mensaje', estado='$estado', fecha='$fecha' WHERE id=$id AND remitente_id=$remitente_id";
echo $con->query($sql) ? "ok" : "error";
?>
