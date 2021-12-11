// inicializamos todas las variables y arreglos globales que vamos a utilizar:

let arrayProductos = [];
let arrayPedidosCompletos = [];
let arrayPedidos = [];
let subtotal = 0;
let metodo = "";
let numeroMesa = 0;
let nombre = "";
let flag = [];
let idPedido = 0;
let filtrado = [];

// usamos la funcion ready para dejar que primero carguen las estructuras de HTML completas y poder trabajar sobre ellas con nuestro JS

$(document).ready(()=>{

    // una vez cargada la pagina agregamos el menu de forma dinamica y les asignamos botones con el ID de cada producto

    // para traer todos los productos utilizamos AJAX, de esta forma el proyexto es escalable y vinculable a una base de datos externa:

    const URLGET = "productos.json"
    $.get(URLGET, function (respuesta, estado) {
        if(estado === "success"){

            let productos = respuesta;

            for (let i = 0 ;i< productos.length ;i++){

                // parseo el precio y el stock porque me los devuelve en string en vez de en numero

                let precio = parseInt(productos[i].precio);
                let stock = parseInt(productos[i].stock);

                // armo mi array de productos               

                let objetoMenu = new Producto(productos[i].id,productos[i].nombre,precio,stock,productos[i].vegano,productos[i].rutaImg,productos[i].descImg);

                arrayProductos.push(objetoMenu);

                // La creación del arreglo "flag" luego la voy a usar para calcular la cantidad de productos en el carrito.

                let a = 0;
                flag.push(a);

                // los presento en cajitas en el HTML para que el usuario pueda seleccionarlos
                // La generación de todo el HTML intenté cargarla como una función de la clase "Producto" pero me tiraba error asi que escribi todo el codigo aca.

                $("#menu").append(
                    
                    `<div id="div${objetoMenu.id}" class="card">
                    <img src="${objetoMenu.rutaImg}" class="card-img-top" alt="${objetoMenu.descImg}">
                    <div class="card-body">
                        <h5 class="card-title">${objetoMenu.id}, ${objetoMenu.nombre}</h5>
                        <ul class="lista">
                            <li>Precio: ${objetoMenu.precio}</li> 
                            <li>Apto vegano?: ${objetoMenu.getVegano()}</li>
                        </ul>
                        <button type="button" class="btn btn-dark" id= "btn${objetoMenu.id}">Cargar al pedido</button>
                    </div>
                    </div>            
                    `
                );
        
                // damos funcionalidad a los botones de "agregar pedido" para ir sumando los productos al carrito.
        
                $(`#btn${objetoMenu.id}`).on('click',function () {

                    // cuando el producto es sumado al carrito pasa de ser un objeto "producto" a otro "producto pedido" que contempla la cantidad pedida ademas del tipo de producto.
                    // aca usamos el id del producto y el arreglo "flag" para poder contar cuantas veces agregaron el mismo producto al carrito.

                    let i = objetoMenu.id - 1;
                    flag[i] = flag[i] + 1;

                    // Si el producto se agrega por primera vez lo sumamos a la seccion de HTML destinada al pedido
                    // Ademas de cargarlo al HTML tambien lo sumamos a nuestro array de pedidos para luego guardarlo en el local storage

                    if (flag[i] == 1) {

                        let capturarProducto = new ProductoPedido (objetoMenu, 1)
                        subtotal = subtotal + objetoMenu.precio;
                        arrayPedidos.push(capturarProducto);
                                
                        $("#detallePedido").append(
                                
                            `<div id="Pedido${capturarProducto.Producto.id}">
                                ${capturarProducto.showProducto()}
                            </div>            
                            `
                        );

                    // en cambio si el producto ya estaba en el carrito, pisamos el HTML sumandole 1 a la cantidad pedida.
                    // hacemos esto mismo con el array de los pedidos, buscamos el producto pedido dentro y le sumamos 1.

                    } else {
                        
                        filtrado = [];
                        let m = i+1;

                        for (let j=0; j < arrayPedidos.length; j++) {  
                            if (arrayPedidos[j].Producto.id == m) {
                            } else {
                                filtrado.push(arrayPedidos[j]);
                            }

                        }

                        arrayPedidos = filtrado;

                        let capturarProducto2 = new ProductoPedido (objetoMenu, flag[i]);
                        arrayPedidos.push(capturarProducto2);
                        subtotal = subtotal + objetoMenu.precio;

                        $(`#Pedido${objetoMenu.id}`).html(
                                
                            `<div id="Pedido${capturarProducto2.Producto.id}">
                                ${capturarProducto2.showProducto()}
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


    //Capturamos la info del formulario de nombre - Usamos la función "Change" para capturar el nombre antes de apretar el boton de enviar (la idea es dejar el boton de enviar para la info completa de peiddo y cliente)

    let miFormulario1 = document.getElementById("nombre");
    miFormulario1.addEventListener('change', validarFormulario1);

    function validarFormulario1(e){
        //Obtenemos el elemento desde el cual se disparó el evento
        let formulario = e.target;
        //Obtengo el valor del input type="text" del nombre
        nombre = formulario.value;
    }

    //Capturamos la info del formulario de numero de mesa

    let miFormulario2 = document.getElementById("numeroMesa");
    miFormulario2.addEventListener('change', validarFormulario2);

    function validarFormulario2(e){
        //Obtenemos el elemento desde el cual se disparó el evento
        let formulario = e.target;
        //Obtengo el valor del selector de numero de mesa
        numeroMesa = formulario.value;
    }


    //Capturamos la info del formulario de numero de metodo de pago

    let miFormulario3 = document.getElementById("metodoPago");
    miFormulario3.addEventListener('change', validarFormulario3);

    function validarFormulario3(e){
        //Obtenemos el elemento desde el cual se disparó el evento
        let formulario = e.target;
        let auxiliarMetodo = parseInt(formulario.value);
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
    }

    // Una vez que se apreta "confirmar pedido" cargamos los datos del cliente, metodo de pago y el array de productos elegidos en un nuevo objeto llamado "pedido completo"

    $(`#confirmarPedido`).on('click',function () {
        
        // confirmamos que hayan llenado bien el formulario del cliente

        if (nombre == "" || numeroMesa == "" || numeroMesa == "Numero de mesa" || metodo == "error" || metodo == "") {
            Swal.fire({
                icon: 'error',
                title: 'Error de envio',
                text: 'Faltan datos del cliente',
              })
        }

        else {

            // confirmamos que hayan incluido al menos un producto en el carrito

            if (arrayPedidos.length == 0)  {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de envio',
                    text: 'No agregaste ningun producto',
                  });
            }   

            // si completaron bien todos los datos entonces armamos el objeto de cliente con los datos del formulario y el objeto pedido con todos los datos.
            // tamben vamos a mostrar el mensaje de confirmación de que el pedido fue cargado correctamente y almacenar todos los datos en el local storage.

            else {

                //armo el cliente con los datos del formulario

                let cliente = new Cliente (nombre,numeroMesa);
                
                // reviso el local storage para ver si habia items guardados

                let localItems = JSON.parse(localStorage.getItem('storageItems'));
                let localGet = [];

                // Si habia items guardados los recupero en un arrray "localget"

                if (localItems === null) {
                    console.log("primeraIteracion");
                } else {    
                    for (let i=0; i < localItems; i++) {
                        let localGetUnidad = JSON.parse(localStorage.getItem(i));
                        localGet.push(localGetUnidad);
                        console.log(localGet);
                    }
                }
                
                // aca se me complico con guardar en el local storage y termine separando cada vez que guardaba con un key diferente para guardar todos los pedidos con una key nueva
                // tambien acumule otra key que me decia cuantos elementos tenia guardados.

                if (localItems === null) {
                    idPedido = 1;
                } else {
                    idPedido = localGet.length + 1;
                }

                // aca generlo el nuevo pedido y lo guardo en un array junto con todo lo que tenia en local storage.

                let pedidoCompleto = new Pedido (idPedido, cliente, arrayPedidos, metodo, subtotal);
                
                if (localItems === null) {
                    arrayPedidosCompletos.push(pedidoCompleto);
                    console.log(arrayPedidosCompletos);
                } else {
                    for (let i=0; i < localItems; i++) {
                        arrayPedidosCompletos.push(localGet[i]);
                    }
                    arrayPedidosCompletos.push(pedidoCompleto);
                    console.log(arrayPedidosCompletos);
                }

                // aca guardo todo en el local storage, primero guardo todo lo que ya estaba y le sumo el nuevo pedido.

                for (let h=0; h < arrayPedidosCompletos.length; h++) {
                    let localSave = JSON.stringify(arrayPedidosCompletos[h]);
                    console.log(localSave);
                    localStorage.setItem(h,localSave);
                    localStorage.setItem('storageItems',h+1)
                }

                //aca ya termino de guardar todo en el local storage y le doy la alerta al cliente de que todo se guardo bien

                Swal.fire({
                    icon: 'success',
                    title: 'Tu pedido fue guardado correctamente',
                });

                
                //aca limpio la parte del pedido del HTML y re-inicializo todas las variables y el formulario para poder cargar nuevos pedidos


                $("#detallePedido").html(
                    `<h2>Tu Pedido:</h2>
                    `)
                
                arrayProductos = [];
                arrayPedidosCompletos = [];
                arrayPedidos = [];
                subtotal = 0;
                metodo = "";
                numeroMesa = 0;
                nombre = "";
                for (let i=0; i < flag.length; i++) {
                    flag[i] = 0;
                }

                $("#subTotal").html(
                    `<h3> El precio de tu compra es: ${subtotal} </h3>`
                    )

                document.getElementById('formulario').reset();
            }
        }
    }) 
})

// algunas ideas me quedaron pendientes pero no llegue por temas de tiempo:
// hacer un contador de stock que va bajando la cantidad con respecto a la cantidad original
// cuando llega a menos de 5 unidades empezar a tirar alertas con las unidades restantes
// Tambien en la pestaña de facturación estaria bueno incluir todos los stocks consumidos ademas del dinero facturado.
