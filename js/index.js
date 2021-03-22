let filterRecipes = [];
let allRecipes = [];

async function fetchRecipes() {
  const response = await fetch('./js/recipes.json');
  const recipes = await response.json();
  return recipes;
}

fetchRecipes().then(recipes => {
  allRecipes = [...recipes];
  filterRecipes = [...recipes];
  displayRecipes(allRecipes)
  mainSearch(allRecipes)
  dropdownOnClick()
});


const dropdownOnClick = () => {
  const dropdownElements = document.querySelectorAll('.btn-group')
  dropdownElements.forEach(dropdown => {
    dropdown.addEventListener('show.bs.dropdown', (e) => {
      e.target.children[0].classList.replace('d-flex', 'd-none');
      e.target.children[1].classList.replace('d-none', 'd-flex');
      const inputSearch = e.target.children[1].children[0];
      inputSearch.focus();
      inputSearch.select();

      inputSearch.addEventListener('keyup', () => {

        const inputValue = inputSearch.value.toLowerCase();
        const liElts = document.querySelectorAll('.dropdown-menu.show li');

        liElts.forEach(item => {
          if (item.innerText.toLowerCase().indexOf(inputValue) > -1) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        })
      })

    })
    dropdown.addEventListener('hide.bs.dropdown', (e) => {
      e.target.children[0].classList.replace('d-none', 'd-flex');
      e.target.children[1].classList.replace('d-flex', 'd-none');
    })

  })
}


const mainSearch = (recipes) => {

  const inputSearch = document.querySelector('input[type="search"]')
  inputSearch.addEventListener('keyup', e => {
    const inputValue = inputSearch.value.toLowerCase();

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

      // if filterRecipes is empty, show error msg
      if (filterRecipes.length === 0) {
        document.querySelector('.no-cards').classList.replace('d-none', 'd-flex');
      } else {
        document.querySelector('.no-cards').classList.replace('d-flex', 'd-none');
      }

    } else {
      displayRecipes(allRecipes)
    }

    if (e.keyCode === 13) { // "Enter"
      preventSearchSubmit;
    }
  })
  preventSearchSubmit()
}

const preventSearchSubmit = () => {
  const submitSearch = document.querySelector('form button');
  submitSearch.addEventListener('click', e => {
    e.preventDefault();
  });
}

const tagsSearch = (recipes) => {

  const tagsContainer = document.querySelector('.tags');
  const tagsList = document.querySelectorAll('.tags span');
  let tagValueOther
  const dropdownList = document.querySelectorAll('.dropdown-menu li');
  dropdownList.forEach(elt => {
    elt.addEventListener('click', (e) => {
      e.preventDefault();
      let tagValue = e.target.innerHTML;
      let tag = `<span class="btn btn-primary mr-3 px-3 py-1">${tagValue}<i class="bi bi-x-circle ml-2" role="img"
        aria-label="Close tag"></i></span>`;
      tagsContainer.innerHTML += tag;
      tagsList.forEach(tag => {
        tagValueOther = tag.innerText;
        return tagValueOther
      })
      console.log(tagValueOther)
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

        if (ingredientsString.toLowerCase().indexOf(tagValue.toLowerCase()) > -1
          || recipe.appliance.toLowerCase().indexOf(tagValue.toLowerCase()) > -1
          || ustensilsString.toLowerCase().indexOf(tagValue.toLowerCase()) > -1) {
          filterRecipes.push(recipe);
        }

        //  removeTagsOnClick()
        const closeIcon = document.querySelectorAll('.tags i');
        closeIcon.forEach(icon => {
          icon.addEventListener('click', (e) => {
            e.target.parentElement.remove();
            if (ingredientsString.toLowerCase().indexOf(tagValueOther) > -1) {
              filterRecipes.push(recipe);
            }
          })
        })
      })
      displayRecipes(filterRecipes);

    })
  })
};

const displayRecipes = (recipes) => {
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

  recipes.forEach(recipe => {
    const cardClone = document.importNode(templateElt.content, true);
    const titleElt = cardClone.querySelector('.card-title');
    const timeElt = cardClone.querySelector('.card-time');
    const listElt = cardClone.querySelector('.card-list');
    const descriptionElt = cardClone.querySelector('.card-description');

    titleElt.innerHTML = recipe.name;
    timeElt.innerHTML = `<i class="bi bi-clock"></i> ${recipe.time} min`;
    descriptionElt.innerHTML = recipe.description;
    container.append(cardClone);

    [recipe.ingredients].forEach(ingredient => {
      let name, quantity, unit;

      ingredient.forEach(one => {
        (one.ingredient != undefined) ? name = one.ingredient : name = '';
        (one.quantity != undefined) ? quantity = `: ${one.quantity}` : quantity = '';
        (one.unit != undefined) ? unit = one.unit : unit = '';
        const li = `<li><span>${name}</span>${quantity}${unit}</li>`;
        listElt.innerHTML += li;

        ingredientsArray.push(name)
      })

    })
    // add list to card
    applianceArray.push(recipe.appliance)

    recipe.ustensils.forEach(ustensil => {
      ustensilsArray.push(ustensil)
    })

  })

  let ingredientsSet = [...new Set(ingredientsArray)]
  ingredientsSet.forEach(ingredient => {
    dropdownIngredients.innerHTML += `<li class="col-12 col-md-4"><a class="dropdown-item" href="#">${ingredient}</a></li>`;
  })

  let ustensilsSet = [...new Set(ustensilsArray)]
  ustensilsSet.forEach(ustensil => {
    dropdownUstenciles.innerHTML += `<li class="col-12 col-md-4"><a class="dropdown-item" href="#">${ustensil}</a></li>`;
  })

  let applianceSet = [...new Set(applianceArray)]
  applianceSet.forEach(appliance => {
    dropdownAppareil.innerHTML += `<li class="col-12 col-md-4"><a class="dropdown-item" href="#">${appliance}</a></li>`;
  })


  tagsSearch(filterRecipes)

}