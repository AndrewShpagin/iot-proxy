/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line camelcase
import text_en from '../public/translations/site_en.json';
// eslint-disable-next-line camelcase
import text_ru from '../public/translations/site_ru.json';

const langScope = {
  en: text_en,
  ru: text_ru,
};

export function setLang(language) {
  let lang = curLanguage();
  if (lang === 'ru')lang = 'en';
  else lang = 'ru';
  if (language && language.length) lang = language;
  window.localStorage.setItem('Language', lang);
  const culang = langScope[lang];
  document.querySelectorAll('*').forEach(node => {
    if (node.hasAttribute('tid')) {
      let inn = node.innerHTML;
      let idx = inn.indexOf('</i>');
      if (idx < 0)idx = 0; else idx += 4;
      inn = inn.substring(0, idx);
      node.innerHTML = inn + culang[node.getAttribute('tid')];
    }
  });
  const event = new Event('language');
  document.dispatchEvent(event);
}

export function textByID(id) {
  const culang = langScope[curLanguage()];
  return culang[id] || id;
}

if (!localStorage.getItem('autocountry')) {
  // eslint-disable-next-line no-undef
  $.get('https://api.ipdata.co?api-key=f58ae16e314a90471e213046735443ea0441711a4209d951125a9356',
    response => {
      const country = response.country_code;
      console.log(country);
      localStorage.setItem('autocountry', country);
      let needlang = 'en';
      if (country === 'UA' || country === 'RU') needlang = 'ru';
      if (curLanguage() !== needlang) {
        setLang(needlang);
      }
    }, 'jsonp');
}

export function curLanguage() {
  let lang = window.localStorage.getItem('Language');
  if (!lang)lang = 'en';
  return lang;
}

export function translateToCurrent(str) {
  for (const lang of Object.values(langScope)) {
    for (const [key, value] of Object.entries(lang)) {
      if (value === str) {
        return textByID(key);
      }
    }
  }
  return str;
}

export function translateToolbar(toolbar) {
  toolbar.items.forEach(el => {
    let str = el.text;
    let preffix = '';
    const ii = str.indexOf('</i>');
    if (ii >= 0) {
      preffix = str.substring(0, ii + 6);
      str = str.substring(ii + 6);
    }
    el.text = preffix + translateToCurrent(str);
    el.tooltip = translateToCurrent(el.tooltip);
  });
  toolbar.refresh();
}

window.setLang = setLang;
window.textByID = textByID;
window.curLanguage = curLanguage;
