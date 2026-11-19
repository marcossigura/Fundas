class Pedido {
   constructor(cliente, productos, total){
      this.cliente = cliente;
      this.productos = productos;
      this.total = total;
   }
}

const url = "./db/data.json";

let catalogo = [];

const mensaje = document.getElementById("mensaje");
const aviso = document.getElementById("aviso");
const buscador = document.getElementById("buscador");
const contenedorCatalogo = document.querySelector("#contenedor-catalogo");
const contenedorCarrito = document.querySelector("#contenedor-carrito");
const totalCarrito = document.getElementById("total-carrito");
const btnFinalizar = document.getElementById("btn-finalizar");
const btnVaciar = document.getElementById("btn-vaciar");
const btnConfirmar = document.getElementById("btn-confirmar");
const seccionCheckout = document.getElementById("seccion-checkout");
const seccionResumen = document.getElementById("seccion-resumen");
const contenedorResumen = document.getElementById("contenedor-resumen");

const camposCheckout = document.querySelectorAll(".campo-checkout");
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const inputEmail = document.getElementById("email");
const inputTelefono = document.getElementById("telefono");
const inputDireccion = document.getElementById("direccion");
const inputCiudad = document.getElementById("ciudad");

function notificar(texto, tipo){
   Toastify({
      text: texto,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      style: {
         background: tipo === "exito"
         ? "linear-gradient(to right, #00b09b, #96c93d)"
         : "linear-gradient(to right, #e05252, #a32121)"
      }
   }).showToast();
}

function calcularTotal(){
   let total = 0;
   carrito.forEach(({ precio, cantidad }) => {
      total = total + precio * cantidad;
   });
   return total;
}

function descontarStock(productos){
   productos.forEach(({ id, cantidad }) => {
      const fundaCatalogo = catalogo.find(funda => funda.id === id);
      fundaCatalogo.stock = fundaCatalogo.stock - cantidad;
   });
}

function renderizarCatalogo(listaFundas){
   contenedorCatalogo.innerHTML = "";

   listaFundas.forEach(funda => {
      const { modelo, color, precio, stock, imagen } = funda;

      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta";
      tarjeta.innerHTML = `
         <img src="${imagen}" alt="Funda ${modelo} ${color}">
         <h3>${modelo}</h3>
         <p>${color}</p>
         <p>$${precio}</p>
         <p>${stock > 0 ? "Stock: " + stock : "Sin stock"}</p>
         <button class="btn btn-comprar">Comprar</button>
      `;

      const botonComprar = tarjeta.querySelector(".btn-comprar");
      botonComprar.addEventListener("click", () => agregarAlCarrito(funda));

      contenedorCatalogo.appendChild(tarjeta);
   });
}

function renderizarCarrito(){
   contenedorCarrito.innerHTML = "";

   if(carrito.length === 0){
      contenedorCarrito.innerHTML = "<p>El carrito está vacío</p>";
   }

   carrito.forEach((itemCarrito, posicion) => {
      const { modelo, color, precio, cantidad } = itemCarrito;

      const filaCarrito = document.createElement("div");
      filaCarrito.className = "pedido";
      filaCarrito.innerHTML = `
         <p>${modelo} (${color}) - $${precio} x ${cantidad} = $${precio * cantidad}</p>
         <div class="controles">
            <button class="btn btn-restar">-</button>
            <span>${cantidad}</span>
            <button class="btn btn-sumar">+</button>
         </div>
      `;

      const botonRestar = filaCarrito.querySelector(".btn-restar");
      botonRestar.addEventListener("click", () => restarCantidad(posicion));

      const botonSumar = filaCarrito.querySelector(".btn-sumar");
      botonSumar.addEventListener("click", () => sumarCantidad(posicion));

      contenedorCarrito.appendChild(filaCarrito);
   });

   totalCarrito.textContent = "Total: $" + calcularTotal();
}

function filtrarCatalogo(){
   const texto = buscador.value.toLowerCase();
   const fundasFiltradas = catalogo.filter(({ modelo }) => modelo.toLowerCase().includes(texto));
   renderizarCatalogo(fundasFiltradas);
}

function agregarAlCarrito(funda){
   const { id, modelo, color, precio, stock } = funda;
   const itemCarrito = carrito.find(item => item.id === id);

   if(itemCarrito){
      if(itemCarrito.cantidad >= stock){
         notificar("No hay más stock de " + modelo + " (" + color + ")", "error");
         return;
      }
      itemCarrito.cantidad = itemCarrito.cantidad + 1;
   } else if(stock > 0){
      carrito.push({ id, modelo, color, precio, cantidad: 1 });
   } else {
      notificar("Sin stock de " + modelo + " (" + color + ")", "error");
      return;
   }

   guardarStorage();
   renderizarCarrito();
   notificar(modelo + " (" + color + ") agregada al carrito", "exito");
}

