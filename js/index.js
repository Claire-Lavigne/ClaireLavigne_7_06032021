// import Recipes from './Recipes.class.js';
let filterRecipes = [];

async function fetchRecipes() {
  const response = await fetch('./js/recipes.json');
  const recipes = await response.json();
  return recipes;
}

fetchRecipes().then(recipes => {
  filterRecipes = [...recipes];
  displayRecipes(filterRecipes)
  mainSearch(filterRecipes)
  dropdownOnClick()
  removeTagsOnClick()
  createTag()
});

const removeTagsOnClick = () => {
  const closeTags = document.querySelectorAll('.tags span i');
  closeTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.target.parentElement.remove();
    })
  })
}

const dropdownOnClick = () => {
  const dropdownElements = document.querySelectorAll('.btn-group')
  dropdownElements.forEach(dropdown => {
    dropdown.addEventListener('show.bs.dropdown', (e) => {
      e.target.children[0].classList.replace('d-flex', 'd-none');
      e.target.children[1].classList.replace('d-none', 'd-flex');
    })
    dropdown.addEventListener('hide.bs.dropdown', (e) => {
      e.target.children[0].classList.replace('d-none', 'd-flex');
      e.target.children[1].classList.replace('d-flex', 'd-none');
    })
  })
}

const createTag = () => {
  const dropdownList = document.querySelectorAll('.dropdown-menu li');
  const tagsContainer = document.querySelector('.tags');
  dropdownList.forEach(elt => {
    elt.addEventListener('click', (e) => {
      e.preventDefault();
      let tag = `<span class="btn btn-primary mr-3 px-3 py-1">${e.target.innerText}<i class="bi bi-x-circle ml-2" role="img"
      aria-label="Close tag"></i></span>`;
      tagsContainer.innerHTML += tag;
    })
  })
}

const mainSearch = (recipes) => {

  const inputSearch = document.querySelector('input[type="search"]')
  inputSearch.addEventListener('keyup', e => {
    const inputValue = inputSearch.value.toLowerCase();
    const cards = document.querySelectorAll('div.card');

    if (inputValue.length >= 3) {
      filterRecipes = [];
      recipes.forEach(recipe => {

        let ingredientsString = '';
        recipe.ingredients.forEach(item => {
          ingredientsString += item.ingredient + ' ';
        })

        let ustensilsString = '';
        recipe.ustensils.forEach(ustensil => {
          ustensilsString += ustensil + ' ';
        })

        if (recipe.name.toLowerCase().indexOf(inputValue) > -1
          || recipe.description.toLowerCase().indexOf(inputValue) > -1
          || recipe.appliance.toLowerCase().indexOf(inputValue) > -1
          || ingredientsString.toLowerCase().indexOf(inputValue) > -1
          || ustensilsString.toLowerCase().indexOf(inputValue) > -1
        ) {
          filterRecipes.push(recipe);
        }
      })
      displayRecipes(filterRecipes)

      if (document.querySelectorAll('.card.d-flex').length === 0) {
        document.querySelector('.no-cards').classList.replace('d-none', 'd-flex');
      } else {
        document.querySelector('.no-cards').classList.replace('d-flex', 'd-none');
      }

      // btns keywords are actualized (advanced research)

    }



    if (e.keyCode === 13) { // "Enter"
      preventSearchSubmit;
    }


  })

  // Search keywords in btns
  // keywords shown as tag after being choosed

  preventSearchSubmit()
}

const preventSearchSubmit = () => {
  const submitSearch = document.querySelector('form button');
  submitSearch.addEventListener('click', e => {
    e.preventDefault();
    const inputValue = inputSearch.value.toLowerCase();
    console.log(inputValue)
  });
}

function displayRecipes(recipes) {
  let ustensilsArray = [];
  let applianceArray = [];
  let ingredientsArray = [];
  const templateElt = document.querySelector('#card_template');
  const container = document.querySelector('main .row');
  container.innerText = '';
  const dropdownUstenciles = document.querySelector('.dropdown-menu[aria-labelledby="dropdownUstensiles"]');
  dropdownUstenciles.innerText = '';
  const dropdownIngredients = document.querySelector('.dropdown-menu[aria-labelledby="dropdownIngredients"]');
  dropdownIngredients.innerText = '';
  const dropdownAppareil = document.querySelector('.dropdown-menu[aria-labelledby="dropdownAppareil"]');
  dropdownAppareil.innerText = '';

  recipes.forEach(keys => {
    const cardClone = document.importNode(templateElt.content, true);
    const titleElt = cardClone.querySelector('.card-title');
    const timeElt = cardClone.querySelector('.card-time');
    const listElt = cardClone.querySelector('.card-list');
    const descriptionElt = cardClone.querySelector('.card-description');
    let ul;

    titleElt.innerHTML = keys.name;
    timeElt.innerHTML = `<i class="bi bi-clock"></i> ${keys.time} min`;
    descriptionElt.innerHTML = keys.description;
    container.append(cardClone);

    [keys.ingredients].forEach(ingredient => {
      let name, quantity, unit;
      ul = document.createElement("ul");

      ingredient.forEach(one => {
        (one.ingredient != undefined) ? name = one.ingredient : name = '';
        (one.quantity != undefined) ? quantity = `: ${one.quantity}` : quantity = '';
        (one.unit != undefined) ? unit = one.unit : unit = '';
        ul.innerHTML += `<li><span>${name}</span>${quantity}${unit}</li>`;


        ingredientsArray.push(name)
      })

    })
    // add list to card
    listElt.append(ul)

    applianceArray.push(keys.appliance)

    keys.ustensils.forEach(ustensil => {
      ustensilsArray.push(ustensil)
    })


  })

  let ingredientsSet = [...new Set(ingredientsArray)]
  ingredientsSet.forEach(ingredient => {
    dropdownIngredients.innerHTML += `<li><a class="dropdown-item" href="#">${ingredient}</a></li>`;
  })


  let ustensilsSet = [...new Set(ustensilsArray)]
  ustensilsSet.forEach(ustensil => {
    dropdownUstenciles.innerHTML += `<li><a class="dropdown-item" href="#">${ustensil}</a></li>`;
  })


  let applianceSet = [...new Set(applianceArray)]
  applianceSet.forEach(appliance => {
    dropdownAppareil.innerHTML += `<li><a class="dropdown-item" href="#">${appliance}</a></li>`;
  })

}