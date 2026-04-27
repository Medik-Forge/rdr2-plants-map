const Language = {
  data: {},
  availableLanguages: ['en', 'uk', 'ru'],
  progress: {},

  init: function () {
    const langs = ['en'];

    if (Settings.language && Settings.language !== 'en') {
      langs.push(Settings.language);
    }

    const fetchTranslations = langs.map(async language => {
      const response = await fetch(
        `./langs/${language.replace('-', '_')}.json?nocache=${nocache}&date=${new Date().toISOUTCDateString()}`
      );

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} on ${response.url}`);
      }

      const json = await response.json();
      Language.data[language] = json;
    });

    return Promise.all(fetchTranslations).then(() => {
      this.setMenuLanguage();
    });
  },

  get: function (transKey, optional) {
    let translation = false;

    if (Language.data[Settings.language] && Language.data[Settings.language][transKey]) {
      translation = Language.data[Settings.language][transKey];
    } else if (Language.data.en && Language.data.en[transKey]) {
      translation = Language.data.en[transKey];
    } else {
      translation = optional ? '' : transKey;
    }

    return String(translation).replace(/\{([\w.]+)\}/g, (full, key) => {
      const result = this.get(key);
      return result === key ? `{${key}}` : result;
    });
  },

  translateDom: function (context) {
    Array.from((context || document).querySelectorAll('[data-text]')).forEach(element => {
      const string = Language.get(
        element.getAttribute('data-text'),
        element.dataset.textOptional
      );

      element.innerHTML = String(string).replace(/\{([\w.]+)\}/g, '---');
    });

    return context;
  },

  setMenuLanguage: function () {
    document.documentElement.setAttribute('lang', Settings.language || 'en');
    this.translateDom();
  },

  updateProgress: function () {
    return;
  },

  hasTranslation: function (string) {
    return this.get(string) !== string;
  },

  _postTranslation: function () {
    return;
  }
};
