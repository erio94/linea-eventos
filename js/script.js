let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

function guardar() {
    localStorage.setItem('eventos', JSON.stringify(eventos));
}

function sortEventos() {
    eventos.sort((a, b) => {
        return new Date(a.fecha + " " + a.hora) - new Date(b.fecha + " " + b.hora);
    });
}
function render() {
    const c = document.getElementById('container');
    c.innerHTML = '';
    sortEventos();

    // Determinar el número de eventos por línea según el ancho de la ventana
    let eventsPerLine;
    const width = window.innerWidth;

    if (width <= 600) { // Móvil
        eventsPerLine = 2;
    } else if (width <= 1024) { // Tablet
        eventsPerLine = 3;
    } else if (width <= 1440) { // Portátil
        eventsPerLine = 4;
    } else { // Monitor
        eventsPerLine = 5;
    }

    // Dividir los eventos en subconjuntos según eventsPerLine
    for (let i = 0; i < eventos.length; i += eventsPerLine) {
        const slice = eventos.slice(i, i + eventsPerLine);
        const line = document.createElement('div');
        line.className = 'timeline';

        slice.forEach((ev, idx) => {
            const e = document.createElement('div');
            e.className = 'event';
            e.innerHTML = `
                <div class="bubble" onclick="toggleDesc(this)">${i + idx + 1}</div>
                <div class="event-details">
                    <h3>${ev.titulo}</h3>
                    <p><strong>${ev.fecha} ${ev.hora}</strong></p>
                    <p>${ev.desc || ''}</p>
                    <div class="actions">
                        <button class="edit" onclick="editar(${i + idx})">Editar</button>
                        <button class="delete" onclick="eliminar(${i + idx})">Eliminar</button>
                    </div>
                </div>`;
            line.appendChild(e);
        });

        c.appendChild(line);
    }
}

// Escuchar cambios en el tamaño de la ventana para redibujar dinámicamente
window.addEventListener('resize', () => {
    render(); // Vuelve a renderizar cuando se cambie el tamaño de la ventana
});

function sortEventos() {
    eventos.sort((a, b) => {
        return new Date(a.fecha + " " + a.hora) - new Date(b.fecha + " " + b.hora);
    });
}

function toggleDesc(b) {
    const d = b.parentNode.querySelector('.event-details');
    d.style.display = d.style.display === 'block' ? 'none' : 'block';
}


function toggleDesc(b) {
    const d = b.parentNode.querySelector('.event-details');
    d.style.display = d.style.display === 'block' ? 'none' : 'block';
}

function eliminar(idx) {
    if (confirm('¿Eliminar este evento?')) {
        eventos.splice(idx, 1);
        guardar();
        render();
    }
}

function editar(idx) {
    const ed = document.querySelectorAll('.event-details')[idx];
    const ev = eventos[idx];
    const f = document.createElement('div');
    f.className = 'edit-form';
    f.innerHTML = `
        <input id="etitulo" value="${ev.titulo}">
        <input type="date" id="efecha" value="${ev.fecha}">
        <input type="time" id="ehora" value="${ev.hora}">
        <textarea id="edesc">${ev.desc || ''}</textarea>
        <button onclick="guardarEdicion(${idx})">Guardar</button>
        <button onclick="this.parentNode.remove()">Cancelar</button>`;
    ed.appendChild(f);
}

function guardarEdicion(idx) {
    const et = document.getElementById('etitulo').value;
    const ef = document.getElementById('efecha').value;
    const eh = document.getElementById('ehora').value;
    const ed = document.getElementById('edesc').value;
    eventos[idx] = { titulo: et, fecha: ef, hora: eh, desc: ed };
    guardar();
    render();
}

document.getElementById('createForm').addEventListener('submit', e => {
    e.preventDefault();
    const t = document.getElementById('titulo').value;
    const f = document.getElementById('fecha').value;
    const h = document.getElementById('hora').value;
    const d = document.getElementById('desc').value;
    eventos.push({ titulo: t, fecha: f, hora: h, desc: d });
    guardar();
    render();
    e.target.reset();
});

// Exportar JSON
document.getElementById('exportBtn').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(eventos));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "eventos.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
});

// Importar JSON
document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const importedEvents = JSON.parse(evt.target.result);
            if (Array.isArray(importedEvents)) {
                eventos = importedEvents;
                guardar();
                render();
            } else {
                alert('El archivo JSON no contiene un arreglo de eventos válido.');
            }
        } catch (err) {
            alert('Error al leer el archivo JSON.');
        }
    };
    reader.readAsText(file);
});


// Mostrar el modal cuando se presiona el botón "Borrar Todos"
document.getElementById('clearBtn').addEventListener('click', () => {
    const modal = document.getElementById('clearModal');
    modal.style.display = 'flex'; // Mostrar el modal
});

// Confirmar la eliminación de todos los eventos
document.getElementById('confirmClear').addEventListener('click', () => {
    eventos = []; // Vaciar el array de eventos
    guardar(); // Guardar el cambio en localStorage
    render(); // Volver a renderizar la línea del tiempo
    document.getElementById('clearModal').style.display = 'none'; // Ocultar el modal
});

// Cancelar la acción y cerrar el modal
document.getElementById('cancelClear').addEventListener('click', () => {
    const modal = document.getElementById('clearModal');
    modal.style.display = 'none'; // Ocultar el modal
});


render();
