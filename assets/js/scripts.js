// FIX щоб не було помилки redefine
if (!Date.prototype.toISOUTCDateString) {
  Date.prototype.toISOUTCDateString = function () {
    return this.toISOString().split('T')[0];
  };
}

if (!String.prototype.filename) {
  String.prototype.filename = function (extension) {
    let s = this.replace(/\\/g, '/');
    s = s.substring(s.lastIndexOf('/') + 1);
    return extension ? s.replace(/[?#].+$/, '') : s.split('.')[0];
  };
}

function changeCursor() {
  const map = document.querySelector('.leaflet-grab');
  if (map) map.style.cursor = 'grab';
}

// заглушки
const Discoverable = { updateLayers() {}, onSettingsChanged() {} };
const Overlay = { onSettingsChanged() {} };
const Legendary = { quickParams: [], animals: [], onSettingsChanged() {} };
const Menu = { init() {}, reorderMenu() {}, updateTippy() {}, updateRangeTippy() {}, updateFancySelect() {} };
const FME = { update() {} };

document.addEventListener('DOMContentLoaded', function () {
  try {
    init();
  } catch (e) {
    console.error(e);
    alert('Map error. Check console.');
  }
});

function init() {
  SettingProxy.addSetting(Settings, 'language', { default: 'en' });

  MapBase.init();

  Language.init()
    .then(() => {
      changeCursor();
      return PlantsCollection.init();
    })
    .then(() => {
      Loader.resolveMapModelLoaded();
      window.loaded = true;
      console.info('[Clean Map] Plants loaded');
    });
}
