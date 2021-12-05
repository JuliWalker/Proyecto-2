// declaración de arreglos que vamos a utilizar

let arrayProductos = [];
let arrayClientes = [];
let arrayPedidos = [];
let subtotal = 0;
let metodo = "";
let mesa = 0;
let nombre = "";
let flag = [];


$(document).ready(()=>{

// una vez cargada la pagina agregamos el menu de forma dinamica y les asignamos botones con el ID de cada producto

// traemos todos los productos utilizando AJAX:

    const URLGET = "productos.json"
    $.get(URLGET, function (respuesta, estado) {
        if(estado === "success"){

            let productos = respuesta;

            for (let i = 0 ;i< productos.length ;i++){

// parseo el precio y el stock porque me los devuelve en string en vez de en numero
                let precio = parseInt(productos[i].precio);
                let stock = parseInt(productos[i].stock);

// armo mi producto y los presento en cajitas en el HTML tipo menu.                

                let objetoMenu = new Producto(productos[i].id,productos[i].nombre,precio,stock,productos[i].vegano);

                arrayProductos.push(objetoMenu);

                let a = 0;
                flag.push(a);

                $("#menu").append(
        


// modificar el estilo de esta caja para cambiar toda la visualizacion de la pagina



                    `<div id="div${objetoMenu.id}" class="caja">
                        ${objetoMenu.showProducto()}
                        <button type="button" class="btn btn-dark" id= "btn${objetoMenu.id}">Cargar al pedido</button>
                    </div>            
                    `
                );
        
// damos funcionalidad a los botones de "agregar pedido" para sumar los productos al array de pedidos
        
                $(`#btn${objetoMenu.id}`).on('click',function () {

// NECESITO PRIMERO CAPTURAR LOS DATOS DEL CLIENTE PARA PODER PASARLO ACA!  -   O PODEMOS HACER UN ARRAY DE PRODUCTOS PEDIDOS PARA UN SOLO CLIENTE Y LUEGO UN ARRAY DE PEDIDOS COMPLETOS
// FALTA PODER SUMAR PRODUCTOS IGUALES Y QUE NO APAREZCAN EN LINEAS DIFERENTES.

                    let i = objetoMenu.id;
                    flag[i] = flag[i] + 1;
                    console.log(flag);

                    if (flag[i] = 1) {

                        let capturarProducto = new ProductoPedido (objetoMenu, 1)
                        subtotal = subtotal + objetoMenu.precio;
                        arrayPedidos.push(capturarProducto);

                        // Hacemos que los pedidos se visualicen de forma dinamica en la pagina a medida que los van agregando
                                
                        $("#detallePedido").append(
                                
                            `<div id="Pedido${objetoMenu.id}">
                                ${objetoMenu.showProducto()}
                            </div>            
                            `
                        );

                    } else {
                        
                        const filtrado = arrayPedidos.filter( ProductoPedido => ProductoPedido.Producto.id !=i);
                        let capturarProducto2 = new ProductoPedido (objetoMenu, flag[i]);
                        filtrado.push(capturarProducto2);
                        arrayPedidos = filtrado;

                        $(`#Pedido${objetoMenu.id}`).html(
                                
                            `<div id="Pedido${objetoMenu.id}">
                                ${objetoMenu.showProducto()}
                            </div>            
                            `
                        );

                    }
        

              
// Calculamos y mostramos el precio total de la compra para que el cliente pueda revisarlo a medida que agrega productos
        
                    $("#subTotal").html(
                        `<h3> El precio de tu compra es: ${subtotal} </h3>`
                        )
                })
            }
        }
    })


    //Capturamos la info del formulario de nombre
    let miFormulario1 = document.getElementById("nombre");
    miFormulario1.addEventListener('change', validarFormulario1);

    function validarFormulario1(e){
        //Obtenemos el elemento desde el cual se disparó el evento
        let formulario = e.target
        //Obtengo el valor del input type="text" del nombre
        nombre = formulario.value
        console.log(nombre); 
    }

    //Capturamos la info del formulario de numero de mesa
    let miFormulario2 = document.getElementById("numeroMesa");
    miFormulario2.addEventListener('change', validarFormulario2);

    function validarFormulario2(e){
        //Obtenemos el elemento desde el cual se disparó el evento
        let formulario = e.target
        //Obtengo el valor del selector de numero de mesa
        numeroMesa = formulario.value; 
        console.log(numeroMesa);
    }


    //Capturamos la info del formulario de numero de metodo de pago
    let miFormulario3 = document.getElementById("metodoPago");
    miFormulario3.addEventListener('change', validarFormulario3);

    function validarFormulario3(e){
        //Obtenemos el elemento desde el cual se disparó el evento
        let formulario = e.target
        let auxiliarMetodo = parseInt(formulario.value);
        console.log(auxiliarMetodo);
        //Obtengo el valor del selector de metodo de pago
        switch (auxiliarMetodo) {
            case 1:
                metodo = "efectivo";
                break;
            case 2:
                metodo = "debito";
                break;
            case 3:
                metodo = "mercadoPago";
                break;
            default:
                metodo = "error";
        }
        console.log(metodo);
    }

    // me esta faltando usar la info del formulario y del pedido para armar el array de cliente y de pedido y guardarlo en el local storage

    // el boton de confirmar limpia todo el codigo del body y deja solo un mensaje de confirmación

    $(`#confirmarPedido`).on('click',function () {
        

        // confirmamos que hayan llenado bien el formulario del cliente

        if (nombre == "" || numeroMesa == "" || numeroMesa == "Numero de mesa" || metodo == "error" || metodo == "") {
            alert ("faltan datos del cliente");
            console.log(nombre);
            console.log(metodo);
            console.log(numeroMesa);
        }

        else {

            // confirmamos que hayan incluido al menos un articulo en el carrito

            if (arrayPedidos.length == 0)  {
                alert ("no incluiste nada en tu pedido");
            }   

            // si completaron bien todos los datos entonces armamos el objeto de cliente con los datos del formulario y el objeto pedido con todos los datos.
            // tamben vamos a mostrar el mensaje de confirmación de que el pedido fue cargado correctamente y almacenar todos los datos en el local storage.

            else {

                new Cliente ()

                // localStorage.setItem('arregloPedidos', true);


                $("body").html(
                `<div class="confirmacion">
                <h3>Muchas gracias tu pedido ha sido confirmado</h3>
                </div>`)
            }
        }
    }) 

})



// falta ver donde almacenamos el pedido cuando damos confirmar - Meterlo en el local Storage
// falta configurar los alert para hacerlos personalizados y mas lindos!
// armar una segunda pestaña donde se puedan ver todos los pedidos y filtrarlos. Y que tambien permita borrar pedidos de a uno o todo el local storage.
// me falta poner un filtro de visualizacion para productos veganos. O sino sacar eso del producto.