function sumarCantidad(posicion){
   const itemCarrito = carrito[posicion];
   const fundaCatalogo = catalogo.find(funda => funda.id === itemCarrito.id);

   if(fundaCatalogo && itemCarrito.cantidad < fundaCatalogo.stock){
      itemCarrito.cantidad = itemCarrito.cantidad + 1;
      guardarStorage();
      renderizarCarrito();
   } else {
      notificar("No hay más stock disponible", "error");
   }
}

function restarCantidad(posicion){
   const itemCarrito = carrito[posicion];
   itemCarrito.cantidad = itemCarrito.cantidad - 1;

   if(itemCarrito.cantidad === 0){
      carrito.splice(posicion, 1);
      notificar(itemCarrito.modelo + " (" + itemCarrito.color + ") quitada del carrito", "exito");
   }

   guardarStorage();
   renderizarCarrito();
}

function vaciarCarrito(){
   if(carrito.length === 0){
      notificar("El carrito ya está vacío", "error");
      return;
   }

   carrito.splice(0);
   seccionCheckout.className = "oculto";

   guardarStorage();
   renderizarCarrito();
   notificar("Se vació el carrito", "exito");
}

function mostrarCheckout(){
   if(carrito.length === 0){
      notificar("Agregá productos al carrito antes de finalizar la compra", "error");
      return;
   }

   seccionResumen.className = "oculto";
   seccionCheckout.className = "";
}

function renderizarResumen(compra){
   const { cliente, productos, total } = compra;

   contenedorResumen.innerHTML = `<p>¡Gracias por tu compra, ${cliente.nombre} ${cliente.apellido}!</p>`;

   productos.forEach(({ modelo, color, precio, cantidad }) => {
      const detalle = document.createElement("p");
      detalle.textContent = `${cantidad} x ${modelo} (${color}) = $${precio * cantidad}`;
      contenedorResumen.appendChild(detalle);
   });

   const datosFinales = document.createElement("div");
   datosFinales.innerHTML = `
      <p>Total: $${total}</p>
      <p>Envío a: ${cliente.direccion}, ${cliente.ciudad}</p>
      <p>Te enviamos la confirmación a ${cliente.email}</p>
   `;
   contenedorResumen.appendChild(datosFinales);

   seccionResumen.className = "";
}

function confirmarCompra(){

   if(carrito.length === 0){
      notificar("El carrito está vacío", "error");
      return;
   }

   let datosCompletos = true;
   camposCheckout.forEach(campo => {
      if(campo.value == ""){
         datosCompletos = false;
      }
   });

   if(!datosCompletos){
      notificar("Completá todos los datos del cliente", "error");
      return;
   }

   if(!inputEmail.value.includes("@")){
      notificar("Ingresá un email válido", "error");
      return;
   }

   const cliente = {
      nombre: inputNombre.value,
      apellido: inputApellido.value,
      email: inputEmail.value,
      telefono: inputTelefono.value,
      direccion: inputDireccion.value,
      ciudad: inputCiudad.value
   };
   const compra = new Pedido(cliente, [...carrito], calcularTotal());

   renderizarResumen(compra);

   compras.push(compra);
   descontarStock(compra.productos);

   carrito.splice(0);
   guardarStorage();
   renderizarCarrito();
   filtrarCatalogo();

   camposCheckout.forEach(campo => {
      campo.value = "";
   });
   seccionCheckout.className = "oculto";

   notificar("¡Compra realizada con éxito!", "exito");
}

async function cargarCatalogo(){
   try {
      mensaje.textContent = "Cargando productos...";

      const response = await fetch(url);
      if(!response.ok){
         throw new Error("Error en la petición: " + response.status);
      }

      catalogo = await response.json();
      
      compras.forEach(compra => {
         descontarStock(compra.productos);
      });

      renderizarCatalogo(catalogo);
      notificar(catalogo.length + " productos cargados con éxito", "exito");
   } catch (error) {
      notificar("No se pudo cargar el catálogo", "error");
   } finally {
      mensaje.textContent = "";
      aviso.textContent = "Carga de productos finalizada";
   }
}

setTimeout(() => {
   aviso.textContent = "Recordatorio: revisá el stock antes de comprar";
   aviso.className = "exito";
}, 5000);

btnFinalizar.addEventListener("click", mostrarCheckout);
btnVaciar.addEventListener("click", vaciarCarrito);
btnConfirmar.addEventListener("click", confirmarCompra);
buscador.addEventListener("keyup", filtrarCatalogo);

renderizarCarrito();
cargarCatalogo();