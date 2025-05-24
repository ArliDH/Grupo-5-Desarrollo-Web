<?php
include "../../db/conexion.php";
include "../verificarsesion.php";
include "../verificarnivel.php";

$id = $_POST['id'];
$sql = "DELETE FROM usuarios WHERE id=$id";
echo $con->query($sql) ? "ok" : "error";
?>
