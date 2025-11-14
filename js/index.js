let allRecipes = [];
let filterRecipes = [];

async function fetchRecipes() {
  const response = await fetch("./js/recipes.json");
  const recipes = await response.json();
  return recipes;
}

fetchRecipes().then((recipes) => {
  allRecipes = [...recipes];
  filterRecipes = [...recipes];
  displayRecipes(allRecipes);
  mainSearch(allRecipes);
  workingDropdown();
});

const workingDropdown = () => {
  document.querySelectorAll(".btn-group").forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-toggle");
    const labelSpan = button.children[0];
    const inputSpan = button.children[1];
    const input = inputSpan.querySelector("input");

    // 1) If input is visible, neutralize button toggle
    button.addEventListener("click", (e) => {
      const inputIsVisible = inputSpan.classList.contains("d-flex");
      if (inputIsVisible) {
        e.preventDefault();
        e.stopPropagation();
        input.focus();
      }
    });

    // 2) Prevent default on mousedown so focusing input doesn’t toggle/close
    input.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      input.focus();
    });

    // Open: switch spans and focus input
    dropdown.addEventListener("show.bs.dropdown", () => {
      labelSpan.classList.replace("d-flex", "d-none");
      inputSpan.classList.replace("d-none", "d-flex");
      setTimeout(() => {
        input.focus();
        input.select();
      }, 150);
    });

    // Close: restore label and return focus to button
    dropdown.addEventListener("hide.bs.dropdown", (e) => {
      labelSpan.classList.replace("d-none", "d-flex");
      inputSpan.classList.replace("d-flex", "d-none");
      setTimeout(() => button.focus(), 100);
    });

    // Filter while typing
    input.addEventListener("keyup", () => {
      const value = input.value.toLowerCase().trim();
      const items = dropdown.querySelectorAll(".dropdown-menu.show li");
      items.forEach((li) => {
        li.style.display = li.innerText.toLowerCase().includes(value)
          ? ""
          : "none";
      });
    });
  });
};

const mainSearch = (recipes) => {
  const inputSearch = document.querySelector("input.main-form");
  const tagsContainer = document.querySelector(".tags");

  inputSearch.addEventListener("keyup", (e) => {
    const inputValue = inputSearch.value.toLowerCase().trim();

    // display all recipes (if input value length < 3 and no tags)
    displayRecipes(allRecipes);

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
  });
};

const filterMainSearch = (recipes) => {
  const input = document.querySelector("input.main-form");
  const inputValue = input.value.toLowerCase().trim();

  filterRecipes = recipes
    .sort((a, b) => {
      return b.relevance - a.relevance;
    })
    .filter((recipe) => {
      // let ustensils = recipe.ustensils.map(ustensil => { return ustensil; })

      let ingredients = recipe.ingredients.map((ingredient) => {
        return ingredient.ingredient;
      });

      recipe.relevance = 0;
      recipe.relevance = recipe.name.toLowerCase().includes(inputValue)
        ? recipe.relevance + 3
        : recipe.relevance;
      // recipe.relevance = recipe.appliance.toLowerCase().includes(inputValue) ? recipe.relevance + 2 : recipe.relevance;
      /* "gi" = search in all string + case insensitive https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/RegExp
       ** matchAll https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript/58828841#58828841 */
      recipe.relevance +=
        [
          ...recipe.description
            .toLowerCase()
            .matchAll(new RegExp(inputValue, "gi")),
        ].map((a) => a.index).length * 1;
      recipe.relevance +=
        [
          ...ingredients
            .toString()
            .toLowerCase()
            .matchAll(new RegExp(inputValue, "gi")),
        ].map((a) => a.index).length * 2;
      // indexes += [...ustensils.toString().toLowerCase().matchAll(new RegExp(inputValue, 'gi'))].map(a => a.index).length *2;

      if (recipe.relevance > 0) {
        return recipe;
      }
    });

  displayRecipes(filterRecipes);
  displayErrorMessage(filterRecipes);
};

const displayErrorMessage = (filterRecipes) => {
  // if filterRecipes is empty (no recipes), show error msg
  if (filterRecipes.length === 0) {
    document.querySelector(".no-cards").classList.replace("d-none", "d-flex");
  } else {
    document.querySelector(".no-cards").classList.replace("d-flex", "d-none");
  }
};

const tagsSearch = (recipes) => {
  const tagsContainer = document.querySelector(".tags");

  window.addTagBlue = (e) => {
    let tagValue = e.children[0].innerHTML;
    let tag = `<button class="btn btn-primary mr-3 px-3 py-1" onclick="removeTags(this)" aria-label="Close tag">${tagValue}<i aria-hidden="true" class="bi bi-x-circle ml-2" role="img"
  ></i></button>`;
    tagsContainer.innerHTML += tag;
    filterTags(recipes);
  };
  window.addTagRed = (e) => {
    let tagValue = e.children[0].innerHTML;
    let tag = `<button class="btn btn-danger mr-3 px-3 py-1" onclick="removeTags(this)" aria-label="Close tag">${tagValue}<i aria-hidden="true" class="bi bi-x-circle ml-2" role="img"
  ></i></button>`;
    tagsContainer.innerHTML += tag;
    filterTags(recipes);
  };
  window.addTagGreen = (e) => {
    let tagValue = e.children[0].innerHTML;
    let tag = `<button class="btn btn-success mr-3 px-3 py-1" onclick="removeTags(this)" aria-label="Close tag">${tagValue}<i aria-hidden="true" class="bi bi-x-circle ml-2" role="img"
  ></i></button>`;
    tagsContainer.innerHTML += tag;
    filterTags(recipes);
  };
};

