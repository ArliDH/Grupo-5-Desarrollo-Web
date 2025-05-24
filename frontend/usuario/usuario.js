var myModal = document.getElementById("modal-ver-correo");
var modalRedactar = document.getElementById("modal-redactar");
var btnEntrada = document.getElementById("btn-entrada");
var btnSalida = document.getElementById("btn-salida");
var btnBorradores = document.getElementById("btn-borradores");
var btnRedactar = document.getElementById("btn-redactar");
var btnSalir = document.getElementById("btn-salir");
var tablaBandeja = document.getElementById("tabla-bandeja");

var spansCerrar = document.getElementsByClassName("close");
for (var i = 0; i < spansCerrar.length; i++) {
    spansCerrar[i].onclick = function() {
        myModal.style.display = "none";
        modalRedactar.style.display = "none";
    }
}

window.onload = function() {
    verificarAutenticacion();
    
    btnEntrada.onclick = function() {
        cargarBandejaEntrada();
        actualizarBotones('entrada');
    };
    
    btnSalida.onclick = function() {
        cargarBandejaSalida();
        actualizarBotones('salida');
    };
    
    btnBorradores.onclick = function() {
        cargarBorradores();
        actualizarBotones('borradores');
    };
    
    btnRedactar.onclick = mostrarRedactarModal;
    btnSalir.onclick = cerrarSesion;
    
    cargarBandejaEntrada();
    actualizarBotones('entrada');
};

function actualizarBotones(bandejaActiva) {
    btnEntrada.className = 'boton boton-inactivo';
    btnSalida.className = 'boton boton-inactivo';
    btnBorradores.className = 'boton boton-inactivo';
    
    if (bandejaActiva === 'entrada') {
        btnEntrada.className = 'boton boton-activo';
    } else if (bandejaActiva === 'salida') {
        btnSalida.className = 'boton boton-activo';
    } else if (bandejaActiva === 'borradores') {
        btnBorradores.className = 'boton boton-activo';
    }
}

function verificarAutenticacion() {
    fetch('../../backend/api/auth/check.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn || data.role !== 'user') {
                window.location.href = 'login.html';
            }
        });
}

function cerrarSesion() {
    fetch('../../backend/api/auth/logout.php')
        .then(() => {
            window.location.href = 'login.html';
        });
}

function cargarBandejaEntrada() {
    fetch('../../backend/api/correos.php?accion=listar_entrada')
        .then(response => response.json())
        .then(data => {
            mostrarBandeja(data, 'entrada');
        });
}

function cargarBandejaSalida() {
    fetch('../../backend/api/correos.php?accion=listar_salida')
        .then(response => response.json())
        .then(data => {
            mostrarBandeja(data, 'salida');
        });
}

function cargarBorradores() {
    fetch('../../backend/api/correos.php?accion=listar_borradores')
        .then(response => response.json())
        .then(data => {
            mostrarBorradores(data);
        });
}

function mostrarBandeja(correos, tipo) {
    var tbody = tablaBandeja.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    
    for (var i = 0; i < correos.length; i++) {
        var correo = correos[i];
        var fila = document.createElement('tr');
        fila.setAttribute('data-correo-id', correo.id);
        
        if (tipo === 'entrada' && correo.estado === 'leido') {
            fila.classList.add('correo-leido');
        }
        
        fila.innerHTML = `
            <td>${tipo === 'entrada' ? correo.remitente_email : correo.destinatario_email}</td>
            <td>${correo.asunto}</td>
            <td>${correo.estado}</td>
            <td>
                <button class="boton" onclick="verCorreo(${correo.id}, '${tipo}')">Ver</button>
                <button class="boton boton-peligro" onclick="eliminarCorreo(${correo.id}, '${tipo}')">Eliminar</button>
            </td>
        `;
        
        tbody.appendChild(fila);
    }
}

function mostrarBorradores(correos) {
    var tbody = tablaBandeja.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    
    for (var i = 0; i < correos.length; i++) {
        var correo = correos[i];
        var fila = document.createElement('tr');
        fila.setAttribute('data-correo-id', correo.id);
        
        fila.innerHTML = `
            <td>${correo.destinatario_email}</td>
            <td>${correo.asunto}</td>
            <td>Borrador</td>
            <td>
                <button class="boton" onclick="editarBorrador(${correo.id})">Editar</button>
                <button class="boton boton-accion" onclick="enviarBorrador(${correo.id})">Enviar</button>
                <button class="boton boton-peligro" onclick="eliminarCorreo(${correo.id}, 'borrador')">Eliminar</button>
            </td>
        `;
        
        tbody.appendChild(fila);
    }
}

