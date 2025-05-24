document.getElementById('formlogin').onsubmit = function(e){
    e.preventDefault();
    var correo = document.getElementById('correo').value;
    var password = document.getElementById('password').value;

    var datos = new FormData();
    datos.append('email', correo);
    datos.append('password', password);

    fetch('backend/api/autenticar.php', {
        method: 'POST',
        body: datos
    })
    .then(res => res.json())
    .then(resp => {
        if(resp.status === 'success'){
            if(resp.nivel === 'admin'){
                window.location = 'frontend/admin/index.html';
            } else {
                window.location = 'frontend/usuario/index.html';
            }
        } else {
            document.getElementById('mensaje').innerText = resp.message;
        }
    });
};


// function cargarPagina(abrir){
//     const url = abrir;
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", url, true);
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             document.getElementById("body").innerHTML= xhr.responseText;
//             document.getElementById("TablaAdmin").addEventListener("click", function() {
//                 listaAdmin();
//             });
//         }
//     };
//     xhr.send();
// }

// function cargarContenido(abrir) {
//     const url = abrir;
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", url, true);
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             document.getElementById("contenido_2").innerHTML = xhr.responseText;
//         }
//     };
//     xhr.send();
// }

// function verificarsesion() {
//     const form = document.getElementById('formlogin');
//     const formData = new FormData(form);

//     // Mostrar todos los datos del formulario en consola
//     //for (const [name, value] of formData.entries()) {
//     //console.log(name + ': ' + value);
//     //}

//     fetch('autenticar.php', {
//         method: 'POST',
//         body: formData
//     })
//         .then(response => response.json())
//         .then(datos => {
//             // Aquí procesas el JSON ya parseado
//             if (datos.status === 'success') {
//                 alert(datos.message);
//                 var rol = datos['rol'];

//                 console.log('Rol del usuario:', rol);
//                 if (rol === 'admin') {
//                     cargarPagina('backend/api/admin.html');
//                 } else {
//                     cargarContenido('../backend/api/usuario.php');
//                 };
//             } else {
//                 alert(datos.message);
//             }
//         })
//         .catch(error => console.error('Error:', error));
// }

// //pagina del administrador

// function listaAdmin(){
//     fetch('backend/api/readadmin.php')
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById("contenido_A1").innerHTML = renderizarTablaAdmin(data);
//         })
//         .catch(error => {
//             console.error('Error fetching the data:', error);
//         });
// }

// function renderizarTablaAdmin(data) {
//     let html = `<table> 
//     <thead>
//         <tr>
//             <th>Email</th>
//             <th>Rol</th>
//             <th>Estado Actual</th>
//             <th>Operaciones</th>
//         </tr>
//     </thead>
//     <tbody>`;

//     for(let i = 0; i < data.length; i++){ 
//         html += `<tr>
//             <td>${data[i].email}</td>
//             <td>${data[i].rol}</td>
//             <td>${data[i].estado}</td>
//             <td>
//                 <a href="#" onclick="updateAdmin(${data[i].id})">Editar</a>
//                 <a href="#" onclick="cargarContenidoA('deleteadmin.php?id=${data[i].id}')">Eliminar</a>
//             </td>
//         </tr>`;
//     }

//     html += `</tbody>
//     </table>`;
//     return html;
// }

// function updateAdmin(id) {
   
//     const formData = new FormData();
//     formData.append('id', id); 

//     console.log("Id del admin a editar:", id);

//     fetch(`backend/api/formeditA.php?id=${id}`, {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => response.text()) 
//     .then(html => {
    
//         abrirModal(html);  
//     })
//     .catch(error => console.error('Error:', error));
// }

// function abrirModal(contenidoHtml) {
//     const modal = document.getElementById('modal');
//     const modalHeader = modal.querySelector('.modal-header');
//     modalHeader.innerHTML = contenidoHtml;
//     modal.style.display = 'flex';
// }
