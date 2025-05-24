<?php
include "../../db/conexion.php";
include "../verificarsesion.php";
if ($_SESSION['usuario']['rol'] == 'admin') {
    $sql = "SELECT * FROM correos";
} else {
    $id = $_SESSION['usuario']['id'];
    $sql = "SELECT * FROM correos WHERE remitente_id=$id OR destinatario_id=$id";
}
$res = $con->query($sql);
$datos = [];
while ($row = $res->fetch_assoc()) $datos[] = $row;
echo json_encode($datos);
?>
