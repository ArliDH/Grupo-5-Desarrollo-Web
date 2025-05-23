<?php session_start();

include("conexion.php");

// Recibe los datos enviados por POST
$email = $_POST['correo'] ?? '';
$password = $_POST['password'] ?? '';

$sql = "SELECT * FROM usuarios";

$result = $con->query( $sql);

$arreglo=[];

while($row = $result->fetch_assoc()) {
    $arreglo[] = [
        'id' => $row['id'],
        'rol' => $row['rol'],
    ];
    if ($row['email'] == $email && $row['password'] == $password) {
        $respuesta = [
            'status' => 'success',
            'message' => 'Usuario autenticado correctamente',
            'id' => $row['id'],
            'rol' => $row['rol'],
        ];

        echo json_encode($respuesta);

        break;
    }else {
        $respuesta = [
            'status' => 'error',
            'message' => 'Usuario o contraseña incorrectos',
        ];
        echo json_encode($respuesta);
    }
}
?>