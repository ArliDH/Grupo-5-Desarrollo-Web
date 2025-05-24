var myModal = document.getElementById("myModal");
        var modalRedactar = document.getElementById("modalRedactar");
        var btnEntrada = document.getElementById("btn-entrada");
        var btnSalida = document.getElementById("btn-salida");
        var btnBorradores = document.getElementById("btn-borradores");
        var btnRedactar = document.getElementById("btn-redactar");
        var btnSalir = document.getElementById("btn-salir");
        var tablaBandeja = document.getElementById("tabla-bandeja");
        var btnGuardar = document.getElementById("btn-guardar");
        var btnEnviar = document.getElementById("btn-enviar");
        var btnCancelarRedactar = document.getElementById("btn-cancelar-redactar");

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
            btnCancelarRedactar.onclick = function() {
                modalRedactar.style.display = "none";
            };
            
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
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    if (!data.loggedIn || data.role !== 'user') {
                        window.location.href = 'login.html';
                    }
                });
        }

        function cerrarSesion() {
            fetch('../../backend/api/auth/logout.php')
                .then(function() {
                    window.location.href = 'login.html';
                });
        }

        function cargarBandejaEntrada() {
            fetch('../../backend/api/correos.php?accion=listar_entrada')
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    mostrarBandeja(data, 'entrada');
                });
        }

        function cargarBandejaSalida() {
            fetch('../../backend/api/correos.php?accion=listar_salida')
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    mostrarBandeja(data, 'salida');
                });
        }

        function cargarBorradores() {
            fetch('../../backend/api/correos.php?accion=listar_borradores')
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    mostrarBorradores(data);
                });
        }

        function mostrarBandeja(correos, tipo) {
            const tbody = tablaBandeja.getElementsByTagName('tbody')[0];
            tbody.innerHTML = '';
            
            correos.forEach(correo => {
                const fila = document.createElement('tr');
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
            });
        }

        function mostrarBorradores(correos) {
            var tbody = tablaBandeja.getElementsByTagName('tbody')[0];
            tbody.innerHTML = '';
            
            for (var i = 0; i < correos.length; i++) {
                var correo = correos[i];
                var fila = document.createElement('tr');
                
                fila.innerHTML = `
                    <td>${correo.destinatario}</td>
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
            fetch('../../backend/api/correos.php?accion=ver&id=${id}')
                .then(function(response) {
                    return response.json();
                })
                .then(function(correo) {
                    document.getElementById("titulo-modal").textContent = correo.asunto;
                    
                    var contenidoModal = document.getElementById("contenido-modal");
                    contenidoModal.innerHTML = `
                        <div class="email-info">
                            <p><strong>De:</strong> ${correo.remitente}</p>
                            <p><strong>Para:</strong> ${correo.destinatario}</p>
                            <p><strong>Fecha:</strong> ${correo.fecha}</p>
                        </div>
                        <hr>
                        <div class="email-content">
                            ${correo.contenido}
                        </div>
                    `;
                    
                    myModal.style.display = "block";
                    
                    if (tipo === 'entrada' && !correo.leido) {
                        marcarComoLeido(id);
                        var filas = tablaBandeja.getElementsByTagName('tr');
                        for (var j = 0; j < filas.length; j++) {
                            var btn = filas[j].querySelector('button[onclick*="verCorreo(' + id + '"]');
                            if (btn) {
                                filas[j].classList.add('correo-leido');
                                break;
                            }
                        }
                    }
                });
        }

        function eliminarCorreo(id, tipo) {
            if (confirm('¿Estás seguro de eliminar este correo?')) {
                fetch('../../backend/api/correos.php?accion=eliminar&id=${id}&tipo=${tipo}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id, tipo: tipo })
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
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

        function enviarBorrador(id) {
            if (confirm('¿Estás seguro de enviar este borrador?')) {
                fetch('../../backend/api/correos.php?accion=enviar_borrador', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id })
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    if (data.success) {
                        cargarBorradores();
                    }
                });
            }
        }

        function editarBorrador(id) {
            fetch('../../backend/api/correos.php?accion=ver&id=${id}')
                .then(function(response) {
                    return response.json();
                })
                .then(function(correo) {
                    document.getElementById("redactar-destinatario").value = correo.destinatario;
                    document.getElementById("redactar-asunto").value = correo.asunto;
                    document.getElementById("redactar-contenido").value = correo.contenido;
                    document.getElementById("redactar-id").value = correo.id;
                    
                    modalRedactar.style.display = "block";
                });
        }

      
        
        function mostrarRedactarModal(correoId = null) {
            document.getElementById('form-correo').reset();
            document.getElementById('correo-id').value = correoId;
            document.getElementById('modal-redactar').style.display = 'block';
            
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
            const data = {
                destinatario_email: document.getElementById('destinatario').value,
                asunto: document.getElementById('asunto').value,
                mensaje: document.getElementById('mensaje').value
            };
        
            fetch('../../backend/api/correos.php?accion=guardar_borrador', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Borrador guardado correctamente');
                    document.getElementById('modal-redactar').style.display = 'none';
                    if (document.querySelector('#btn-borradores').classList.contains('boton-activo')) {
                        cargarBorradores();
                    }
                } else {
                    alert('Error al guardar el borrador: ' + result.mensaje);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al guardar el borrador');
            });
        }
        
        function enviarBorrador(id) {
            if (!confirm('¿Desea enviar este borrador?')) return;
        
            fetch('../../backend/api/correos.php?accion=enviar_borrador', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Borrador enviado correctamente');
                    cargarBorradores();
                } else {
                    alert('Error al enviar el borrador: ' + result.mensaje);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al enviar el borrador');
            });
        }
        
        // Actualizar la función marcarComoLeido
        function marcarComoLeido(id) {
            fetch(`../../backend/api/correos.php?accion=marcar_leido&id=${id}`)
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        const fila = document.querySelector(`tr[data-correo-id="${id}"]`);
                        if (fila) {
                            fila.classList.add('correo-leido');
                        }
                    }
                })
                .catch(error => console.error('Error:', error));
        }

        function enviarCorreo() {
            const data = {
                destinatario_email: document.getElementById('destinatario').value,
                asunto: document.getElementById('asunto').value,
                mensaje: document.getElementById('mensaje').value
            };
        
            fetch('../../backend/api/correos.php?accion=enviar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Correo enviado correctamente');
                    document.getElementById('modal-redactar').style.display = 'none';
                    if (document.querySelector('#btn-salida').classList.contains('boton-activo')) {
                        cargarBandejaSalida();
                    }
                } else {
                    alert('Error al enviar el correo');
                }
            });
        }
        
        function editarBorrador(id) {
            mostrarRedactarModal(id);
        }
        
        function enviarBorrador(id) {
            if (confirm('¿Desea enviar este borrador?')) {
                fetch(`../../backend/api/correos.php?accion=ver&id=${id}`)
                    .then(response => response.json())
                    .then(correo => {
                        const data = {
                            destinatario_email: correo.destinatario_email,
                            asunto: correo.asunto,
                            mensaje: correo.mensaje
                        };
                        return fetch('../../backend/api/correos.php?accion=enviar', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            alert('Borrador enviado correctamente');
                            eliminarCorreo(id, 'borrador');
                            cargarBorradores();
                        } else {
                            alert('Error al enviar el borrador');
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