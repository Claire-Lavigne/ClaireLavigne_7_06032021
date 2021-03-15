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

  const inputSearch = document.querySelector('input[type="search"]')
  const submitSearch = document.querySelector('form button');

  inputSearch.addEventListener('keyup', e => {
    const inputValue = inputSearch.value.toLowerCase();
    const cards = document.querySelectorAll('div.card');

    if (inputValue.length >= 3) {
      filterRecipes = [];
      console.log(inputValue)
      recipes.forEach(recipe => {

        let ingredientString = '';
        recipe.ingredients.forEach(ingredient => {
          ingredientString += ingredient.ingredient + ' ';
        })
        
        let ustensilsString = '';
        recipe.ustensils.forEach(ustensil => {
          ustensilsString += ustensil + ' ';
        })

        if (recipe.name.toLowerCase().indexOf(inputValue) > -1
          || recipe.description.toLowerCase().indexOf(inputValue) > -1
          || recipe.appliance.toLowerCase().indexOf(inputValue) > -1
          || ingredientString.toLowerCase().indexOf(inputValue) > -1
          || ustensilsString.toLowerCase().indexOf(inputValue) > -1
        ) {
          filterRecipes.push(recipe);
        }
      })
      displayRecipes(filterRecipes)

      /*
            cards.forEach(card => {
              const cardTitle = card.querySelector('div.card .card-title');
              const cardIngredients = card.querySelector('div.card li');
              const cardDescription = card.querySelector('div.card .card-description');
              console.log(cardTitle)
              // filter cards : search in title/ingredients/description
              if (cardTitle.innerText.toLowerCase().indexOf(inputValue) > -1
                || cardIngredients.innerText.toLowerCase().indexOf(inputValue) > -1
                || cardDescription.innerText.toLowerCase().indexOf(inputValue) > -1
              ) {
                card.classList.replace('d-none', 'd-flex');
              } else {
                card.classList.replace('d-flex', 'd-none');
              }
            })
      */
      if (document.querySelectorAll('.card.d-flex').length === 0) {
        document.querySelector('.no-cards').classList.replace('d-none', 'd-flex');
      } else {
        document.querySelector('.no-cards').classList.replace('d-flex', 'd-none');
      }

      // btns keywords are actualized (advanced research)

    } else {
      cards.forEach(card => {
        card.style.display = "";
      })
    }

    if (e.keyCode === 13) { // "Enter"
      preventSearchSubmit;
    }


  })

  // Search keywords in btns
  // keywords shown as tag after being choosed

  const preventSearchSubmit = () => {
    submitSearch.addEventListener('click', e => {
      e.preventDefault();
      const inputValue = inputSearch.value.toLowerCase();
      console.log(inputValue)
    });
  }
  preventSearchSubmit()


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

  // remove tags on Close
  const closeTags = document.querySelectorAll('.tags span i');
  closeTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.target.parentElement.remove();
    })
  })
});


function displayRecipes(recipes) {
  let arr = [];
  let arrtwo = [];
  let arrthree = [];
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

    [keys.ingredients].forEach(array => {
      let name, quantity, unit;
      ul = document.createElement("ul");

      array.forEach(object => {
        (object.ingredient != undefined) ? name = object.ingredient : name = '';
        (object.quantity != undefined) ? quantity = `: ${object.quantity}` : quantity = '';
        (object.unit != undefined) ? unit = object.unit : unit = '';
        ul.innerHTML += `<li><span>${name}</span>${quantity}${unit}</li>`;


        arrthree.push(name)
      })

    })
    // add list to card
    listElt.append(ul)

    arrtwo.push(keys.appliance)

    keys.ustensils.forEach(array => {
      arr.push(array)
    })


  })

  let ingredientsSet = [...new Set(arrthree)]
  ingredientsSet.forEach(ingredient => {
    dropdownIngredients.innerHTML += `<li><a class="dropdown-item" href="#">${ingredient}</a></li>`;
  })


  let ustensilsSet = [...new Set(arr)]
  ustensilsSet.forEach(ustensil => {
    dropdownUstenciles.innerHTML += `<li><a class="dropdown-item" href="#">${ustensil}</a></li>`;
  })


  let applianceSet = [...new Set(arrtwo)]
  applianceSet.forEach(appliance => {
    dropdownAppareil.innerHTML += `<li><a class="dropdown-item" href="#">${appliance}</a></li>`;
  })

}