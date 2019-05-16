const fs = require('fs');
const http = require('http');
const PORT = 1337;

//leo los datos del archivo data.json (lo leao sync porque solo lo necesito una vez al cargar el servidor)
const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');


//creo el servidor desde el modulo nativo de node http
const server = http.createServer(async (req, res) => {
    
    //EXPLICACION DE RECIBIR DATOS: cuando usamos createServer le pasamos un callback que recibe req y res. Req es un objeto que viene de la peticion de cliente y res es un objeto de este tipo especifico al cual le damos ciertas caracteristicas para enviarlo con end(); ---- Ahora, el objeto REQ es de tipo http.ClientRequest que implementa stream.Writable y todos los streams son instancias de EventEmitter. Event emitter tiene una funcion para escuchar un evento llamada .on y .once que es igual pero solo eschucha una vez y se cierra. En este caso escuchan que llego el data y el callback recibe el pedazo de data (por eso se llaman streams) y lo anade a los otros pedazos de data. 

    //recibir datos del cliente cuando es POST (lo que se manda en request.send)
    var parametrosCliente = '';
    await (()=> {
        req.once('data', function (chunk) {
            parametrosCliente += chunk;
            console.log(parametrosCliente);
        });
    })();

    //escribir cabezera
    res.writeHead(200, {
        'Content-Type': 'text/json',
        //sire para evitar los problemas de CORS
		'Access-Control-Allow-Origin': '*',
		'X-Powered-By':'nodejs'
    });

    if (parametrosCliente === "chao"){
        res.write(data);
    } else {
        res.write('');
    }

    //enviar la respuesta
    res.end(); 
    
    console.log('respuesta entregada');
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('Listening for request on port: ' + PORT);
    
});