class Plants {
  constructor(preliminary) {
    Object.assign(this, preliminary);

    this.element = document.createElement('div');
    this.element.className = 'collectible-wrapper';

    Object.assign(this.element.dataset, {
      help: 'item',
      type: this.key,
      tippyContent: Language.get(`map.plants.${this.key}.name`),
    });

    this.element.innerHTML = `
      <img class="collectible-icon" src="./assets/images/icons/game/${this.key}.png">
      <span class="collectible-text">
        <p class="collectible" data-text="map.plants.${this.key}.name"></p>
      </span>
    `;

    this.element.addEventListener('click', () => {
      this.onMap = !this.onMap;
      setTimeout(() => PlantsCollection.layer.redraw(), 40);
    });

    Language.translateDom(this.element);

    if (PlantsCollection.context) {
      PlantsCollection.context.appendChild(this.element);
    }

    this.reinitMarker();

    this.onMap = true;
  }

  reinitMarker() {
    this.markers = [];

    const markerSize = Settings.markerSize || 1;

    this.locations.forEach((_marker) => {
      const tempMarker = L.marker([_marker.x, _marker.y], {
        opacity: Settings.markerOpacity || 1,
        icon: L.divIcon({
          iconUrl: `assets/images/markers/${this.key}.png`,
          iconSize: [35 * markerSize, 45 * markerSize],
          iconAnchor: [17 * markerSize, 42 * markerSize],
          popupAnchor: [0, -28 * markerSize],
          shadowUrl: Settings.isShadowsEnabled ? 'assets/images/markers-shadow.png' : '',
          shadowSize: [35 * markerSize, 16 * markerSize],
          shadowAnchor: [10 * markerSize, 10 * markerSize],
        }),
      });

      tempMarker.bindPopup(this.popupContent.bind(this, _marker), {
        minWidth: 300,
        maxWidth: 400,
      });

      this.markers.push(tempMarker);
    });
  }

  popupContent(_marker) {
    const plantName = Language.get(`map.plants.${this.key}.name`);

    const description = Language.get('map.plants.desc').replace(
      /{plant}/,
      plantName.toLowerCase()
    );

    const popup = document.createElement('div');

    popup.innerHTML = `
      <h1>${plantName}</h1>
      <span class="marker-content-wrapper">
        <p>${description}</p>
      </span>
      <button class="btn btn-info remove-button full-popup-width">Remove</button>
      <small>Latitude: ${_marker.x} / Longitude: ${_marker.y}</small>
    `;

    const button = popup.querySelector('button');
    button.addEventListener('click', () => {
      this.onMap = false;
    });

    if (!Settings.isDebugEnabled) {
      popup.querySelector('small').style.display = 'none';
    }

    return popup;
  }

  set onMap(state) {
    if (state) {
      if (!PlantsCollection.enabledCategories.includes(this.key)) {
        PlantsCollection.markers = PlantsCollection.markers.concat(this.markers);
        PlantsCollection.enabledCategories.push(this.key);
      }

      PlantsCollection.layer.clearLayers();

      if (PlantsCollection.markers.length > 0) {
        PlantsCollection.layer.addLayers(PlantsCollection.markers);
      }

      if (this.element && this.element.parentElement) {
        this.element.querySelector('span').classList.remove('disabled');
      }
    } else {
      PlantsCollection.markers = PlantsCollection.markers.filter(
        (el) => !this.markers.includes(el)
      );

      PlantsCollection.enabledCategories = PlantsCollection.enabledCategories.filter(
        (el) => el !== this.key
      );

      PlantsCollection.layer.clearLayers();

      if (PlantsCollection.markers.length > 0) {
        PlantsCollection.layer.addLayers(PlantsCollection.markers);
      }

      if (this.element && this.element.parentElement) {
        this.element.querySelector('span').classList.add('disabled');
      }

      if (MapBase.map) {
        MapBase.map.closePopup();
      }
    }
  }

  get onMap() {
    return true;
  }
}

class PlantsCollection {
  static init() {
    this.layer = L.canvasIconLayer({ zoomAnimation: true });
    this.enabledCategories = [];
    this.markers = [];
    this.quickParams = [];
    this.locations = [];

    this.context = document.querySelector('.menu-hidden[data-type=plants]');

    this.layer.addTo(MapBase.map);

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

  static set onMap(state) {
    if (state) {
      if (this.markers.length > 0) {
        this.layer.addTo(MapBase.map);
      }
    } else {
      this.layer.remove();
    }

    if (this.context) {
      this.context.classList.toggle('disabled', !state);
    }

    PlantsCollection.locations.forEach((_plant) => {
      _plant.onMap = state;
    });
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
      plant.reinitMarker();
      plant.onMap = true;
    });

    this.layer.clearLayers();

    if (this.markers.length > 0) {
      this.layer.addLayers(this.markers);
    }
  }
}
