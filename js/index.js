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

  const inputSearch = document.querySelector('input.main-form')
  const tagsContainer = document.querySelector('.tags');

  inputSearch.addEventListener('keyup', (e) => {
    const inputValue = inputSearch.value.toLowerCase();

    // display all recipes (if input value length < 3 and no tags)
    displayRecipes(allRecipes)

    // if input value length >= 3
    if (inputValue.length >= 3) {
      // filter with main search
      filterMainSearch(recipes);

      // if tags, filter by main + tags
      if (tagsContainer.childElementCount > 0) {
        filterTags(filterRecipes);
      }

      // actualize results
      if (e.key === "Backspace" && tagsContainer.childElementCount > 0) {
        filterTags(filterRecipes);
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

  const inputSearch = document.querySelector('input.main-form');
  const inputValue = inputSearch.value.toLowerCase().trim();

  filterRecipes = recipes.filter(recipe => {
    return (
      recipe.name.toLowerCase().includes(inputValue) ||
      recipe.description.toLowerCase().includes(inputValue) ||
      // recipe.appliance.toLowerCase().includes(inputValue) ||
      // recipe.ustensils.toString().toLowerCase().includes(inputValue) ||
      recipe.ingredients.toString().toLowerCase().includes(inputValue)
    )
  })

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
  const dropdowns = document.querySelectorAll('.dropdown-menu li');
  const dropdownIngredients = document.querySelectorAll('.dropdown-menu[aria-labelledby="dropdownIngredients"] li');
  const dropdownAppliance = document.querySelectorAll('.dropdown-menu[aria-labelledby="dropdownAppareil"] li');
  const dropdownUstencils = document.querySelectorAll('.dropdown-menu[aria-labelledby="dropdownUstensiles"] li');
  let tagValue;

  // When I click on "li" in specific dropdown
  // create blue tag
  dropdownIngredients.forEach(li => {
    li.addEventListener('click', (e) => {
      tagValue = e.target.innerHTML;
      let tag = `<span class="btn btn-primary mr-3 px-3 py-1">${tagValue}<i class="bi bi-x-circle ml-2" role="img"
      aria-label="Close tag"></i></span>`;
      tagsContainer.innerHTML += tag;
      removeTags()
    })
  })

  // create green tag
  dropdownAppliance.forEach(li => {
    li.addEventListener('click', (e) => {
      tagValue = e.target.innerHTML;
      let tag = `<span class="btn btn-success mr-3 px-3 py-1">${tagValue}<i class="bi bi-x-circle ml-2" role="img"
      aria-label="Close tag"></i></span>`;
      tagsContainer.innerHTML += tag;
      removeTags()
    })
  })

  // create red tag
  dropdownUstencils.forEach(li => {
    li.addEventListener('click', (e) => {
      tagValue = e.target.innerHTML;
      let tag = `<span class="btn btn-danger mr-3 px-3 py-1">${tagValue}<i class="bi bi-x-circle ml-2" role="img"
      aria-label="Close tag"></i></span>`;
      tagsContainer.innerHTML += tag;
      removeTags()
    })
  })

  // When I click on "li" in any dropdown, filter tags
  dropdowns.forEach(li => {
    li.addEventListener('click', () => {
      filterTags(recipes)
    })
  })

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
}

const removeTags = () => {
  const tags = document.querySelectorAll('.tags i');
  const tagsContainer = document.querySelector('.tags');
  // When I remove a "tag", filter recipes
  tags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.target.parentElement.remove();
      // if there are tags, get all recipes and filter them by main search + tags
      filterRecipes = [...allRecipes];
      filterTags(filterRecipes);
      // if no tags remaining, filter by main search
      if (tagsContainer.childElementCount === 0) {
        filterMainSearch(filterRecipes);
      }
    })
  })

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

  // to shuffle : recipes.sort( () => {return 0.5 - Math.random() }).forEach(recipe => {
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