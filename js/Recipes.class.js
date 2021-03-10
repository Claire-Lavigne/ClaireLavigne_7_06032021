export default class Recipes {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.servings = data.servings;
    this.ingredients = data.ingredients;
    this.time = data.time;
    this.description = data.description;
    this.appliance = data.appliance;
    this.ustencils = data.ustencils;
  }

  generateCard() {
    let card = `
    <div class="col mb-4">
      <div class="card h-100 text-dark bg-light">
        <img src="https://via.placeholder.com/380x180" class="card-img-top" alt="" />
        <div class="card-body">
          <h2 class="card-title">${this.name}</h2>
          <span><i class="bi bi-clock"></i> ${this.time} min</span>
          <ul class="ingredients-list"></ul>
          <p class="card-text">${this.description}</p>
        </div>
      </div>
    </div>
    `;
    return card;
  }
}