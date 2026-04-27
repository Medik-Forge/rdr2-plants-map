const UKRAINIAN_PLANT_NAMES = {
  alaskan_ginseng: 'Аляскинський женьшень',
  american_ginseng: 'Американський женьшень',
  bay_bolete: 'Польський гриб',
  black_berry: 'Ожина',
  black_currant: 'Чорна смородина',
  burdock_root: 'Корінь лопуха',
  chanterelles: 'Лисички',
  common_bulrush: 'Очерет звичайний',
  creeping_thyme: 'Чебрець повзучий',
  desert_sage: 'Пустельна шавлія',
  english_mace: 'Англійська булава',
  evergreen_huckleberry: 'Вічнозелена чорниця',
  golden_currant: 'Золота смородина',
  hummingbird_sage: 'Шавлія колібрі',
  indian_tobacco: 'Індіанський тютюн',
  milkweed: 'Молочай',
  oleander_sage: 'Олеандрова шавлія',
  oregano: 'Орегано',
  parasol_mushroom: 'Гриб-парасолька',
  prairie_poppy: 'Прерійний мак',
  rams_head: 'Бараняча голова',
  red_raspberry: 'Червона малина',
  red_sage: 'Червона шавлія',
  vanilla_flower: 'Ванільна квітка',
  violet_snowdrop: 'Фіолетовий підсніжник',
  wild_carrots: 'Дика морква',
  wild_feverfew: 'Дика ромашка',
  wild_mint: 'Дика м’ята',
  wintergreen_berry: 'Ягода грушанки',
  yarrow: 'Деревій',
  harrietum: 'Гаррієтум'
};

function getPlantName(key) {
  return UKRAINIAN_PLANT_NAMES[key] || key.replaceAll('_', ' ');
}

function getCollectedKey(plantKey, markerIndex) {
  return `rdo_collected_plant_${plantKey}_${markerIndex}`;
}

class Plants {
  constructor(preliminary) {
    Object.assign(this, preliminary);

    this.markers = [];
    this.visible = false;

    this.createMenuItem();
    this.reinitMarker();

    this.onMap = false;
  }

  createMenuItem() {
    const list = document.getElementById('plants-list');
    if (!list) return;

    this.element = document.createElement('label');
    this.element.className = 'plant-option disabled';

    this.element.innerHTML = `
      <input type="checkbox" data-plant-key="${this.key}">
      <img src="./assets/images/icons/game/${this.key}.png" alt="">
      <span>${getPlantName(this.key)}</span>
    `;

    const checkbox = this.element.querySelector('input');

    checkbox.addEventListener('change', () => {
      this.onMap = checkbox.checked;
      PlantsCollection.layer.redraw();
    });

    list.appendChild(this.element);
  }

  reinitMarker() {
    this.markers = [];

    const markerSize = Settings.markerSize || 1;

    this.locations.forEach((_marker, index) => {
      const collectedKey = getCollectedKey(this.key, index);

      if (localStorage.getItem(collectedKey) === '1') {
        return;
      }

      const tempMarker = L.marker([_marker.x, _marker.y], {
        opacity: Settings.markerOpacity || 1,
        icon: L.icon({
          iconUrl: `assets/images/markers/${this.key}.png`,
          iconSize: [35 * markerSize, 45 * markerSize],
          iconAnchor: [17 * markerSize, 42 * markerSize],
          popupAnchor: [0, -28 * markerSize],
          shadowUrl: Settings.isShadowsEnabled ? 'assets/images/markers-shadow.png' : '',
          shadowSize: [35 * markerSize, 16 * markerSize],
          shadowAnchor: [10 * markerSize, 10 * markerSize],
        }),
      });

      tempMarker.plantKey = this.key;
      tempMarker.markerIndex = index;

      tempMarker.bindPopup(this.popupContent.bind(this, _marker, index), {
        minWidth: 260,
        maxWidth: 360,
      });

      this.markers.push(tempMarker);
    });
  }

  popupContent(_marker, index) {
    const plantName = getPlantName(this.key);
    const popup = document.createElement('div');

    popup.className = 'plant-popup';

    popup.innerHTML = `
      <h1>${plantName}</h1>
      <p>Познач цю рослину як зібрану. Вона зникне з карти до оновлення збору.</p>
      <button type="button">Зібрано</button>
      <small>Latitude: ${_marker.x} / Longitude: ${_marker.y}</small>
    `;

    popup.querySelector('button').addEventListener('click', () => {
      localStorage.setItem(getCollectedKey(this.key, index), '1');
      PlantsCollection.refresh();
      MapBase.map.closePopup();
    });

    if (!Settings.isDebugEnabled) {
      popup.querySelector('small').style.display = 'none';
    }

    return popup;
  }

