<?php
if ($_SESSION['usuario']['rol'] != 'admin') {
    echo "sin_permiso";
    exit;
}
?>
