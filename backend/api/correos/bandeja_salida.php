<?php
include "../../db/conexion.php";
include "../verificarsesion.php";
$id_usuario = $_SESSION['usuario']['id'];
$sql = "SELECT * FROM correos WHERE remitente_id=$id_usuario AND eliminado_rem=0 ORDER BY fecha DESC";
$res = $con->query($sql);
$datos = [];
while ($row = $res->fetch_assoc()) $datos[] = $row;
echo json_encode($datos);
?>
