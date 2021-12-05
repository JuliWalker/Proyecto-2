class Producto {
    constructor (id, nombre, precio, stock, vegano) {
        this.id = id,
        this.nombre = nombre,
        this.precio = precio,
        this.stock = stock,
        this.vegano = vegano
        }

        getVegano () {
            if (this.vegano) {
                return "si";
            }
            else {
                return "no";
            }
        }
    
        showProducto () {
            return `<h3 class="color">${this.id}, ${this.nombre}</h3>
            <ul>
                <li>Precio: ${this.precio}</li> 
                <li>Apto vegano?: ${this.getVegano()}</li>
            </ul>`;
        }
    }


class Cliente {
     constructor (nombre, mesa) {
        this.nombre = nombre,
        this.mesa = mesa,
     }
}    

class ProductoPedido {
    constructor(Producto, cantidad) {
        this.Producto = Producto;
        this.cantidad = cantidad;
    }


    
}


class Pedido {
    constructor (id, cliente, arrayProductos, metodo, subtotal) {
        this.id = id,
        this.cliente = cliente,
        this.arrayProductos = arrayProductos,
        this.metodo = metodo,
        this.subtotal = subtotal
        }
    
        calcularSubTotal () {
            this.subTotal = this.precio * this.cantidad;
        }

        descuentoEfectivo () {
            if (this.metodo == "efectivo") {
            this.subTotal = this.subTotal - 0.1 * (this.subtotal);
            }        
        }
    }