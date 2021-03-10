import Recipes from './Recipes.class.js';

async function fetchRecipes() {
  const response = await fetch('./js/recipes.json');
  const recipes = await response.json();
  return recipes;
}

fetchRecipes().then(recipes => {

  let appliance = [],
    id = [],
    ingredients = [],
    servings = [],
    ustencils = [],
    array = [];


  const container = document.querySelector('main .row');

  const templateElt = document.querySelector('#card_template');
  recipes.forEach(keys => {
    appliance.push(keys.appliance);
    id.push(keys.id);

    ingredients.push(keys.ingredients);

    servings.push(keys.servings);
    ustencils.push(keys.ustencils);

    const cardClone = document.importNode(templateElt.content, true);
    const titleElt = cardClone.querySelector('.card-title');
    const timeElt = cardClone.querySelector('.card-time');
    const listElt = cardClone.querySelector('.card-list');
    const descriptionElt = cardClone.querySelector('.card-description');

    titleElt.innerHTML = keys.name;
    timeElt.innerHTML = `<i class="bi bi-clock"></i> ${keys.time} min`;
    listElt.innerHTML = '';
    descriptionElt.innerHTML = keys.description;
    container.append(cardClone);
  })


  const listElt = document.querySelectorAll('.card-list');
  let ul;
  ingredients.forEach(ingredient => {
    let li, name, quantity, unit;
    ul = document.createElement("ul");

    ingredient.forEach(item => {
      li = document.createElement("li");
      (item.ingredient != undefined) ? name = item.ingredient : name = '';
      (item.quantity != undefined) ? quantity = `: ${item.quantity}` : quantity = '';
      (item.unit != undefined) ? unit = item.unit : unit = '';
      li.innerHTML = `<span>${name}</span>${quantity}${unit}`;
      ul.append(li)
    })
    console.log(ul)
  })
  listElt.forEach(elt => {
    elt.innerHTML = ul.outerHTML;
  });



  // change dropdown icon on Open
  const dropdownElements = document.querySelectorAll('.btn-group')
  dropdownElements.forEach(dropdown => {
    dropdown.addEventListener('show.bs.dropdown', (e) => {
      console.log(e.target.children[0].classList[1])
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
/*
  photographers.forEach(data => {
    const photographer = new Photographer(data);
    main.innerHTML += photographer.generateArticle();
  })
*/
