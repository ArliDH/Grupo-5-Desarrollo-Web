<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    echo "sin_sesion";
    exit;
}
?>
