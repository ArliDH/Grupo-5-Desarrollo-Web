<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$dbname = 'correo_empresa';
$user = 'root';
$pass = '';

$con = mysqli_connect($host, $user, $pass, $dbname);

if(mysqli_connect_errno()){
    die("Se produjo un error ".mysqli_connect_error());
}
else{
    //echo "Conexión exitosa a la base de datos.";
}
?>