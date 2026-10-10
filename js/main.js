class Funda {
   constructor(modelo, color, precio, stock){
      this.modelo = modelo;
      this.color = color;
      this.precio = precio;
      this.stock = stock;
   }
}

const funda1 = new Funda("iPhone 13", "Negro", 8000, 10);
const funda2 = new Funda("iPhone 14", "Transparente", 7000, 8);
const funda3 = new Funda("iPhone 15", "Azul", 8000, 5);

const catalogo = [funda1, funda2, funda3];
const pedidosRegistrados = ["Laura - iPhone 13 x1", "Nicolás - iPhone 14 x2", "Marta - iPhone 15 x1", "Juan - iPhone 13 x3", "Carla - iPhone 14 x1"];

function mostrarCatalogo(){
   console.log("--- Catálogo ---");
   for(const funda of catalogo){
      console.log(funda.modelo + " (" + funda.color + ") $" + funda.precio + " | stock: " + funda.stock);
   }
}

function buscarFunda(modelo){
   return catalogo.find(funda => funda.modelo.toLowerCase() == modelo.toLowerCase());
}

function fundasConStock(){
   return catalogo.filter(funda => funda.stock > 0);
}

function fundasHastaPrecio(precioMaximo){
   return catalogo.filter(funda => funda.precio <= precioMaximo);
}

function preciosConDescuento(porcentaje){
   return catalogo.map(funda => funda.modelo + ": $" + funda.precio * (1 - porcentaje / 100));
}

function hayStock(funda, cantidad){
   if(cantidad > 0 && funda.stock >= cantidad){
      return true;
   } else {
      return false;
   }
}

function calcularTotal(funda, cantidad){
   let total = funda.precio * cantidad;
   if(cantidad >= 3){
      total = total * 0.9; 
   }
   return total;
}

function venderFunda(funda, cantidad){
   funda.stock = funda.stock - cantidad;
}

function listarPedidos(pedidosRegistrados){
   console.log("--- Pedidos registrados ---");
   for(const pedido of pedidosRegistrados){
      console.log("Pedido: " + pedido);
   }
}

function mostrarFundas(lista){
   for(const funda of lista){
      console.log(funda.modelo + " (" + funda.color + ") $" + funda.precio + " | stock: " + funda.stock);
   }
}

mostrarCatalogo();

const menu = 
"¿Qué querés consultar?\n" +
"1 - Ver fundas con stock\n" +
"2 - Ver fundas hasta un precio\n" +
"3 - Ver precios con descuento\n" +
"4 - Salir";

let opcion = prompt(menu);

while(opcion != "4"){

   switch(opcion){

      case "1":
         console.log("--- Fundas con stock ---");
         mostrarFundas(fundasConStock());
         break;

      case "2":
         const precioMaximo = parseInt(prompt("¿Cuál es el precio máximo?"));
         console.log("--- Fundas hasta $" + precioMaximo + " ---");
         mostrarFundas(fundasHastaPrecio(precioMaximo));
         break;

      case "3":
         const porcentaje = parseInt(prompt("¿Qué porcentaje de descuento querés ver?"));
         console.log("--- Precios con " + porcentaje + "% de descuento ---");

         for(const precio of preciosConDescuento(porcentaje)){
            console.log(precio);
         }
         break;

      default:
         console.log("Opción inválida");
      break;
   }

   opcion = prompt(menu);  
}

let continuar = "si";
while(continuar == "si"){

   const cliente = prompt("Nombre del cliente:");

   const modeloPedido = prompt("¿Qué modelo de funda quiere? (ej: iPhone 13)");
   const funda = buscarFunda(modeloPedido);

   if(funda == null){
      alert("No tenemos fundas para " + modeloPedido);
   } else {
      const cantidad = parseInt(prompt("¿Cuántas fundas quiere?"));

      if(hayStock(funda, cantidad)){
         const total = calcularTotal(funda, cantidad);
         venderFunda(funda, cantidad);
         console.log("Venta a " + cliente + ": " + cantidad + " x " + funda.modelo + " = $" + total);

         const express = prompt("¿Es envío express? (si o no)").toLowerCase();
         const pedido = cliente + " - " + funda.modelo + " x" + cantidad;

         if(express == "si"){
            pedidosRegistrados.unshift(pedido);
         } else {
            pedidosRegistrados.push(pedido);
         }
      } else {
         alert("Stock insuficiente de " + funda.modelo + " (quedan " + funda.stock + ")");
      }
   }

   continuar = prompt("¿Desea cargar otro pedido? (si o no)").toLowerCase();
}

listarPedidos(pedidosRegistrados);

const corregir = prompt("¿Querés corregir el nombre de algún pedido? (si o no)").toLowerCase();
if(corregir == "si"){

   const pedidoACorregir = prompt("Ingresá el pedido (tal cual está escrito) que querés corregir:");
   if(pedidosRegistrados.includes(pedidoACorregir)){

      const posicion = pedidosRegistrados.indexOf(pedidoACorregir);
      const pedidoCorregido = prompt("Ingresá el pedido corregido:");

      pedidosRegistrados.splice(posicion, 1, pedidoCorregido);
      console.log("Pedido corregido en la posición " + posicion + ". Registro actualizado:");

      listarPedidos(pedidosRegistrados);
   } else {
      console.log(pedidoACorregir + " no está registrado, no se puede corregir");
   }
} else {
   console.log("No se realizaron correcciones");
}

mostrarCatalogo();

