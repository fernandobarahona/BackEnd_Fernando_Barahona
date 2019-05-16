const fs = require('fs');
const http = require('http');
const url = require('url');
const PORT = 1337;

const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const dataJSON = JSON.parse(data);

const server = http.createServer((req, res) => {
    //permitit el acceso al servidor configurando CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    //escribir cabezera
    res.writeHead(200, {
        'Content-Type': 'text/json',
		'Access-Control-Allow-Origin': '*',
		'X-Powered-By':'nodejs'
    });
    res.write(data);
    res.end(); 
    
    console.log('respuesta entregada');
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('Listening for request on port: ' + PORT);
    
});
