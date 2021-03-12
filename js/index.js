// import Recipes from './Recipes.class.js';

async function fetchRecipes() {
  const response = await fetch('./js/recipes.json');
  const recipes = await response.json();
  return recipes;
}

fetchRecipes().then(recipes => {
  const container = document.querySelector('main .row');
  const templateElt = document.querySelector('#card_template');

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
      let li, name, quantity, unit;
      ul = document.createElement("ul");

      array.forEach(object => {
        li = document.createElement("li");
        (object.ingredient != undefined) ? name = object.ingredient : name = '';
        (object.quantity != undefined) ? quantity = `: ${object.quantity}` : quantity = '';
        (object.unit != undefined) ? unit = object.unit : unit = '';
        li.innerHTML = `<span>${name}</span>${quantity}${unit}`;
        ul.append(li)
      })
    })
    listElt.append(ul)
  })

  // change dropdown icon on Open
  const dropdownElements = document.querySelectorAll('.btn-group')
  dropdownElements.forEach(dropdown => {
    dropdown.addEventListener('show.bs.dropdown', (e) => {
      e.target.children[0].classList.replace('bi-chevron-down', 'bi-chevron-up');
    })
    dropdown.addEventListener('hide.bs.dropdown', (e) => {
      e.target.children[0].classList.replace('bi-chevron-up', 'bi-chevron-down');
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