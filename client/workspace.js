/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/extensions */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { setPreffix } from './generators';
import 'highlight.js/styles/github.css';
import { download } from './assets';
import { currentTabContentTag, helpShown, triggerHelpMode, currentProjectName } from './ui';
import { customBlocks, defDevs } from './custom-blocks';
import customToolbox from './toolbox.xml';
import { SandBox } from '../common/sandbox';

import defEn from '../public/translations/en.json';
import customEn from '../public/translations/custom_en.json';
import defRu from '../public/translations/ru.json';
import customRu from '../public/translations/custom_ru.json';
// eslint-disable-next-line import/no-unresolved
import baseJs from '!raw-loader!../public/base';
import gscript0 from '!raw-loader!../public/gscript';
import { curLanguage } from './index';

const CryptoJS = require('crypto-js');

const seqPp = 'JHghhjJHgYiguuyuy786GhhjbYT6';

function encStr(str) {
  return CryptoJS.AES.encrypt(str, seqPp);
}

function decStr(str) {
  return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(str, seqPp));
}

const gscript = gscript0.substring(gscript0.indexOf('///'));

hljs.registerLanguage('javascript', javascript);
const side = 'start';
const rtl = false;
const options = {
  comments: true,
  collapse: true,
  disable: true,
  grid:
    {
      spacing: 25,
      length: 3,
      colour: '#ccc',
      snap: true,
    },
  horizontalLayout: false,
  maxBlocks: Infinity,
  maxInstances: { test_basic_limit_instances: 3 },
  media: 'media/',
  oneBasedIndex: true,
  readOnly: false,
  rtl,
  move: {
    scrollbars: true,
    drag: true,
    wheel: false,
  },
  toolbox: customToolbox,
  toolboxPosition: 'start',
  toolboxOptions:
    {
      color: true,
      inverted: true,
    },
  zoom:
    {
      controls: true,
      wheel: true,
      startScale: 0.75,
      maxScale: 10,
      minScale: 0.25,
      scaleSpeed: 1.1,
    },
  renderer: 'pxt',
};

export function getUserData() {
  const log = window.localStorage.getItem('userlogindata');
  if (log) {
    return decStr(log);
  }
  return null;
}

export function getUserEmail() {
  const user = getUserData();
  return extract(user, '/email=');
}

export function storeUser(log) {
  window.localStorage.setItem('userlogindata', encStr(log));
}

function extract(path, key) {
  if (path) {
    const idx = path.indexOf(key);
    if (idx >= 0) {
      let sub = path.substring(idx + key.length);
      const r = sub.indexOf('/');
      if (r > 0)sub = sub.substring(0, r);
      return sub;
    }
  }
  return null;
}

function getWholeCode(code) {
  const user = getUserData();
  const email = extract(user, '/email=');
  const password = extract(user, '/password=');
  const region = extract(user, '/region=');
  let pre = baseJs.replace('useremail', email);
  pre = pre.replace('userpassword', password);
  pre = pre.replace('userregion', region);
  const rcode = code.trim().replace(/\n/g, '\n  ');
  return pre.replace('\'...functionBodyThere...\';', rcode);
}

let curSandBox = null;
let workspace = null;

let consoleText = '';
function logCallback(msg) {
  consoleText += `${msg}\n`;
  w2ui.layout.el('main').textContent = consoleText;
  hljs.highlightBlock(w2ui.layout.el('main'));
  w2ui.layout.el('main').scrollTop += 50;
}
function appendTable(box) {
  const page = `${w2ui.layout.el('main').innerHTML}<div id="MyTableAppended" style="height: 400px"></div>`;
  w2ui.layout.content('main', page);
  const theGrid = w2ui.Result;
  if (theGrid)theGrid.destroy();
  const res = box.createTable();
  $('#MyTableAppended').w2grid(res);
  document.getElementById('grid_Result_records').scrollTop = 10000;
  w2ui.layout.el('main').scrollTop = 10000;
}
export function localRunScript() {
  const user = getUserData();
  const email = extract(user, '/email=');
  const password = extract(user, '/password=');
  const region = extract(user, '/region=');
  if (workspace && email.length && password.length && region.length) {
    triggerHelpMode(true);
    w2ui.layout.hide('top');
    curSandBox = new SandBox(email, password, region, currentProjectName(), 60000, false);
    setPreffix('myObject.');
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    setPreffix('');
    w2ui.layout.el('main').textContent = '';
    consoleText = '';
    setTimeout(() => curSandBox.run(code, logCallback, box => appendTable(box)), 500);
  }
}

export function assignProject(text) {
  Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.textToDom(text), workspace);
}

