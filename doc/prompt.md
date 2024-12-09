# Prompts Compartidos durante la Conversación

## Prompt 1
**Descripción:** Crear una Línea del Tiempo Interactiva.

**Objetivo:** Desarrollar una aplicación web que permita visualizar y gestionar eventos en una línea del tiempo interactiva, con funcionalidades CRUD y persistencia en `localStorage`.

**Instrucciones:**
```
- Mostrar una línea del tiempo con eventos que incluyan título, fecha y hora.
- Permitir la creación, edición y eliminación de eventos.
- Cada línea de tiempo puede contener un máximo de 5 eventos; si se superan, se crea automáticamente una nueva línea debajo.
- Los datos deben persistir usando `localStorage`.
- Entregar el código HTML, CSS y JavaScript en un solo archivo.
- Código limpio, comentado, y no más de 200 líneas.
```

**Criterios de Evaluación:**
- Exactitud: Debe funcionar correctamente y cumplir las instrucciones.
- Relevancia: Debe ser intuitiva y fácil de usar.
- Claridad: Código claro y bien comentado.

---

## Prompt 2
**Modificación de Diseño:** Interfaz con línea de eventos ordenados por fechas ascendentes, con un diseño tipo “burbujas”. Al hacer clic en una burbuja, se muestra la descripción del evento.

**Cambios Solicitados:**
```
- Ordenar eventos por fecha y hora ascendente.
- Estilo visual más atractivo: eventos representados como burbujas.
- Al hacer clic sobre la burbuja, se despliega la información del evento (descripción).
```

---

## Prompt 3
**Modificación de Restricción:** Ya no hay un límite de 5 eventos por línea. En cambio, la línea acomodará tantos eventos como sea posible según el ancho de la pantalla. Si ya no caben más, los eventos continuarán en una siguiente línea.

**Cambios Solicitados:**
```
- Los eventos se distribuyen según el ancho disponible.
- Se mantienen las funcionalidades previas: crear, editar, eliminar, y mostrar detalles al hacer clic.
- Persistencia en `localStorage`.
```