let allRecipes = [];
let filterRecipes = [];

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
  workingDropdown()
});


const workingDropdown = () => {
  const dropdownElements = document.querySelectorAll('.btn-group')
  dropdownElements.forEach(dropdown => {
    dropdown.addEventListener('show.bs.dropdown', (e) => {
      e.target.children[0].classList.replace('d-flex', 'd-none');
      e.target.children[1].classList.replace('d-none', 'd-flex');
      const inputSearch = e.target.children[1].children[0];
      inputSearch.focus();
      inputSearch.select();

      inputSearch.addEventListener('keyup', () => {

        const inputValue = inputSearch.value.toLowerCase().trim();
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

  const inputSearch = document.querySelector('input.main-form')
  const tagsContainer = document.querySelector('.tags');

  inputSearch.addEventListener('keyup', (e) => {
    const inputValue = inputSearch.value.toLowerCase().trim();

    // if input value length >= 3
    if (inputValue.length >= 3) {
      // filter with main search
      filterMainSearch(recipes);

      // if tags, filter by main + tags
      if (tagsContainer.childElementCount > 0) {
        filterTags(filterRecipes);

        // actualize results
        if (e.key === "Backspace") {
          filterTags(filterRecipes);
        }
      }

    }

    // if input value length < 3 and tags
    if (e.key === "Backspace" && tagsContainer.childElementCount > 0) {
      // filter by tags
      filterRecipes = [...allRecipes];
      filterTags(filterRecipes);
    }

  })

}

const filterMainSearch = (recipes) => {

  const input = document.querySelector('input.main-form');
  const inputValue = input.value.toLowerCase().trim();

  filterRecipes = recipes
    .sort((a, b) => {
      return b.relevance - a.relevance;
    })
    .filter(recipe => {
      // let ustensils = recipe.ustensils.map(ustensil => { return ustensil; })

      let ingredients = recipe.ingredients.map(ingredient => {
        return ingredient.ingredient;
      })

      recipe.relevance = 0;
      recipe.relevance = recipe.name.toLowerCase().includes(inputValue) ? recipe.relevance + 1 : recipe.relevance;
      // recipe.relevance = recipe.appliance.toLowerCase().includes(inputValue) ? recipe.relevance + 2 : recipe.relevance;
      /* "gi" = search in all string + case insensitive https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/RegExp
      ** matchAll https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript/58828841#58828841 */
      recipe.relevance += [...recipe.description.toLowerCase().matchAll(new RegExp(inputValue, 'gi'))].map(a => a.index).length * 0.5;
      recipe.relevance += [...ingredients.toString().toLowerCase().matchAll(new RegExp(inputValue, 'gi'))].map(a => a.index).length * 2;
      // indexes += [...ustensils.toString().toLowerCase().matchAll(new RegExp(inputValue, 'gi'))].map(a => a.index).length *2;

      if (recipe.relevance > 0) {
        return recipe;
      }

    });

  console.log(filterRecipes)
  displayRecipes(filterRecipes)
  displayErrorMessage(filterRecipes)

}

const displayErrorMessage = (filterRecipes) => {
  // if filterRecipes is empty (no recipes), show error msg
  if (filterRecipes.length === 0) {
    document.querySelector('.no-cards').classList.replace('d-none', 'd-flex');
  } else {
    document.querySelector('.no-cards').classList.replace('d-flex', 'd-none');
  }
}

const tagsSearch = (recipes) => {

  const tagsContainer = document.querySelector('.tags');

  window.addTagBlue = (e) => {
    let tagValue = e.children[0].innerHTML;
    let tag = `<span class="btn btn-primary mr-3 px-3 py-1">${tagValue}<i onclick="removeTags(this)" class="bi bi-x-circle ml-2" role="img"
  aria-label="Close tag"></i></span>`;
    tagsContainer.innerHTML += tag;
    filterTags(recipes)
  }
  window.addTagRed = (e) => {
    let tagValue = e.children[0].innerHTML;
    let tag = `<span class="btn btn-danger mr-3 px-3 py-1">${tagValue}<i onclick="removeTags(this)" class="bi bi-x-circle ml-2" role="img"
  aria-label="Close tag"></i></span>`;
    tagsContainer.innerHTML += tag;
    filterTags(recipes)
  }
  window.addTagGreen = (e) => {
    let tagValue = e.children[0].innerHTML;
    let tag = `<span class="btn btn-success mr-3 px-3 py-1">${tagValue}<i onclick="removeTags(this)" class="bi bi-x-circle ml-2" role="img"
  aria-label="Close tag"></i></span>`;
    tagsContainer.innerHTML += tag;
    filterTags(recipes)
  }

};

const filterTags = (recipes) => {

  let tagsBlueArray = [], tagsGreenArray = [], tagsRedArray = [];
  // get all tags and push into different arrays
  const tagsBlue = document.querySelectorAll('.tags .btn-primary i');
  const tagsGreen = document.querySelectorAll('.tags .btn-success i');
  const tagsRed = document.querySelectorAll('.tags .btn-danger i');
  tagsBlue.forEach(tag => {
    tagsBlueArray.push(tag.parentElement.innerText);
  })
  tagsGreen.forEach(tag => {
    tagsGreenArray.push(tag.parentElement.innerText);
  })
  tagsRed.forEach(tag => {
    tagsRedArray.push(tag.parentElement.innerText);
  })

  filterRecipes = recipes.filter(recipe => {
    let ustensils = recipe.ustensils.map(ustensil => {
      return ustensil;
    })

    let ingredients = recipe.ingredients.map(ingredient => {
      return ingredient.ingredient;
    })

    // check if ingredients/appliance/ustensils includes all tags
    return (
      tagsBlueArray.every(elt => ingredients.includes(elt)) &&
      tagsGreenArray.every(elt => [recipe.appliance].includes(elt)) &&
      tagsRedArray.every(elt => ustensils.includes(elt))
    )
  })

  displayRecipes(filterRecipes);
  displayErrorMessage(filterRecipes)
}


window.removeTags = (e) => {
  e.parentElement.remove();
  // get all recipes and filter them by main search + tags
  filterRecipes = [...allRecipes];
  filterMainSearch(filterRecipes);
  filterTags(filterRecipes);
}

const displayRecipes = (recipes) => {
  let ustensilsArray = [], applianceArray = [], ingredientsArray = [];
  const templateElt = document.querySelector('#card_template');
  const container = document.querySelector('main .row');
  const dropdownUstenciles = document.querySelector('.dropdown-menu[aria-labelledby="dropdownUstensiles"]');
  const dropdownIngredients = document.querySelector('.dropdown-menu[aria-labelledby="dropdownIngredients"]');
  const dropdownAppareil = document.querySelector('.dropdown-menu[aria-labelledby="dropdownAppareil"]');
  container.innerText = '';
  dropdownUstenciles.innerText = '';
  dropdownIngredients.innerText = '';
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
    dropdownIngredients.innerHTML += `<li onclick="addTagBlue(this)" class="col-12 col-md-4"><a class="dropdown-item" href="#">${ingredient}</a></li>`;
  })

  let ustensilsSet = [...new Set(ustensilsArray)]
  ustensilsSet.forEach(ustensil => {
    dropdownUstenciles.innerHTML += `<li onclick="addTagRed(this)" class="col-12 col-md-4"><a class="dropdown-item" href="#">${ustensil}</a></li>`;
  })

  let applianceSet = [...new Set(applianceArray)]
  applianceSet.forEach(appliance => {
    dropdownAppareil.innerHTML += `<li onclick="addTagGreen(this)" class="col-12 col-md-4"><a class="dropdown-item" href="#">${appliance}</a></li>`;
  })

  tagsSearch(filterRecipes)
}