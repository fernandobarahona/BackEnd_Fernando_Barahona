const fs = require('fs');
const http = require('http');
const PORT = 1337;

//leo los datos del archivo data.json (lo leao sync porque solo lo necesito una vez al cargar el servidor)
const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const dataJSON = JSON.parse(data);

//creo el servidor desde el modulo nativo de node http
const server = http.createServer(async (req, res) => {
    
    //EXPLICACION DE RECIBIR DATOS: cuando usamos createServer le pasamos un callback que recibe req y res. Req es un objeto que viene de la peticion de cliente y res es un objeto de este tipo especifico al cual le damos ciertas caracteristicas para enviarlo con end(); ---- Ahora, el objeto REQ es de tipo http.ClientRequest que implementa stream.Writable y todos los streams son instancias de EventEmitter. Event emitter tiene una funcion para escuchar un evento llamada .on y .once que es igual pero solo eschucha una vez y se cierra. En este caso escuchan que llego el data y el callback recibe el pedazo de data (por eso se llaman streams) y lo anade a los otros pedazos de data. 

    //variables de data para cada busqueda
    let dataActual = data; 
    let dataActualJSON = dataJSON;
    //recibir datos del cliente cuando es POST (lo que se manda en request.send)
    var parametrosCliente = '';
    await (()=> {
        req.once('data', function (chunk) {
            parametrosCliente += chunk;
        });
    })();
    console.log('solicitud recibida: '+ parametrosCliente);

    //escribir cabezera
    res.writeHead(200, {
        'Content-Type': 'text/json',
        //sire para evitar los problemas de CORS
		'Access-Control-Allow-Origin': '*',
		'X-Powered-By':'nodejs'
    });
    //--------------------------------------------------------------
    //-------------------ROUTING------------------ filtrar segun los parametros enviados desde el cliente
    //--------------------------------------------------------------

    // ---SI SOLICITA LOS VALORES PARA LAS OPCIONES
    if (parametrosCliente === 'Ciudad' || parametrosCliente === 'Tipo'){
        let opciones = dataActualJSON.map((item) => item[parametrosCliente]);
        opciones = opciones.filter((item, index) => opciones.indexOf(item) >= index);
        res.write(opciones.toString());
        console.log('respuesta entregada: '+ opciones.toString().substring(0,15) + '...');
    }
    // --- SI SOLICITA DATOS
    else if (parametrosCliente.substr(0,4) === "data"){
        //SI ES DATA Y TIENE MAS PARAMETROS LOS GUARDO EN UN OBJETO
        parametrosClienteObj = JSON.parse(parametrosCliente.split('&')[1]);
        //PARA CADA PARAMETRO
        Object.keys(parametrosClienteObj).forEach(element => {    
            //SI EL PARAMETRO NO ESTA VACIO
            if(parametrosClienteObj[element] !== ""){  
                //SI EL PARAMETRO ES PRECIOMIN O PRECIOMAX
                if (element == 'precioMin' || element == 'precioMax'){
                    //QUITO EL EL SIMBOLO $ Y LOS ESPACIOS Y LO HAGO NUMERO (COMO VIENEN DE IONRANGESLIDER VIENEN EN ESE FORMATO)
                    parametrosClienteObj[element] = parametrosClienteObj[element].substring(1,parametrosClienteObj[element].length).replace(" ","");
                    if (typeof parametrosClienteObj[element] !== Number) parametrosClienteObj[element] = Number(parametrosClienteObj[element])
                    //SI ES MIN FILTRO HACIA MAYOR QUE PRECIOMIN
                    if (element == 'precioMin'){
                        dataActualJSON = dataActualJSON.filter(item => {
                            //QUITO EL SIMBOLO $ Y LAS COMAS (QUE ES EL FORMADO DE DATA.JSON)
                            precio = Number(item["Precio"].substring(1,item["Precio"].length).replace(",",""));
                            return precio > parametrosClienteObj[element];
                        });
                    //SI ES MAX FILTRO HACIA MENOR QUE PRECIOMAX    
                    } else {
                        dataActualJSON = dataActualJSON.filter(item => {
                            precio = Number(item["Precio"].substring(1,item["Precio"].length).replace(",",""));
                            return precio < parametrosClienteObj[element];
                        });
                    }
                }
                //SI EL PARAMETRO ES CIUDAD O TIPO
                else {
                    //FILTRO LOS ELEMENTOS QUE SEAN IGUALES AL VALOR DEL PARAMETRO
                    dataActualJSON = dataActualJSON.filter(item => item[element] == parametrosClienteObj[element]);
                }
                dataActual= JSON.stringify(dataActualJSON);
           }
        });
        //ESCRIBO LA RESPUESTA AL CLIENTE Y EN LA CONSOLA UN RESUMEN UTIL
        res.write(dataActual.toString());
        console.log(`respuesta entregada: ${data.toString().replace(/\s/g,'').substring(0,15)}...] -> length = ${dataActualJSON.length}`);
    } 
    //SI LOS PARAMETROS SON DE CUALQUIER OTRA FORMA
    else {
        res.write('');
    }

    //enviar la respuesta
    res.end(); 
    
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('Listening for request on port: ' + PORT);
    
});