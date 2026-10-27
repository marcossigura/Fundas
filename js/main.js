class Pedido {
   constructor(cliente, funda, cantidad, total){
      this.cliente = cliente;
      this.funda = funda;
      this.cantidad = cantidad;
      this.total = total;
   }
}

const url = "./db/data.json";

let catalogo = [];
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
const inputCliente = document.getElementById("cliente");
const inputCantidad = document.getElementById("cantidad");
const btnVaciar = document.getElementById("btn-vaciar");
const mensaje = document.getElementById("mensaje");
const aviso = document.getElementById("aviso");
const buscador = document.getElementById("buscador");
const contenedorCatalogo = document.querySelector("#contenedor-catalogo");
const contenedorPedidos = document.querySelector("#contenedor-pedidos");

function guardarStorage(){
   localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

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

function renderizarCatalogo(lista){
   let html = "";
   for(const { modelo, color, precio, stock } of lista){
      html += `
         <div class="tarjeta">
            <h3>${modelo}</h3>
            <p>${color}</p>
            <p>$${precio}</p>
            <p>${stock > 0 ? "Stock: " + stock : "Sin stock"}</p>
            <button class="btn btn-pedir">Comprar</button>
         </div>
      `;
   }
   contenedorCatalogo.innerHTML = html;

   const botonesPedir = document.querySelectorAll(".btn-pedir");
   for(let i = 0; i < botonesPedir.length; i++){
      botonesPedir[i].addEventListener("click", () => registrarPedido(lista[i]));
   }
}

function renderizarPedidos(){
   let html = "";
   for(const { cliente, cantidad, funda, total } of pedidos){
      const { modelo, color } = funda;
      html += `
         <div class="pedido">
            <p>${cliente}: ${cantidad} x ${modelo} (${color}) = $${total}</p>
            <button class="btn btn-cancelar">Cancelar</button>
         </div>
      `;
   }

   contenedorPedidos.innerHTML = pedidos.length === 0 ? "<p>No hay pedidos todavía</p>" : html;

   const botones = document.querySelectorAll(".btn-cancelar");
   for(let i = 0; i < botones.length; i++){
      botones[i].addEventListener("click", () => cancelarPedido(i));
   }
}

function filtrarCatalogo(){
   const texto = buscador.value.toLowerCase();
   const filtradas = catalogo.filter(({ modelo }) => modelo.toLowerCase().includes(texto));
   renderizarCatalogo(filtradas);
}

function registrarPedido(funda){
   const cliente = inputCliente.value;
   const cantidad = parseInt(inputCantidad.value);

   if(funda && cliente != "" && cantidad > 0){
      const { stock, precio } = funda;

      if(stock >= cantidad){
         const pedido = new Pedido(cliente, { ...funda }, cantidad, precio * cantidad);
         funda.stock = stock - cantidad;
         pedidos.push(pedido);

         guardarStorage();
         renderizarPedidos();
         filtrarCatalogo();
         notificar("Pedido de " + cliente + " registrado", "exito");

         inputCliente.value = "";
         inputCantidad.value = 1;
      } else {
         notificar("Stock insuficiente (quedan " + stock + ")", "error");
      }

   } else {
      notificar("Completá el cliente y una cantidad válida", "error");
   }
}

function cancelarPedido(posicion){
   const pedido = pedidos[posicion];
   const { cliente, cantidad, funda: { id } } = pedido;

   const fundaCatalogo = catalogo.find(f => f.id == id);
   fundaCatalogo.stock = fundaCatalogo.stock + cantidad;
   pedidos.splice(posicion, 1);

   guardarStorage();
   renderizarPedidos();
   filtrarCatalogo();
   notificar("Pedido de " + cliente + " cancelado", "exito");
}

function vaciarPedidos(){
   for(const { cantidad, funda: { id } } of pedidos){
      const fundaCatalogo = catalogo.find(f => f.id == id);
      fundaCatalogo.stock = fundaCatalogo.stock + cantidad;
   }
   pedidos.splice(0);

   guardarStorage();
   renderizarPedidos();
   filtrarCatalogo();
   notificar("Se vaciaron todos los pedidos", "exito");
}

async function cargarCatalogo(){
   try {
      mensaje.textContent = "Cargando productos...";

      const response = await fetch(url);
      if(!response.ok){
         throw new Error("Error en la petición: " + response.status);
      }
      catalogo = await response.json();

      for(const { cantidad, funda } of pedidos){
         const fundaCatalogo = catalogo.find(f => f.id == funda.id);
         fundaCatalogo.stock = fundaCatalogo.stock - cantidad;
      }

      renderizarCatalogo(catalogo);
      notificar(catalogo.length + " productos cargados con éxito", "exito");
   } catch (error) {
      console.error("Hubo un problema:", error.message);
      notificar("No se pudo cargar el catálogo", "error");
   } finally {
      mensaje.textContent = "";
      aviso.textContent = "Carga de productos finalizada";
   }
}

setTimeout(() => {
   aviso.textContent = "Recordatorio: revisá el stock antes de registrar un pedido";
   aviso.className = "exito";
}, 5000);

btnVaciar.addEventListener("click", vaciarPedidos);
buscador.addEventListener("keyup", filtrarCatalogo);

renderizarPedidos();
cargarCatalogo();

