<?php
include "../../db/conexion.php";
include "../verificarsesion.php";
include "../verificarnivel.php";

$sql = "SELECT * FROM usuarios";
$res = $con->query($sql);
$datos = [];
while ($row = $res->fetch_assoc()) $datos[] = $row;
echo json_encode($datos);
?>
