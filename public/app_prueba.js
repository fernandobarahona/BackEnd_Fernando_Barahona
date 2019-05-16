const state = {};

const peticion = async () => {
    await requerirPeticion();
};

const requerirPeticion = async () => {
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest;
        request.open('POST', "http://127.0.0.1:1337/",true);
        request.onload = function () {
            if (this.status == 200){
                state.respuesta = request.response;
                
                //state.respuestaJSON = JSON.parse(request.response);
                resolve();
            }else if (this.status == 404){
            }
        }
        request.send('app_prueba');
    });
}

peticion();

