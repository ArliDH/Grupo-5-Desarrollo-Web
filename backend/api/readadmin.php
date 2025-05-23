<?php
include("../../conexion.php");

$sql = "SELECT * FROM usuarios";
$result = $con->query($sql);

$arreglo = [];
while ($row = mysqli_fetch_assoc($result)) {
    $arreglo[] = [
        'id' => $row['id'],
        'email' => $row['email'],
        'estado' => $row['estado'],
        'rol' => $row['rol']
    ];
}

echo json_encode($arreglo);
?>
