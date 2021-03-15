// import Recipes from './Recipes.class.js';

async function fetchRecipes() {
  const response = await fetch('./js/recipes.json');
  const recipes = await response.json();
  return recipes;
}

fetchRecipes().then(recipes => {
  const container = document.querySelector('main .row');
  const templateElt = document.querySelector('#card_template');

  let arr = [];
  recipes.forEach(keys => {
    const cardClone = document.importNode(templateElt.content, true);
    const titleElt = cardClone.querySelector('.card-title');
    const timeElt = cardClone.querySelector('.card-time');
    const listElt = cardClone.querySelector('.card-list');
    const descriptionElt = cardClone.querySelector('.card-description');
    const dropdownIngredients = document.querySelector('.dropdown-menu[aria-labelledby="dropdownIngredients"]');
    const dropdownAppareil = document.querySelector('.dropdown-menu[aria-labelledby="dropdownAppareil"]');
    const dropdownUstenciles = document.querySelector('.dropdown-menu[aria-labelledby="dropdownUstensiles"]');
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
        
        // add list to btn
        dropdownIngredients.innerHTML += `<li><a class="dropdown-item" href="#">${name}</a></li>`;

      })
    })
    // add list to card
    listElt.append(ul)

    // add list to btns
    dropdownAppareil.innerHTML += `<li><a class="dropdown-item" href="#">${keys.appliance}</a></li>`;

    keys.ustensils.forEach(array => {
      dropdownUstenciles.innerHTML += `<li><a class="dropdown-item" href="#">${array}</a></li>`;
    })


  })

  const inputSearch = document.querySelector('input[type="search"]')
  const submitSearch = document.querySelector('form button');

  inputSearch.addEventListener('keyup', e => {
    const inputValue = inputSearch.value.toLowerCase();
    const cards = document.querySelectorAll('div.card');

    if (inputValue.length >= 3) {
      console.log(inputValue)

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
