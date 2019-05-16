//Inicializador del elemento Slider
const state = {};

$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "$"
})

function setSearch() {
  let busqueda = $('#checkPersonalizada')
  busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true
    } else {
      this.customSearch = false
    }
    $('#personalizada').toggleClass('invisible')
  })
}

const hacerPeticiones = async () =>{
  await requerirPeticiones();
  console.log(state.respuestaJSON);

  presentarPeticiones();
};

const requerirPeticiones = async () => {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest;
    request.open('GET', "http://127.0.0.1:1337/",true);
    request.onload = function () {
      if (this.status == 200){
        resolve();
        state.respuestaJSON = JSON.parse(request.response);
      }else if (this.status == 404){
        reject();
        console.log('readystate onLoad', request);
      }
    }
    request.send();
  });
};


const presentarPeticiones = () => {
  listaResultados = document.querySelector('.lista');
  
  state.respuestaJSON.forEach(element => {
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
};

setSearch();
hacerPeticiones();

