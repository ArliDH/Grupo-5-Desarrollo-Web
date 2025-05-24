<?php
include "../../db/conexion.php";
include "../verificarsesion.php";

$id = $_POST['id'];
$user_id = $_SESSION['usuario']['id'];
// Buscar si el usuario es remitente o destinatario
$res = $con->query("SELECT remitente_id, destinatario_id FROM correos WHERE id=$id");
if ($row = $res->fetch_assoc()) {
    if ($row['remitente_id'] == $user_id) {
        $sql = "UPDATE correos SET eliminado_rem=1 WHERE id=$id";
    } elseif ($row['destinatario_id'] == $user_id) {
        $sql = "UPDATE correos SET eliminado_dest=1 WHERE id=$id";
    } else {
        echo "sin_permiso";
        exit;
    }
    echo $con->query($sql) ? "ok" : "error";
} else {
    echo "no_encontrado";
}
?>
