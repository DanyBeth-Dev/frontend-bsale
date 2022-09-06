let cards = document.getElementById('cards')
let $template = document.getElementById('card-template').content
let $fragment = document.createDocumentFragment()
let formulario = document.getElementById('busqueda')
let urlBase = 'https://evening-taiga-78339.herokuapp.com'
let ubicacionArreglo = window.location.pathname.split('/')

/**
 * Esta función formatea el path para obtener solamente el slug.
 * @param {Array} arr El arreglo conformado por el pathname guardado en la variable ubicacionArreglo.
 * @returns {String} El slug,
 */
let formateador = (arr) => {
  let lastItem = arr[arr.length-1]
  if (!lastItem) return '/'
  return (`/${lastItem}`)
}
const ubicacion = formateador(ubicacionArreglo)
console.log('ubicacion: ', ubicacion)

/* Renderizado para cada ruta */
/* Manipulación del DOM directa */

window.addEventListener('load', function (event) {
  cards.innerHTML = `
  <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
  </div>
  `
  const filtrado = async (productoDeseado) => {
    //console.log(productoDeseado)
    const allData = await axios.get(`${urlBase}/data${productoDeseado}`)
    console.log('data por evento load: ', allData.data)
    let allElements = ''
    allData.data.forEach(e => {
      const url = e.url_image ? e.url_image : '#'
      let price = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      })
      allElements += `
        <div class="col">
          <div class="card m-2" style="width: 18rem;">
            <img src='${url}' class='img-fluid card-img-top' alt='${e.name}'>
            <div class="card-body">
              <h5 class="card-title">${e.name}</h5>
              <p class="card-text">${price.format(e.price)}</p>
            </div>
          </div>
        </div>
      `
    });
    cards.innerHTML = allElements
  }
  filtrado(ubicacion)
});

/* Búsqueda */
/* Manipulación del DOM optimizada utilizando templates y fragments */

document.addEventListener('submit', async (e) => {
  e.preventDefault()
  let productoABuscar = e.target[0].value
  console.log('producto a buscar: ', productoABuscar)
  try {
    cards.innerHTML = `
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
        `
    let query = { producto: productoABuscar.toLowerCase() }
    //console.log(query)
    let api = `${urlBase}/search`
    let res = await axios.get(api, { params: query })
    console.log('data por evento submit: ', res)
    let resData = res.data
    //console.log(api, res)
    console.log('resData: ', resData)

    if (resData == 'No results' || resData.length == 0) {
      cards.innerHTML = `<h2>Sin resultados</h2>`
    } else {
      resData.forEach(e => {
        //console.log(e)
        const url = e.url_image ? e.url_image : '#'
        let price = new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP'
        })
        $template.querySelector('img').src = url;
        $template.querySelector('img').alt = e.name;
        $template.querySelector('h5').textContent = e.name;
        $template.querySelector('p').textContent = price.format(e.price);

        let $clone = document.importNode($template, true);
        $fragment.appendChild($clone);
      });

      cards.innerHTML = '';
      cards.appendChild($fragment)
    }
  } catch (err) {
    //console.log(err)
    cards.innerHTML = `<p>Ocurrió un error</p>`
  }
})