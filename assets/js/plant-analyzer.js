(function () {
  'use strict';

  const PLANTS = [
    { key: 'harrietum', name: 'Гарієтум лікарський' },
    { key: 'milkweed', name: 'Молочай' },
    { key: 'oleander', name: 'Олеандр' },
    { key: 'burdock_root', name: 'Корінь лопуха' },
    { key: 'creeping_thyme', name: 'Тимʼян повзучий' },
    { key: 'lobelia', name: 'Лобелія' }
  ];

  function turnEverythingOff() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('rdo.')) {
        localStorage.removeItem(key);
      }
    });

    localStorage.setItem('rdo.plants', 'true');
  }

  function getPlant(key) {
    if (!window.PlantsCollection || !PlantsCollection.locations) return null;
    return PlantsCollection.locations.find((plant) => plant.key === key);
  }

  function setPlant(key, state) {
    const plant = getPlant(key);
    if (!plant) return;

    plant.onMap = state;

    setTimeout(() => {
      if (PlantsCollection.layer) {
        PlantsCollection.layer.redraw();
      }
    }, 50);
  }

  function hideAllPlants() {
    PLANTS.forEach((plant) => setPlant(plant.key, false));
  }

  function showAllPlants() {
    PLANTS.forEach((plant) => setPlant(plant.key, true));
  }

  function renderMenu() {
    const menu = document.querySelector('.side-menu');
    if (!menu) return;

    menu.innerHTML = `
      <div class="custom-plant-menu">
        <div class="custom-plant-title">RDR2 PLANTS MAP</div>

        <div class="custom-plant-actions">
          <button id="custom-hide-all">Сховати все</button>
          <button id="custom-show-all">Показати все</button>
        </div>

        <div class="custom-plant-section-title">РОСЛИНИ</div>

        <div class="custom-plant-list">
          ${PLANTS.map((plant) => `
            <button class="custom-plant-button" data-plant="${plant.key}">
              ${plant.name}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('custom-hide-all').addEventListener('click', hideAllPlants);
    document.getElementById('custom-show-all').addEventListener('click', showAllPlants);

    document.querySelectorAll('.custom-plant-button').forEach((button) => {
      button.addEventListener('click', () => {
        hideAllPlants();
        setPlant(button.dataset.plant, true);
      });
    });
  }

  function init() {
    turnEverythingOff();

    setTimeout(() => {
      renderMenu();
      hideAllPlants();
    }, 1500);
  }

  if (window.Loader && Loader.mapModelLoaded) {
    Loader.mapModelLoaded.then(init);
  } else {
    window.addEventListener('load', init);
  }
})();
