// el primer objeto es Producto, que son todos los productos que se incluyen en el menu del bar. toda la info de productos se trae desde un archivo JSON.

class Producto {
    constructor (id, nombre, precio, stock, vegano, rutaImg, descImg) {
        this.id = id,
        this.nombre = nombre,
        this.precio = precio,
        this.stock = stock,
        this.vegano = vegano,
        this.rutaImg = rutaImg,
        this.descImg = descImg
        }

        getVegano () {
            if (this.vegano === "true") {
                return "si";
            }
            else {
                return "no";
            }
        }

    }

// el segundo objeto es el cliente, le pregunto el nombre y donde esta sentado para poder llamarlo con su nombre a buscar el pedido o llevarselo a la mesa si no me escucha.

class Cliente {
     constructor (nombre, mesa) {
        this.nombre = nombre,
        this.mesa = mesa
     }
}    


// Cuando el cliente pide un producto pasa de ser un mero producto a ser un "producto pedido", la principal diferencia es que el producto pedido reconoce la cantidad de productos del mismo tipo que se pidieron

class ProductoPedido {
    constructor(Producto, cantidad) {
        this.Producto = Producto;
        this.cantidad = cantidad;
    }

    showProducto () {
        return `<h3 class="color">${this.Producto.id}, ${this.Producto.nombre}</h3>
        <ul>
            <li>Precio: ${this.Producto.precio}</li> 
            <li>Cantidad: ${this.cantidad}</li> 
        </ul>`;
    }
    
}


// una vez que tengo toda la info puedo generar el "Pedido" que ya incluye la info del cliente, los productos y cantidades que pidio, el metodo de pago y el importe a pagar.

class Pedido {
    constructor (id, cliente, arrayProductos, metodo, subtotal) {
        this.id = id,
        this.cliente = cliente,
        this.arrayProductos = arrayProductos,
        this.metodo = metodo,
        this.subtotal = subtotal
        }
    


        // falta usar esta funcin o borarrla!

        descuentoEfectivo () {
            if (this.metodo == "efectivo") {
            this.subTotal = this.subTotal - 0.1 * (this.subtotal);
            }        
        }

    }