/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
// import './css/bootstrap-reboot.css';
// import './css/main.css';
import './workspace';
import { applyLocale } from './workspace';
import text_en from '../public/translations/site_en.json';
import text_ru from '../public/translations/site_ru.json';

const lang_scope = {
  en: text_en,
  ru: text_ru,
};

export const isMobile = {
  Android() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows() {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  },
};

function applyLanguage() {
  const lang = curLanguage();
  const culang = lang_scope[lang];
  // const plang = lang_scope[prevLang];
  document.querySelectorAll('*').forEach(node => {
    if (node.hasAttribute('tid')) {
      let inn = node.innerHTML;
      let idx = inn.indexOf('</i>');
      if (idx < 0)idx = 0; else idx += 4;
      inn = inn.substring(0, idx);
      node.innerHTML = inn + culang[node.getAttribute('tid')];
    }
    // if (plang) {
    //  for (const [key, value] of Object.entries(plang)) {
    //    const s = `>${value}<`;
    //    if (node.innerHTML.indexOf(s) >= 0) {
    //      node.innerHTML = node.innerHTML.replace(s, `>${culang[key]}<`);
    //    }
    //  }
    // }
  });
}
function setLang() {
  let lang = curLanguage();
  const plang = lang;
  if (lang === 'ru')lang = 'en';
  else lang = 'ru';
  window.localStorage.setItem('Language', lang);
  applyLanguage(plang);
  applyLocale(curLanguage());
}

applyLanguage();

export function textByID(id) {
  const culang = lang_scope[curLanguage()];
  return culang[id] || id;
}

export function curLanguage() {
  let lang = window.localStorage.getItem('Language');
  if (!lang)lang = 'ru';
  return lang;
}

window.isMobile = isMobile;
window.applyLanguage = applyLanguage;
window.setLang = setLang;
window.textByID = textByID;
window.curLanguage = curLanguage;
