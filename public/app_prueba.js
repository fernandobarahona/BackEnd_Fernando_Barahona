const state = {};

const peticion = async () => {
    await requerirPeticion();
    console.log(state.respuestaJSON);
};

const requerirPeticion = async () => {
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest;
        request.open('GET', "http://127.0.0.1:1337/",true);
        request.onload = function () {
        if (this.status == 200){
            resolve(request.response);
            state.respuestaJSON = JSON.parse(request.response);
            console.log(state.respuestaJSON);
        }else if (this.status == 404){
            console.log('readystate onLoad', request);
        }
        }
        request.send();
    });
}

peticion();

