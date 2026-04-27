Object.defineProperty(Date.prototype, 'toISOUTCDateString', {
  value: function () {
    return this.toISOString().split('T')[0];
  },
});

Object.defineProperty(String.prototype, 'filename', {
  value: function (extension) {
    let s = this.replace(/\\/g, '/');
    s = s.substring(s.lastIndexOf('/') + 1);
    return extension ? s.replace(/[?#].+$/, '') : s.split('.')[0];
  },
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');

  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function isLocalHost() {
  return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

function changeCursor() {
  const map = document.querySelector('.leaflet-grab');
  if (map) map.style.cursor = 'grab';
}

/*
  Заглушки, щоб map.js не ламався,
  якщо ми прибираємо зайві розділи.
*/
const Discoverable = {
  updateLayers() {},
  onSettingsChanged() {},
};

const Overlay = {
  onSettingsChanged() {},
};

const Legendary = {
  quickParams: [],
  animals: [],
  onSettingsChanged() {},
};

const Menu = {
  init() {},
  reorderMenu() {},
  updateTippy() {},
  updateRangeTippy() {},
};

document.addEventListener('DOMContentLoaded', function () {
  try {
    init();
  } catch (e) {
    console.error(e);
    alert('Map error. Check console.');
  }
});

function init() {
  const navLang = navigator.language;
  const langCodesMap = {
    'zh-CN': 'zh-Hans',
    'zh-SG': 'zh-Hans',
    'zh-HK': 'zh-Hant',
    'zh-TW': 'zh-Hant',
  };

  const mappedLanguage = langCodesMap[navLang] || navLang;

  SettingProxy.addSetting(Settings, 'language', {
    default: Language.availableLanguages.includes(mappedLanguage)
      ? mappedLanguage
      : 'en',
  });

  MapBase.init();

  Language.init()
    .then(() => {
      changeCursor();

      return PlantsCollection.init();
    })
    .then(() => {
      Loader.resolveMapModelLoaded();
      window.loaded = true;

      console.info('%c[Clean Map] Only plants loaded', 'color: #bada55; background: #242424');
    });
}
