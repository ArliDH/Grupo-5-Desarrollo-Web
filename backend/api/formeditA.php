<?php
include("../../conexion.php");

$id = $_POST['id'];


$sql = "SELECT * FROM usuarios WHERE id = $id";
$result = $con->query($sql);
$row = mysqli_fetch_assoc($result);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../../ajax.js"></script>
</head>
<body>
    <form id="formAdmin" action="javascript:editar.php" method="post">
        <label for="Rol">Rol</label>
        <select name="Rol" id="Rol">
            <option value="admin" <?php if($row['rol'] == 'admin'){ echo 'selected'; } ?>>Admin</option>
            <option value="usuario" <?php if($row['rol'] == 'usuario'){ echo 'selected'; } ?>>Usuario</option>
        </select>
        <label for="Estado">Estado</label>
        <?php if($row['estado'] == 'activo'){ ?>
        <input type="radio" name="Estado" id="EstadoA" value="activo" checked>Activo
        <input type="radio" name="Estado" id="EstadoS" value="suspendido">Suspendido
        <?php }else{?>
        <input type="radio" name="Estado" id="EstadoA" value="activo">Activo
        <input type="radio" name="Estado" id="EstadoS" value="suspendido" checked>Suspendido
        <?php }?>
        <input type="hidden" name="id" id="id" value="<?php echo $row['id']; ?>">
        <input type="submit" value="Actualizar">
    </form>
</body>