let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

function guardar() {
    localStorage.setItem('eventos', JSON.stringify(eventos));
}

function sortEventos() {
    eventos.sort((a, b) => {
        return new Date(a.fecha + " " + a.hora) - new Date(b.fecha + " " + b.hora);
    });
}

// Determinar el número de eventos por línea al cargar (no en cada resize)
let eventsPerLine = determinarEventsPerLine();

function determinarEventsPerLine() {
    const width = window.innerWidth;
    if (width <= 600) { 
        return 1; 
    } else if (width <= 1024) { 
        return 2; 
    } else if (width <= 1440) { 
        return 3; 
    } else { 
        return 4; 
    }
}

function render() {
    // Guardar posición actual de scroll
    const currentScroll = window.scrollY;

    const c = document.getElementById('container');
    c.innerHTML = '';
    sortEventos();

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

    // Restaurar la posición de scroll luego de re-renderizar
    window.scrollTo(0, currentScroll);
}

function toggleDesc(b) {
    const d = b.parentNode.querySelector('.event-details');
    d.style.display = (d.style.display === 'block') ? 'none' : 'block';
    // Opcionalmente, podrías también mantener el scroll tras abrir/cerrar detalles,
    // pero generalmente aquí no es necesario ya que no se re-renderiza todo.
}

function eliminar(idx) {
    if (confirm('¿Eliminar este evento?')) {
        // Guardar scroll antes de modificar
        const currentScroll = window.scrollY;
        eventos.splice(idx, 1);
        guardar();
        render();
        window.scrollTo(0, currentScroll);
    }
}

function editar(idx) {
    const ed = document.querySelectorAll('.event-details')[idx];
    const existingForm = ed.querySelector('.edit-form');
    if (existingForm) return;

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
    const currentScroll = window.scrollY;
    const et = document.getElementById('etitulo').value;
    const ef = document.getElementById('efecha').value;
    const eh = document.getElementById('ehora').value;
    const ed = document.getElementById('edesc').value;
    eventos[idx] = { titulo: et, fecha: ef, hora: eh, desc: ed };
    guardar();
    render();
    window.scrollTo(0, currentScroll);
}

document.getElementById('createForm').addEventListener('submit', e => {
    e.preventDefault();
    const t = document.getElementById('titulo').value;
    const f = document.getElementById('fecha').value;
    const h = document.getElementById('hora').value;
    const d = document.getElementById('desc').value;

    if (t && f && h) {
        const currentScroll = window.scrollY;
        eventos.push({ titulo: t, fecha: f, hora: h, desc: d });
        guardar();
        render();
        window.scrollTo(0, currentScroll);
        e.target.reset();
    } else {
        alert("Por favor, completa todos los campos obligatorios.");
    }
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
                const currentScroll = window.scrollY;
                eventos = importedEvents;
                guardar();
                render();
                window.scrollTo(0, currentScroll);
            } else {
                alert('El archivo JSON no contiene un arreglo de eventos válido.');
            }
        } catch (err) {
            alert('Error al leer el archivo JSON.');
        }
    };
    reader.readAsText(file);
});

// Modal Borrar Todos
document.getElementById('clearBtn').addEventListener('click', () => {
    const modal = document.getElementById('clearModal');
    modal.classList.remove('oculto');
    document.body.style.overflow = 'hidden';
});

document.getElementById('cancelClear').addEventListener('click', () => {
    const modal = document.getElementById('clearModal');
    modal.classList.add('oculto');
    document.body.style.overflow = 'auto';
});

document.getElementById('confirmClear').addEventListener('click', () => {
    const currentScroll = window.scrollY;
    eventos = [];
    guardar();
    render();
    window.scrollTo(0, currentScroll);
    const modal = document.getElementById('clearModal');
    modal.classList.add('oculto');
    document.body.style.overflow = 'auto';
});

document.addEventListener('DOMContentLoaded', () => {
    render();
});