export function updateCodeCompletely() {
  const code = Blockly.JavaScript.workspaceToCode(workspace);
  let wholecode = getWholeCode(code);
  wholecode += `\n\n\n\n\n\n\n\n\n\n\n\n${gscript}`;

  const user = getUserData();
  const email = extract(user, '/email=');
  const password = extract(user, '/password=');
  const region = extract(user, '/region=');
  wholecode = wholecode.replace('useremail', email);
  wholecode = wholecode.replace('userpassword', password);
  wholecode = wholecode.replace('userregion', region);

  w2ui.layout.el('main').textContent = wholecode;
}
export function updateCode() {
  if (workspace) {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    if (!helpShown()) {
      const wholecode = getWholeCode(code);
      w2ui.layout.el('main').textContent = wholecode;
      hljs.highlightBlock(w2ui.layout.el('main'));
      w2ui.layout.el('main').innerHTML = `<span class="notranslate">${w2ui.layout.el('main').innerHTML}`;
    }
  }
}
const localesList = {};
function applyLocaleNow(locObject) {
  Object.keys(locObject).forEach(key => {
    Blockly.Msg[key] = locObject[key];
  });
  if (workspace) Blockly.svgResize(workspace);
}
function preloadLocale(dst, src) {
  const add = src;
  Object.keys(add).forEach(key => {
    dst[key] = src[key];
  });
  return dst;
}

localesList.en = preloadLocale(defEn, customEn);
localesList.ru = preloadLocale(defRu, customRu);

function setupDroplists(devices) {
  const enc = {
    EW_POWER: 'power',
    EW_TEMPERATURE: 'currentTemperature',
    EW_HUMIDITY: 'currentHumidity',
    EW_DEVICE: 'deviceid',
  };
  if (devices && Object.keys(devices).length) {
    customBlocks.forEach(block => {
      if (block.hasOwnProperty('args0')) {
        block.args0.forEach(arg => {
          if (arg.type === 'field_dropdown' && arg.name.substring(0, 3) === 'EW_') {
            arg.options = [];
            const check = enc[arg.name];
            Object.entries(devices).forEach(el => {
              const device = el[1];
              if (device.hasOwnProperty(check)) {
                arg.options.push([device.name, `'${device.deviceid}'/*${device.name}*/`]);
              }
            });
            if (arg.options.length === 0) {
              arg.options.push(['%{BKY_NODEVICES}', '0']);
            }
          }
        });
      }
    });
    w2ui.devGrid.clear();
    let i = 1;
    Object.entries(devices).forEach(element => {
      w2ui.devGrid.add({
        recid: i,
        deviceid: element[1].deviceid,
        deviceName: element[1].name,
        temperature: element[1].currentTemperature,
        humidity: element[1].currentHumidity,
        online: element[1].online ? 'YES' : 'NO',
        state: element[1].switch === 'on' ? 'YES' : 'NO',
      });
      i++;
    });
  } else {
    customBlocks.forEach(block => {
      if (block.hasOwnProperty('args0')) {
        block.args0.forEach(arg => {
          if (arg.type === 'field_dropdown' && arg.name.substring(0, 3) === 'EW_') {
            arg.options = [[defDevs, '0']];
          }
        });
      }
    });
  }
}

export function applyLocale(locName) {
  const loc = localesList[locName];
  applyLocaleNow(loc);
  if (workspace) reinject();
}

applyLocale(curLanguage());
let devices = {};
const user = getUserData();
if (user) {
  try {
    const locDevices = localStorage.getItem(`dev_${getUserEmail()}`);
    if (locDevices && locDevices.length)devices = JSON.parse(locDevices);
  } catch (error) {
    console.log(error);
  }
}
if (user) {
  const sdata = `${user}/devices/`;
  const hv = Date.now().toString().slice(-6);
  const ioturl = `/xRet78uz${encodeURI(encStr(hv + sdata))}`;
  download(ioturl, res => {
    if (res.length > 128) {
      try {
        const dev1 = JSON.parse(res);
        if (JSON.stringify(dev1) !== JSON.stringify(devices)) {
          console.log('Devices lust updated!');
          devices = dev1;
          localStorage.setItem(`dev_${getUserEmail()}`, res);
          reinject();
        } else {
          console.log('Devices not changed');
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}

export function reinject() {
  const blocklyDiv = w2ui.layout.el('top');
  blocklyDiv.innerHTML = '';
  blocklyDiv.style.padding = '0px';
  if (!helpShown())w2ui.layout.el('main').style['white-space'] = 'pre';
  w2ui.layout.el('right').style['white-space'] = 'pre';

  localStorage.setItem(`dev_${getUserEmail()}`, JSON.stringify(devices));
  setupDroplists(devices);
  workspace = Blockly.inject(blocklyDiv, options);
  Blockly.defineBlocksWithJsonArray(customBlocks);
  // assignGenerators();

  function myUpdateFunction(event) {
    updateCode();
    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(xml);
    window.localStorage.setItem(currentTabContentTag(), xmlText);
  }
  w2ui.layout.on('resize', event => {
    setTimeout(() => Blockly.svgResize(workspace), 100);
  });
  workspace.addChangeListener(myUpdateFunction);
  const workspaceBlocks = window.localStorage.getItem(currentTabContentTag());
  if (workspaceBlocks) {
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspaceBlocks), workspace);
  }
  Blockly.svgResize(workspace);
}
