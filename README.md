Fundas de iPhone

Descripción

Este proyecto consiste en una tienda online de fundas para iPhone, desarrollada con HTML, CSS y JavaScript.
Permite visualizar un catálogo de fundas, buscar productos por modelo, agregarlos al carrito y realizar compras completando los datos del cliente.
El proyecto utiliza LocalStorage para almacenar el carrito y las compras realizadas, manteniendo la información al recargar la página.

Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Toastify.js
- LocalStorage
- Fetch API
- JSON

Funcionalidades

Catálogo
- Visualización de fundas disponibles.
- Información de modelo, color, precio, imagen y stock.
- Búsqueda de productos por modelo.
- Carga de productos desde un archivo JSON.

Carrito de compras
- Agregar productos al carrito.
- Aumentar y disminuir cantidades.
- Eliminar productos al llegar a cantidad cero.
- Vaciar el carrito.
- Cálculo automático del total.

Compras
- Formulario para ingresar los datos del cliente.
- Validación de campos obligatorios.
- Validación básica del correo electrónico.
- Confirmación de compra.
- Visualización del resumen de compra.

Control de stock
- Descuento automático del stock al confirmar una compra.
- Actualización del catálogo después de cada compra.
- Recuperación del stock original al eliminar el historial de compras.

Almacenamiento
Se utiliza LocalStorage para guardar:
- El carrito de compras.
- El historial de compras.
