// este js lo estoy creando para poder ver toda la lista de pedidos y la facturación total
// seria la lista que va a la cocina para que saquen los pedidos y a medida que los van sacando se suma el monto en la facturación.


// inicializo las variables globales

let lista = [];
let arrayLocalSotrage = [];
let arrayPedidos2 = [];
let arrayProductos2 = [];
let cargarProducto;
let prodPedido;
let textoHTML = [];
let arrayEntregados = [];
let facturacion = 0;

// reviso el local storage que vino que del Index y de main JS. Esta parte la puedo hacer antes de cargue el HTML.

let localItems2 = JSON.parse(localStorage.getItem('storageItems'));

for (let i=0; i < localItems2; i++) {
    let bajada = JSON.parse(localStorage.getItem(i));
    lista.push(bajada);
}

$(document).ready(()=>{

    // empiezo poniendo un boton para limpiar todo el local storage (podria usarse al terminar un turno de trabajo y dejar la lista limpia para el siguiente)

    $(`#limpiarStorage`).html(
        `<button type="button" class="btn btn-warning" id= "btnClear">Limpiar lista</button>`
    )

    $(`#btnClear`).on('click',function () {

        Swal.fire({
            title: '¿Queres borrar todos los pedidos?',
            showCancelButton: true,
            confirmButtonText: 'Borrar pedidos',
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    window.location.reload();
                }
        })
        
    })


    // como esta pagina muestra la facturación que suman todos los pedidos entregados reviso el localstorage y recargo este campo para no perderlo al actualizar la pagina.

    let chekearStorage3 = JSON.parse(localStorage.getItem('facturacion'));
    if (chekearStorage3 === null) {
            $("#facturacion").html(
                `<h3>Facturación total: 0</h3>`
            )
    } else {
        facturacion = JSON.parse(localStorage.getItem('facturacion'));
            $("#facturacion").html(
                `<h3>Facturación total: ${facturacion}</h3>`
            )
    }

    // aca empiezo a recorrer toda la parte de los pedidos que guarde en el storage y vienen de la otra pestaña HTML y del otro archivo de JS
    // recordar que antes de la etiqueta ready ya se buscaron algunos paramentros en el local Storage y se armo el array lista con la info de pedidos y el localtems con la cantidad de pedidos

    for (let i=0; i < localItems2; i++) {

        // en esta parte transformo todo lo que viene del storage de nuevo en objetos para poder usar sus propiedades

        let auxiliar = lista[i].arrayProductos.length;
        let auxiliar2 = "";

        for (let j=0; j < auxiliar; j++) {
            cargarProducto = new Producto(lista[i].arrayProductos[j].Producto.id, lista[i].arrayProductos[j].Producto.nombre, lista[i].arrayProductos[j].Producto.precio, lista[i].arrayProductos[j].Producto.stock, lista[i].arrayProductos[j].Producto.vegano, lista[i].arrayProductos[j].Producto.rutaImg, lista[i].arrayProductos[j].Producto.descImg);
            prodPedido = new ProductoPedido(cargarProducto, lista[i].arrayProductos[j].cantidad);

            // aprovecho esta iteracion de transformar en objetos para crear la lista de productos que tiene que despachar la cocina y poder adjuntarla luego al HTML.

            let texto = `<h6 class="card-subtitle mb-2"> ${cargarProducto.nombre} x ${prodPedido.cantidad}</h6>`;
            auxiliar2 = auxiliar2.concat(texto);
            textoHTML[i] = auxiliar2;
        }

        // aca termino de crear el pedido y lo pusheo a un array para poder usarlo en el documento.

        let cliente = new Cliente(lista[i].cliente.nombre,lista[i].cliente.mesa);
        let pedido = new Pedido(lista[i].id,cliente,arrayProductos2,lista[i].metodo,lista[i].subtotal);

        arrayPedidos2.push(pedido);


        // aca creo los HTML de los pedidos que le quiero mostrar a la cocina para que los prepare y los entregue.
        // creo un par de condicionales para revisar en el localStorage cuales ya fueron entregados y no perder esa información al refrescar la pagina.

        let flag = 0;
        let chekearStorage = JSON.parse(localStorage.getItem('entregados'));
        if (chekearStorage === null) {
            flag = 1;
        } else {
            arrayEntregados = JSON.parse(localStorage.getItem('entregados'));
        }

        if (flag == 1 || arrayEntregados[i] == 0 || arrayEntregados[i] == null) {

            // cuando el pedido no esta entregado figura con fondo blanco y el boton en azul y con un ID para darle funcionalidad

            $("#listaPedidos").append(

                `<div id="divs${pedido.id}"> 
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${pedido.id}, ${pedido.cliente.nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Mesa: ${pedido.cliente.mesa}</h6>
                        <h6 class="card-subtitle mb-2 text-muted">Importe: ${pedido.subtotal}</h6>
                        ${textoHTML[i]}
                        <button type="button" class="btn btn-primary" id= "btns${pedido.id}">Entregar pedido</button>
                    </div>
                </div>
                </div>`
                )

        } else {

            // cuando el pedido ya lo entregaron se pone verde el fondo y el boton pasa a estar grisado y sin ninguna funcionalidad y con la leyenda "entregado"

            $("#listaPedidos").append(

                `<div id="divs${pedido.id}"> 
                <div class="card delivered">
                    <div class="card-body">
                        <h5 class="card-title">${pedido.id}, ${pedido.cliente.nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Mesa: ${pedido.cliente.mesa}</h6>
                        <h6 class="card-subtitle mb-2 text-muted">Importe: ${pedido.subtotal}</h6>
                        ${textoHTML[i]}
                        <button type="button" class="btn btn-secondary">Entregado</button>
                    </div>
                </div>
                </div>`
                )

        }


        // ahora que estan creados todos los pedidos voy a crear la funcionalidad de los botones
        // al activar el boton la tarjeta de pedido pasa a estado "entregado", esto es fondo verde y boton grisado sin funcionalidad.
        // al hacer estos cambios tambien tengo que guardar el estado de "entregado" en el localStorage para no perderlo al refrescar la pagina

        $(`#btns${pedido.id}`).on('click',function () {

            // cambio la tarjeta del pedido en HTML para que figure entregada

            $(`#divs${pedido.id}`).html(

                `<div class="card delivered">
                    <div class="card-body">
                        <h5 class="card-title">${pedido.id}, ${pedido.cliente.nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Mesa: ${pedido.cliente.mesa}</h6>
                        <h6 class="card-subtitle mb-2 text-muted">Importe: ${pedido.subtotal}</h6>
                        ${textoHTML[i]}
                        <button type="button" class="btn btn-secondary" id= "btns${pedido.id}">Entregado</button>
                    </div>
                    </div>`
                )


            // creo una variable "entregados" en el localStorage para poder seguir cuales pedidos fueron entregados y la actualizo cuando se van apretando los botones de "entregar"

            let chekearStorage = JSON.parse(localStorage.getItem('entregados'));
            if (chekearStorage === null) {
                for (let m=0; m < localItems2; m++) {
                arrayEntregados[m] = 0;
                }
            } else {
                arrayEntregados = JSON.parse(localStorage.getItem('entregados'));
            }
            arrayEntregados[i] = 1;
            let stringStorage = JSON.stringify(arrayEntregados);
            localStorage.setItem('entregados',stringStorage);


            // aca traigo el dato de la facturación que tenia hasta el momento y le sumo la del pedido entregado y guardo todo en el local Storage.

            let chekearStorage2 = JSON.parse(localStorage.getItem('facturacion'));
            if (chekearStorage2 === null) {
                facturacion = arrayPedidos2[i].subtotal;
            } else {
                facturacion = JSON.parse(localStorage.getItem('facturacion'));
                facturacion = facturacion + arrayPedidos2[i].subtotal;
            }

            let stringStorage2 = JSON.stringify(facturacion);
            localStorage.setItem('facturacion',stringStorage2);


            $("#facturacion").html(
                `<h3>Facturación total: ${facturacion}</h3>`
            )
        })
    }
})