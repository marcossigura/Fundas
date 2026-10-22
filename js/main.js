class Funda {
   constructor(id, modelo, color, precio, stock){
      this.id = id;
      this.modelo = modelo;
      this.color = color;
      this.precio = precio;
      this.stock = stock;
   }
}

class Pedido {
   constructor(cliente, funda, cantidad, total){
      this.cliente = cliente;
      this.funda = funda;
      this.cantidad = cantidad;
      this.total = total;
   }
}

const catalogo = [
   new Funda(1, "iPhone 11", "Negro", 6000, 15),
   new Funda(2, "iPhone 11", "Transparente", 5500, 12),
   new Funda(3, "iPhone 12", "Azul", 6500, 10),
   new Funda(4, "iPhone 12", "Negro", 6500, 8),
   new Funda(5, "iPhone 12", "Transparente", 6000, 14),
   new Funda(6, "iPhone 13", "Negro", 8000, 10),
   new Funda(7, "iPhone 13", "Rojo", 8000, 6),
   new Funda(8, "iPhone 13", "Transparente", 7000, 12),
   new Funda(9, "iPhone 14", "Verde", 8500, 9),
   new Funda(10, "iPhone 14", "Negro", 8500, 7),
   new Funda(11, "iPhone 14", "Transparente", 7500, 11),
   new Funda(12, "iPhone 15", "Azul", 9000, 8),
   new Funda(13, "iPhone 15", "Negro", 9000, 5),
   new Funda(14, "iPhone 15", "Transparente", 8000, 10)
];

const pedidos = [];


const inputCliente = document.getElementById("cliente");
const selectFunda = document.getElementById("funda");
const inputCantidad = document.getElementById("cantidad");
const btnRegistrar = document.getElementById("btn-registrar");
const mensaje = document.getElementById("mensaje");
const buscador = document.getElementById("buscador");
const contenedorCatalogo = document.querySelector("#contenedor-catalogo");
const contenedorPedidos = document.querySelector("#contenedor-pedidos");


function mostrarMensaje(texto, tipo){
   mensaje.textContent = texto;
   mensaje.className = tipo;
}


function cargarSelect(){
   let html = "";
   for(const funda of catalogo){
      html += `<option value="${funda.id}">${funda.modelo} - ${funda.color} ($${funda.precio})</option>`;
   }
   selectFunda.innerHTML = html;
}

function renderizarCatalogo(lista){
   let html = "";
   for(const funda of lista){
      html += `
         <div class="tarjeta">
            <h3>${funda.modelo}</h3>
            <p>${funda.color}</p>
            <p>$${funda.precio}</p>
            <p>Stock: ${funda.stock}</p>
         </div>
      `;
   }
   contenedorCatalogo.innerHTML = html;
}

function renderizarPedidos(){
   let html = "";
   for(const pedido of pedidos){
      html += `
         <div class="pedido">
            <p>${pedido.cliente}: ${pedido.cantidad} x ${pedido.funda.modelo} (${pedido.funda.color}) = $${pedido.total}</p>
            <button class="btn btn-cancelar">Cancelar</button>
         </div>
      `;
   }
   contenedorPedidos.innerHTML = html;

  
   const botones = document.querySelectorAll(".btn-cancelar");
   for(let i = 0; i < botones.length; i++){
      botones[i].addEventListener("click", () => cancelarPedido(i));
   }
}


function filtrarCatalogo(){
   const texto = buscador.value.toLowerCase();
   const filtradas = catalogo.filter(funda => funda.modelo.toLowerCase().includes(texto));
   renderizarCatalogo(filtradas);
}


function registrarPedido(){
   const cliente = inputCliente.value;
   const cantidad = parseInt(inputCantidad.value);
   const funda = catalogo.find(f => f.id == selectFunda.value);

   if(cliente != "" && cantidad > 0){

      if(funda.stock >= cantidad){
         const pedido = new Pedido(cliente, funda, cantidad, funda.precio * cantidad);
         funda.stock = funda.stock - cantidad;
         pedidos.push(pedido);

         renderizarPedidos();
         filtrarCatalogo();
         mostrarMensaje("Pedido de " + cliente + " registrado", "exito");

         inputCliente.value = "";
         inputCantidad.value = 1;
      } else {
         mostrarMensaje("Stock insuficiente (quedan " + funda.stock + ")", "error");
      }

   } else {
      mostrarMensaje("Completá el cliente y una cantidad válida", "error");
   }
}

function cancelarPedido(posicion){
   const pedido = pedidos[posicion];

   pedido.funda.stock = pedido.funda.stock + pedido.cantidad;
   pedidos.splice(posicion, 1);

   renderizarPedidos();
   filtrarCatalogo();
   mostrarMensaje("Pedido de " + pedido.cliente + " cancelado", "exito");
}


btnRegistrar.addEventListener("click", registrarPedido);
buscador.addEventListener("keyup", filtrarCatalogo);


cargarSelect();
renderizarCatalogo(catalogo);
renderizarPedidos();