function verCorreo(id, tipo) {
    fetch(`../../backend/api/correos.php?accion=ver&id=${id}`)
        .then(response => response.json())
        .then(correo => {
            document.getElementById("modal-titulo").textContent = correo.asunto;
            
            var contenidoModal = document.getElementById("modal-contenido");
            contenidoModal.innerHTML = `
                <div class="email-info">
                    <p><strong>De:</strong> ${correo.remitente_email}</p>
                    <p><strong>Para:</strong> ${correo.destinatario_email}</p>
                    <p><strong>Fecha:</strong> ${correo.fecha}</p>
                </div>
                <hr>
                <div class="email-content">
                    ${correo.mensaje}
                </div>
            `;
            
            myModal.style.display = "block";
            
            if (tipo === 'entrada' && correo.estado !== 'leido') {
                marcarComoLeido(id);
                var fila = document.querySelector(`tr[data-correo-id="${id}"]`);
                if (fila) {
                    fila.classList.add('correo-leido');
                }
            }
        });
}

function eliminarCorreo(id, tipo) {
    if (confirm('¿Estás seguro de eliminar este correo?')) {
        fetch(`../../backend/api/correos.php?accion=eliminar&id=${id}&tipo=${tipo}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (btnEntrada.className.includes('boton-activo')) {
                        cargarBandejaEntrada();
                    } else if (btnSalida.className.includes('boton-activo')) {
                        cargarBandejaSalida();
                    } else {
                        cargarBorradores();
                    }
                }
            });
    }
}

function mostrarRedactarModal(correoId) {
    document.getElementById('form-correo').reset();
    document.getElementById('correo-id').value = correoId || '';
    modalRedactar.style.display = 'block';
    
    if (correoId) {
        fetch(`../../backend/api/correos.php?accion=ver&id=${correoId}`)
            .then(response => response.json())
            .then(correo => {
                document.getElementById('destinatario').value = correo.destinatario_email;
                document.getElementById('asunto').value = correo.asunto;
                document.getElementById('mensaje').value = correo.mensaje;
            });
    }
}

function guardarBorrador() {
    var formulario = document.getElementById('form-correo');
    var datos = new FormData(formulario);
    
    fetch('../../backend/api/correos.php?accion=guardar_borrador', {
        method: 'POST',
        body: datos
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Borrador guardado correctamente');
            modalRedactar.style.display = 'none';
            if (btnBorradores.className.includes('boton-activo')) {
                cargarBorradores();
            }
        } else {
            alert('Error al guardar el borrador: ' + result.mensaje);
        }
    });
}

function enviarCorreo() {
    var formulario = document.getElementById('form-correo');
    var datos = new FormData(formulario);
    
    fetch('../../backend/api/correos.php?accion=enviar', {
        method: 'POST',
        body: datos
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Correo enviado correctamente');
            modalRedactar.style.display = 'none';
            if (btnSalida.className.includes('boton-activo')) {
                cargarBandejaSalida();
            }
        } else {
            alert('Error al enviar el correo: ' + result.mensaje);
        }
    });
}

function marcarComoLeido(id) {
    fetch(`../../backend/api/correos.php?accion=marcar_leido&id=${id}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                var fila = document.querySelector(`tr[data-correo-id="${id}"]`);
                if (fila) {
                    fila.classList.add('correo-leido');
                }
            }
        });
}

function editarBorrador(id) {
    mostrarRedactarModal(id);
}

function enviarBorrador(id) {
    if (confirm('¿Desea enviar este borrador?')) {
        fetch(`../../backend/api/correos.php?accion=enviar_borrador&id=${id}`)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Borrador enviado correctamente');
                    cargarBorradores();
                } else {
                    alert('Error al enviar el borrador: ' + result.mensaje);
                }
            });
    }
}

window.onclick = function(event) {
    if (event.target == myModal) {
        myModal.style.display = "none";
    }
    if (event.target == modalRedactar) {
        modalRedactar.style.display = "none";
    }
};