//inicializador de las etiquetas SELECT en MATERIALIZA
$(document).ready(function(){
  $('select').material_select();
});

//declaracion de las VARIABLES GLOBALES definidas en state
const state = {};

//Inicializador del elemento Slider 
$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "$"
});

//Funcionalidad de BOTON DE BUSQUEDA para presentar campos de busqueda 
$('#checkPersonalizada').on('change', (e) => {
  if (this.customSearch == false) {
    this.customSearch = true
  } else {
    this.customSearch = false
  }
  $('#personalizada').toggleClass('invisible')
});

$('#buscar').click((e) => { 
  hacerPeticiones('chao');
});

//Funcion para requerir peticiones, esperar y devolverlas en la pantalla
const hacerPeticiones = async (filtros) =>{
  await requerirPeticiones(filtros);
  presentarPeticiones();
};
//funcion para requerir peticiones
const requerirPeticiones = async (filtros) => {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest;
    request.open('POST', "http://127.0.0.1:1337/",true);
    request.onload = function () {
      if (this.status == 200){
        resolve();
        state.respuesta = request.response;
      }else if (this.status == 404){
        reject();
        console.log('readystate onLoad', request);
      }
    }
    request.send(filtros);
  });
};

//funcion para presentar los resultados de peticiones en HTML
const presentarPeticiones = () => {
  listaResultados = document.querySelector('.lista');
  listaResultados.innerHTML = '';
  
  if (state.respuesta) {
    JSON.parse(state.respuesta).forEach(element => {
      elementoHTML = `
        <div class="card horizontal">
        <div class="card-image">
          <img src="./img/home.jpg">
        </div>
        <div class="card-stacked">
          <div class="card-content">
            <div>
              <b>Direccion: </b><p>${element.Direccion}</p>
            </div>
            <div>
              <b>Ciudad: </b><p>${element.Ciudad}</p>
            </div>
            <div>
              <b>Telefono: </b><p>${element.Telefono}</p>
            </div>
            <div>
              <b>Código postal: </b><p>${element.Codigo_Postal}</p>
            </div>
            <div>
              <b>Precio: </b><p>${element.Precio}</p>
            </div>
            <div>
              <b>Tipo: </b><p>${element.Tipo}</p>
            </div>          
          </div>
          <div class="card-action right-align">
            <a href="#">Ver más</a>
          </div>
        </div>
        </div>
        `;
        listaResultados.insertAdjacentHTML('beforeend', elementoHTML);
    });
  } else{
    resultadoVacioHtml = `
    <div class="card horizontal">
    <div class="card-image">
      <img src="./img/home.jpg">
    </div>
    <div class="card-stacked">
      <div class="card-content">
        <div>
          <p>NO SE ENCONTRARON LOS ELEMENTOS DESEADOS</p>
        </div>         
      </div>
    </div>
    </div>
    `;

    listaResultados.insertAdjacentHTML('beforeend', resultadoVacioHtml);
  }
};
hacerPeticiones('hola');