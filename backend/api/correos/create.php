<?php
include "../../db/conexion.php";
include "../verificarsesion.php";

$remitente_id = $_SESSION['usuario']['id'];
$destinatario_id = $_POST['destinatario_id'];
$asunto = $_POST['asunto'];
$mensaje = $_POST['mensaje'];
$estado = $_POST['estado']; // 'enviado', 'borrador', etc.
$fecha = $_POST['fecha'];
$eliminado_dest = 0;
$eliminado_rem = 0;

$sql = "INSERT INTO correos (remitente_id, destinatario_id, asunto, mensaje, estado, fecha, eliminado_dest, eliminado_rem) 
VALUES ($remitente_id, $destinatario_id, '$asunto', '$mensaje', '$estado', '$fecha', $eliminado_dest, $eliminado_rem)";
echo $con->query($sql) ? "ok" : "error";
?>
