//--------DECLARACION de las VARIABLES GLOBALES definidas en state
//----------------------------------------------------------------
const state = {
  customSearch: false,
  respuesta: "",
  filtros: {
    "Ciudad" : "",
    "Tipo" : "",
    "precioMin" : "",
    "precioMax" : ""
}
};

//--------DECLARACION de FUNCIONES a utilizarse
//----------------------------------------------------------------

//Funcion para requerir peticiones, esperar y devolverlas en la pantalla
const hacerPeticiones = async (filtros) =>{
  await requerirPeticiones(filtros);
  presentarPeticiones();
};
//funcion para requerir peticiones
const requerirPeticiones = async (parametros) => {
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
    request.send(parametros);
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

//funciones SETEAR FILTROS cuando se da click en BUSQUEDA PERSONALIZADA
const encerarFiltros = () => {
  state.filtros.Ciudad = "";
  state.filtros.Tipo = "";
  state.filtros.precioMin = "$1000";
  state.filtros.precioMax = "$100000";
};
const setearFiltros = () =>{
 
    state.filtros.Ciudad = document.querySelector("#ciudad option:checked").value;
    state.filtros.Tipo = document.querySelector('#tipo option:checked').value;
    state.filtros.precioMin = document.querySelector('.irs-from').innerText;
    state.filtros.precioMax = document.querySelector('.irs-to').innerText;
    if (state.filtros.precioMin == "0" || state.filtros.precioMin == "") state.filtros.precioMin = "$1000";
    if (state.filtros.precioMax == "0" || state.filtros.precioMax == "") state.filtros.precioMax = "$20000";
};
//--------SETEO INICIAL DEL PROGRAMA
//----------------------------------------------------------------

//inicializar los <option> de los <select> de ciudad y tipo
(async () =>{
  await ['Ciudad','Tipo'].forEach(async (element) => {
    await requerirPeticiones(element); 
    const opciones = state.respuesta.split(",");
    opciones.forEach((el) => {
      document.querySelector(`#${element.toLowerCase()}`).insertAdjacentHTML('beforeend',`<option value="${el}">${el}</option>`);
    });
    //inicializador de las etiquetas SELECT en MATERIALIZA
    $('select').material_select();
  });
})();

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

//--------CORRER LISTENERS
//----------------------------------------------------------------
//NOTA: LOS LISTENERS DE CIUDAD Y TIPO SE ANADEN CUANDO SE AGREGAN LAS <OPTIONS>

//Funcionalidad de boton de BUSQUEDA PERSONALIZADA para presentar campos de busqueda 
$('#checkPersonalizada').on('change', (e) => {

  if (state.customSearch == false) {
    state.customSearch = true;
    $('#buscar').text('BUSCAR');
  } else {
    state.customSearch = false;
    $('#buscar').text('VER TODOS')
  }
  $('#personalizada').toggleClass('invisible')
});

//escuchar el click en BOTON BUSCAR, para solicitar info y presentarla
$('#buscar').click((e) => {
  if (state.customSearch == false){
    encerarFiltros();
  }
  else if (state.customSearch){
    setearFiltros();
  }
  hacerPeticiones(`data&${JSON.stringify(state.filtros)}`);
});