  set onMap(state) {
    this.visible = state;

    PlantsCollection.markers = PlantsCollection.markers.filter(
      marker => marker.plantKey !== this.key
    );

    PlantsCollection.enabledCategories = PlantsCollection.enabledCategories.filter(
      key => key !== this.key
    );

    if (state) {
      PlantsCollection.markers = PlantsCollection.markers.concat(this.markers);
      PlantsCollection.enabledCategories.push(this.key);
    }

    PlantsCollection.layer.clearLayers();

    if (PlantsCollection.markers.length > 0) {
      PlantsCollection.layer.addLayers(PlantsCollection.markers);
    }

    if (this.element) {
      this.element.classList.toggle('disabled', !state);

      const checkbox = this.element.querySelector('input');
      if (checkbox) checkbox.checked = state;
    }
  }

  get onMap() {
    return this.visible;
  }
}

class PlantsCollection {
  static init() {
    this.layer = L.canvasIconLayer({ zoomAnimation: true });
    this.enabledCategories = [];
    this.markers = [];
    this.quickParams = [];
    this.locations = [];

    this.layer.addTo(MapBase.map);

    this.initControls();

    return Loader.promises['plants'].consumeJson((data) => {
      data.forEach((item) => {
        this.locations.push(new Plants(item));
        this.quickParams.push(item.key);
      });

      console.info('%c[Plants] Loaded all plants!', 'color: #bada55; background: #242424');

      setTimeout(() => {
        PlantsCollection.layer.redraw();
      }, 40);
    });
  }

  static initControls() {
    const resetButton = document.getElementById('reset-collected');
    const selectAllButton = document.getElementById('select-all-plants');
    const clearAllButton = document.getElementById('clear-all-plants');

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('rdo_collected_plant_')) {
            localStorage.removeItem(key);
          }
        });

        PlantsCollection.refresh();
      });
    }

    if (selectAllButton) {
      selectAllButton.addEventListener('click', () => {
        PlantsCollection.setAllPlantsVisible(true);
      });
    }

    if (clearAllButton) {
      clearAllButton.addEventListener('click', () => {
        PlantsCollection.setAllPlantsVisible(false);
      });
    }
  }

  static setAllPlantsVisible(state) {
    this.markers = [];
    this.enabledCategories = [];

    this.locations.forEach((plant) => {
      plant.visible = state;

      if (plant.element) {
        plant.element.classList.toggle('disabled', !state);

        const checkbox = plant.element.querySelector('input');
        if (checkbox) checkbox.checked = state;
      }

      if (state) {
        this.markers = this.markers.concat(plant.markers);
        this.enabledCategories.push(plant.key);
      }
    });

    this.layer.clearLayers();

    if (this.markers.length > 0) {
      this.layer.addLayers(this.markers);
    }

    setTimeout(() => {
      PlantsCollection.layer.redraw();
    }, 40);
  }

  static set onMap(state) {
    if (state) {
      this.layer.addTo(MapBase.map);
    } else {
      this.layer.remove();
    }

    PlantsCollection.setAllPlantsVisible(state);
  }

  static get onMap() {
    return true;
  }

  static onLanguageChanged() {}

  static onSettingsChanged() {
    this.refresh();
  }

  static refresh() {
    this.markers = [];
    this.enabledCategories = [];

    this.locations.forEach((plant) => {
      const wasVisible = plant.visible;

      plant.reinitMarker();
      plant.visible = wasVisible;

      if (wasVisible) {
        this.markers = this.markers.concat(plant.markers);
        this.enabledCategories.push(plant.key);
      }

      if (plant.element) {
        plant.element.classList.toggle('disabled', !wasVisible);

        const checkbox = plant.element.querySelector('input');
        if (checkbox) checkbox.checked = wasVisible;
      }
    });

    this.layer.clearLayers();

    if (this.markers.length > 0) {
      this.layer.addLayers(this.markers);
    }

    setTimeout(() => {
      PlantsCollection.layer.redraw();
    }, 40);
  }
}
