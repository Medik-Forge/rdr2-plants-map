(function () {
  const PLANTS = [
    { key: 'harrietum', name: 'Гарієтум лікарський' },
    { key: 'milkweed', name: 'Молочай' },
    { key: 'burdock_root', name: 'Корінь лопуха' },
    { key: 'creeping_thyme', name: 'Тимʼян повзучий' }
  ];

  function clearOldMapState() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('rdo.') && key !== 'rdo.plants') {
        localStorage.removeItem(key);
      }
    });

    localStorage.setItem('rdo.plants', 'true');
  }

  function getPlant(key) {
    if (!window.PlantsCollection || !PlantsCollection.locations) return null;
    return PlantsCollection.locations.find((plant) => plant.key === key);
  }

  function hideAllPlants() {
    PLANTS.forEach((item) => {
      const plant = getPlant(item.key);
      if (plant) plant.onMap = false;
    });
  }

  function showPlant(key) {
    hideAllPlants();

    const plant = getPlant(key);
    if (plant) plant.onMap = true;

    setTimeout(() => {
      if (window.PlantsCollection && PlantsCollection.layer) {
        PlantsCollection.layer.redraw();
      }
    }, 100);
  }

  function showAllPlants() {
    PLANTS.forEach((item) => {
      const plant = getPlant(item.key);
      if (plant) plant.onMap = true;
    });

    setTimeout(() => {
      if (window.PlantsCollection && PlantsCollection.layer) {
        PlantsCollection.layer.redraw();
      }
    }, 100);
  }

  function buildMenu() {
    const menu = document.querySelector('.side-menu');
    if (!menu) return;

    menu.innerHTML = `
      <div class="custom-plant-menu">
        <div class="custom-title">RDR2 PLANTS MAP</div>

        <div class="custom-actions">
          <button id="plants-hide-all">Сховати все</button>
          <button id="plants-show-all">Показати все</button>
        </div>

        <div class="custom-section-title">РОСЛИНИ</div>

        <div class="custom-list">
          ${PLANTS.map((plant) => `
            <button class="custom-plant-btn" data-plant="${plant.key}">
              ${plant.name}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('plants-hide-all').onclick = hideAllPlants;
    document.getElementById('plants-show-all').onclick = showAllPlants;

    document.querySelectorAll('.custom-plant-btn').forEach((btn) => {
      btn.onclick = () => showPlant(btn.dataset.plant);
    });
  }

  function initCleanMenu() {
    clearOldMapState();

    const wait = setInterval(() => {
      if (
        window.PlantsCollection &&
        PlantsCollection.locations &&
        PlantsCollection.locations.length > 0
      ) {
        clearInterval(wait);
        buildMenu();
        hideAllPlants();
      }
    }, 300);
  }

  window.addEventListener('load', initCleanMenu);
})();
