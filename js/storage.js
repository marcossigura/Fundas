const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const compras = JSON.parse(localStorage.getItem("compras")) || [];

function guardarStorage(){
   localStorage.setItem("carrito", JSON.stringify(carrito));
   localStorage.setItem("compras", JSON.stringify(compras));
}