const filterTags = (recipes) => {
  let tagsBlueArray = [],
    tagsGreenArray = [],
    tagsRedArray = [];
  // get all tags and push into different arrays
  const tagsBlue = document.querySelectorAll(".tags .btn-primary i");
  const tagsGreen = document.querySelectorAll(".tags .btn-success i");
  const tagsRed = document.querySelectorAll(".tags .btn-danger i");
  tagsBlue.forEach((tag) => {
    tagsBlueArray.push(tag.parentElement.innerText);
  });
  tagsGreen.forEach((tag) => {
    tagsGreenArray.push(tag.parentElement.innerText);
  });
  tagsRed.forEach((tag) => {
    tagsRedArray.push(tag.parentElement.innerText);
  });

  filterRecipes = recipes.filter((recipe) => {
    let ustensils = recipe.ustensils.map((ustensil) => {
      return ustensil;
    });

    let ingredients = recipe.ingredients.map((ingredient) => {
      return ingredient.ingredient;
    });

    // check if ingredients/appliance/ustensils includes all tags
    return (
      tagsBlueArray.every((elt) => ingredients.includes(elt)) &&
      tagsGreenArray.every((elt) => [recipe.appliance].includes(elt)) &&
      tagsRedArray.every((elt) => ustensils.includes(elt))
    );
  });

  displayRecipes(filterRecipes);
  displayErrorMessage(filterRecipes);
};

window.removeTags = (e) => {
  e.remove();
  // get all recipes and filter them by main search + tags
  filterRecipes = [...allRecipes];
  filterMainSearch(filterRecipes);
  filterTags(filterRecipes);
};

const displayRecipes = (recipes) => {
  let ustensilsArray = [],
    applianceArray = [],
    ingredientsArray = [];
  const templateElt = document.querySelector("#card_template");
  const container = document.querySelector("main .row");
  const dropdownUstenciles = document.querySelector(
    '.dropdown-menu[aria-labelledby="dropdownUstensiles"]'
  );
  const dropdownIngredients = document.querySelector(
    '.dropdown-menu[aria-labelledby="dropdownIngredients"]'
  );
  const dropdownAppareil = document.querySelector(
    '.dropdown-menu[aria-labelledby="dropdownAppareil"]'
  );
  container.innerText = "";
  dropdownUstenciles.innerText = "";
  dropdownIngredients.innerText = "";
  dropdownAppareil.innerText = "";

  recipes.forEach((recipe) => {
    const cardClone = document.importNode(templateElt.content, true);
    const titleElt = cardClone.querySelector(".card-title");
    const timeElt = cardClone.querySelector(".card-time");
    const listElt = cardClone.querySelector(".card-list");
    const descriptionElt = cardClone.querySelector(".card-description");

    titleElt.innerHTML = recipe.name;
    timeElt.innerHTML = `<i class="bi bi-clock"></i> ${recipe.time} min`;
    descriptionElt.innerHTML = recipe.description;
    container.append(cardClone);

    [recipe.ingredients].forEach((ingredient) => {
      let name, quantity, unit;

      ingredient.forEach((one) => {
        one.ingredient != undefined ? (name = one.ingredient) : (name = "");
        one.quantity != undefined
          ? (quantity = `: ${one.quantity}`)
          : (quantity = "");
        one.unit != undefined ? (unit = one.unit) : (unit = "");
        const li = `<li><span>${name}</span>${quantity}${unit}</li>`;
        listElt.innerHTML += li;

        ingredientsArray.push(name);
      });
    });
    // add list to card
    applianceArray.push(recipe.appliance);

    recipe.ustensils.forEach((ustensil) => {
      ustensilsArray.push(ustensil);
    });
  });

  let ingredientsSet = [...new Set(ingredientsArray)];
  ingredientsSet.forEach((ingredient) => {
    dropdownIngredients.innerHTML += `<li onclick="addTagBlue(this)" class="col-12 col-md-4"><a class="dropdown-item" href="#">${ingredient}</a></li>`;
  });

  let ustensilsSet = [...new Set(ustensilsArray)];
  ustensilsSet.forEach((ustensil) => {
    dropdownUstenciles.innerHTML += `<li onclick="addTagRed(this)" class="col-12 col-md-4"><a class="dropdown-item" href="#">${ustensil}</a></li>`;
  });

  let applianceSet = [...new Set(applianceArray)];
  applianceSet.forEach((appliance) => {
    dropdownAppareil.innerHTML += `<li onclick="addTagGreen(this)" class="col-12 col-md-4"><a class="dropdown-item" href="#">${appliance}</a></li>`;
  });

  tagsSearch(filterRecipes);
};
