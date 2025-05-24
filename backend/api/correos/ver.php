<?php
include "../../db/conexion.php";
include "../verificarsesion.php";
$id = $_POST['id'];
$user_id = $_SESSION['usuario']['id'];
$sql = "SELECT * FROM correos WHERE id=$id AND (remitente_id=$user_id OR destinatario_id=$user_id)";
$res = $con->query($sql);
$row = $res->fetch_assoc();
echo json_encode($row ?: []);
?>
