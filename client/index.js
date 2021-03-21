/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */

import { getUserData } from './workspace';
import { GoogleSignIn } from './google';

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

export function show(el, state) {
  document.getElementById(el).style.display = state ? 'inherit' : 'none';
}
export function correctHeader() {
  if (getUserData()) {
    show('DEVLOGIN', false);
    show('LOGOUT', true);
  } else {
    show('DEVLOGIN', true);
    show('LOGOUT', false);
  }
}

correctHeader();

window.isMobile = isMobile;
window.correctHeader = correctHeader;
