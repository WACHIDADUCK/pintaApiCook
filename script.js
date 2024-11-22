// script.js


async function consulta(url) {
  try {
    const resultadoEnBruto = await fetch(url);
    const resultadoJSON = await resultadoEnBruto.json();
    return resultadoJSON;
  } catch (error) {
    console.log(`Error al obtener categorías: ${error}`);
    return [];
  }
}

function cogerSessionStorage() {
  return JSON.parse(sessionStorage.getItem('recetas'));
}


function subirSesionStorage(objeto) {
  sessionStorage.setItem('recetas', JSON.stringify(objeto));
}


async function mostrarCategorias() {
  const loadingMessage = document.getElementById("loading");
  const container = document.getElementById("category-container");
  // Llamada a la API
  let localStorage
  let url = "https://www.themealdb.com/api/json/v1/1/categories.php"

  let respuesta = await comprobarLocalStorage(url, 'categories')
  localStorage = cogerSessionStorage();
  categorias = cogerSessionStorage()

  // Oculta el mensaje de carga
  loadingMessage.style.display = "none";

  // Crear tarjetas para cada categoría
  localStorage.categories.forEach(categoria => {
    const a = document.createElement("a");
    a.id = categoria.strCategory

    // CARD DE CATEGORIAS

    let element = `
    <a id="${categoria.strCategory}">
      <div class="category-card">
        <img src="${categoria.strCategoryThumb}" alt="${categoria.strCategory}" class="category-image">
        <h3 class="category-name">${categoria.strCategory}</h3>
        <p class="category-description">${categoria.strCategoryDescription}</p>
      </div>
    </a>
    `

    a.innerHTML = element;
    a.addEventListener("click", (e) => {
      buscarCategorias(e)
    })
    container.appendChild(a);
  });
}



// Llama a la función para mostrar categorías al cargar la página
mostrarCategorias();

function vaciarContainer() {
  let container = document.getElementById("category-container");
  container.innerHTML = "";
}



async function buscarCategorias(e) {
  vaciarContainer()


  // Llamada a la API
  const id = e.target.closest("a").id;
  let url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${id}`;
  await comprobarLocalStorage(url, id);

  const container = document.querySelector(".category-container");
  const enunciado = document.querySelector("h2");

  enunciado.textContent = `${id}`


  // CARD DE RECETAS

  cogerSessionStorage()[id].meals.forEach(receta => {

    let a = document.createElement("a");

    a.id = receta.strMeal

    let div = document.createElement("div");
    div.className = "category-card";

    let img = document.createElement("img");
    img.src = receta.strMealThumb;
    img.alt = receta.strCategory;
    img.className = "category-image";

    let h3 = document.createElement("h3");
    h3.className = "category-name";
    h3.textContent = receta.strMeal;

    div.appendChild(img);
    div.appendChild(h3);

    a.appendChild(div);
    a.addEventListener("click", (e) => {
      mostrarPlato(e)
    })

    container.appendChild(a);
  })
}

async function comprobarLocalStorage(url, campoObjeto) {
  if (!sessionStorage.getItem('recetas')) {
    let recetas = await consulta(url);
    sessionStorage.setItem('recetas', JSON.stringify(recetas));
  }
  else if (!cogerSessionStorage()[campoObjeto]) {
    let storage = cogerSessionStorage()
    storage[campoObjeto] = await consulta(url)
    subirSesionStorage(storage);
  }
}


async function mostrarPlato(e) {
  console.log(e.target.closest("a").id)
  let id = e.target.closest("a").id
  id.replace(" ", "%20");
  let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${id}`
  await comprobarLocalStorage(url, id)
  let storage = cogerSessionStorage()[id].meals[0]


  let li = ``


  for (let i = 1; i < 21; i++) {
    let cantidadIndex = "strMeasure" + i
    let ingredienteIndex = "strIngredient" + i
    if (storage[ingredienteIndex]) {
      li += `<li><span>${storage[cantidadIndex]}</span> ${storage[ingredienteIndex]}</li>`
    }
  }


  let card = `
  
  
  <div class="card centrado">
        <img src="${storage.strMealThumb}" alt="Ayam Percik" class="cardPlato">
        <div class="card-content">
            <h2>${storage.strMeal}</h2>
            <p>
            ${storage.strInstructions}
            </p>
            <div class="ingredients">
                <h3>Ingredients:</h3>
                <ul>
                `
    +
    li
    +
    `
                </ul>
            </div>
        </div>
    </div>
`

  vaciarContainer()

  document.querySelector(".main-content").innerHTML = card
}


