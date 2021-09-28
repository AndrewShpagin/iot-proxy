/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-env jquery */

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { setPreffix, startCodeGeneration, endCodeGeneration } from './generators';
import 'highlight.js/styles/github.css';
import { download } from './assets';
import { helpShown, triggerHelpMode, currentProjectName, currentPageIndex, currentTabContentTagName } from './ui';
import { customBlocks, defDevs } from './custom-blocks';
import customToolbox from './toolbox.xml';
import { SandBox } from '../common/sandbox';
import { proj } from './gsprojects';
import { textByID, curLanguage, setLang } from './languages';

import defEn from '../public/translations/en.json';
import customEn from '../public/translations/custom_en.json';
import defRu from '../public/translations/ru.json';
import customRu from '../public/translations/custom_ru.json';

// eslint-disable-next-line import/no-unresolved
import baseJs from '!raw-loader!../public/base';
// eslint-disable-next-line import/no-unresolved
import gscript0 from '!raw-loader!../public/gscript';

const CryptoJS = require('crypto-js');

const seqPp = 'JHghhjJHgYiguuyuy786GhhjbYT6';

export function encStr(str) {
  return CryptoJS.AES.encrypt(str, seqPp);
}

export function hashStrShort(str) {
  return CryptoJS.MD5(str).toString().substring(0, 8);
}

export function decStr(str) {
  return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(str, seqPp));
}

const gscript = gscript0.substring(gscript0.indexOf('///'));

hljs.registerLanguage('javascript', javascript);
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
  window.w2ui.layout.el('bottom').textContent = consoleText;
  hljs.highlightBlock(window.w2ui.layout.el('bottom'));
  window.w2ui.layout.el('bottom').scrollTop += 50;
}
function appendTable(box) {
  const page = `${window.w2ui.layout.el('bottom').innerHTML}<div id="MyTableAppended" style="height: 400px"></div>`;
  window.w2ui.layout.content('bottom', page);
  const theGrid = window.w2ui.Result;
  if (theGrid)theGrid.destroy();
  const res = box.createTable();
  $('#MyTableAppended').w2grid(res);
  document.getElementById('grid_Result_records').scrollTop = 10000;
  window.w2ui.layout.el('bottom').scrollTop = 10000;
}
export function localRunScript() {
  const user = getUserData();
  const email = extract(user, '/email=');
  const password = extract(user, '/password=');
  const region = extract(user, '/region=');
  if (workspace && email.length && password.length && region.length) {
    triggerHelpMode(true);
    window.w2ui.layout.hide('main');
    curSandBox = new SandBox(email, password, region, currentProjectName(), 60000, false);
    setPreffix('myObject.');
    startCodeGeneration();
    const code = endCodeGeneration(window.Blockly.JavaScript.workspaceToCode(workspace));
    setPreffix('');
    window.w2ui.layout.el('bottom').textContent = '';
    consoleText = '';
    setTimeout(() => curSandBox.run(code, logCallback, box => appendTable(box)), 500);
  }
}

export function assignProject(text) {
  window.Blockly.Xml.clearWorkspaceAndLoadFromXml(window.Blockly.Xml.textToDom(text), workspace);
}

export function updateCodeCompletely() {
  startCodeGeneration();
  const code = endCodeGeneration(window.Blockly.JavaScript.workspaceToCode(workspace));
  let wholecode = getWholeCode(code);
  wholecode += `\n${gscript}`;

  const user = getUserData();
  const email = extract(user, '/email=');
  const password = extract(user, '/password=');
  const region = extract(user, '/region=');
  wholecode = wholecode.replace('useremail', email);
  wholecode = wholecode.replace('userpassword', password);
  wholecode = wholecode.replace('userregion', region);

  window.w2ui.layout.el('bottom').textContent = wholecode;
  return wholecode;
}
export function updateCode() {
  if (workspace) {
    startCodeGeneration();
    const code = endCodeGeneration(window.Blockly.JavaScript.workspaceToCode(workspace));
    if (!helpShown()) {
      const wholecode = getWholeCode(code);
      window.w2ui.layout.el('bottom').textContent = wholecode;
      hljs.highlightBlock(window.w2ui.layout.el('bottom'));
      window.w2ui.layout.el('bottom').innerHTML = `<span class="notranslate">${window.w2ui.layout.el('bottom').innerHTML}`;
    }
  }
}
const localesList = {};

function preloadBlocklyLocale(dst, src) {
  const add = src;
  Object.keys(add).forEach(key => {
    dst[key] = src[key];
  });
  return dst;
}

localesList.en = preloadBlocklyLocale(defEn, customEn);
localesList.ru = preloadBlocklyLocale(defRu, customRu);

function setupDroplists(devices) {
  const enc = {
    EW_POWER: ['power'],
    EW_TEMPERATURE: ['currentTemperature', 'temperature'],
    EW_HUMIDITY: ['currentHumidity', 'humidity'],
    EW_DEVICE: ['deviceid'],
    EW_MOTION: ['motion'],
    EW_BATTERY: ['battery'],
    EW_BRIGHTNESS: ['brightness'],
  };
  if (devices && Object.keys(devices).length) {
    customBlocks.forEach(block => {
      if ('args0' in block) {
        block.args0.forEach(arg => {
          if (arg.type === 'field_dropdown' && arg.name.substring(0, 3) === 'EW_') {
            arg.options = [];
            const check = enc[arg.name];
            Object.entries(devices).forEach(el => {
              const device = el[1];
              if (check.some(prop => prop in device)) {
                if (arg.name === 'EW_DEVICE' && device.switches) {
                  for (const s of device.switches) {
                    arg.options.push([`${device.name} [${s.outlet}]`, `'${device.deviceid}'/*${device.name}, [outlet:${s.outlet}]*/`]);
                  }
                } else arg.options.push([device.name, `'${device.deviceid}'/*${device.name}*/`]);
              }
            });
            if (arg.options.length === 0) {
              arg.options.push(['%{BKY_NODEVICES}', '0']);
            }
          }
        });
      }
    });
  } else {
    customBlocks.forEach(block => {
      if ('args0' in block) {
        block.args0.forEach(arg => {
          if (arg.type === 'field_dropdown' && arg.name.substring(0, 3) === 'EW_') {
            arg.options = [[defDevs, '0']];
          }
        });
      }
    });
  }
}

document.addEventListener('language', () => {
  const locName = curLanguage();
  const loc = localesList[locName];
  Object.keys(loc).forEach(key => {
    window.Blockly.Msg[key] = loc[key];
  });
  if (workspace) window.Blockly.svgResize(workspace);
  if (workspace) reinject();
});

setLang(curLanguage());

let devices = {};

export function getDevice(dev) {
  let d = dev;
  const p = dev.indexOf('/*');
  if (p > 0) d = dev.slice(0, p);
  if (d.length > 2) {
    if (d[0] === '\'')d = d.slice(1);
    if (d[d.length - 1] === '\'')d = d.slice(0, d.length - 1);
  }
  return devices[d];
}

export function clearDevices() {
  if (getUserData()) {
    localStorage.removeItem(`dev_${getUserEmail()}`);
    devices = {};
    if (workspace) reinject();
  }
}

export function setupDevicesGrid() {
  $().w2destroy('devGrid');
  const grid1 = {
    name: 'devGrid',
    columns: [
      { field: 'deviceid', caption: 'DeviceID', size: '20%' },
      { field: 'deviceName', caption: 'Name', size: '40%' },
      { field: 'temperature', caption: 'Temperature', size: '13%' },
      { field: 'humidity', caption: 'Humidity', size: '13%' },
      { field: 'online', caption: 'Online', size: '60px' },
      { field: 'state', caption: 'Switched ON', size: '60px' },
    ],
    records: [],
  };
  window.w2ui.layout.content('right', $().w2grid(grid1));
  window.w2ui.devGrid.clear();
  let i = 1;
  console.log(devices);
  Object.entries(devices).forEach(element => {
    const el = element[1];
    const obj = {
      recid: i,
      deviceid: el.deviceid,
      deviceName: el.name,
      online: el.online ? 'YES' : 'NO',
      state: el.switch === 'on' ? 'YES' : 'NO',
    };
    if (el) {
      if ('temperature' in el) obj.temperature = el.temperature / 100.0;
      if ('currentTemperature' in el) obj.temperature = el.currentTemperature;
      if ('humidity' in el) obj.humidity = el.humidity / 100.0;
      if ('currentHumidity' in el) obj.humidity = el.currentHumidity;
    }

    window.w2ui.devGrid.add(obj);
    i++;
  });
}

export function updateDevices(successCallback, failCallback) {
  const user = getUserData();
  if (user) {
    try {
      const locDevices = localStorage.getItem(`dev_${getUserEmail()}`);
      if (locDevices && locDevices.length)devices = JSON.parse(locDevices);
    } catch (error) {
      console.log(error);
    }
  } else {
    devices = {};
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
            console.log('Devices list updated!', dev1);
            devices = dev1;
            localStorage.setItem(`dev_${getUserEmail()}`, res);
            reinject();
            if (successCallback)successCallback();
          } else {
            console.log('Devices not changed');
          }
        } catch (error) {
          if (failCallback) failCallback();
          console.log(error);
        }
      } else if (failCallback) failCallback();
    });
  }
}

updateDevices();

function explainChatID(message, url) {
  window.w2alert(textByID(message)).ok(() => {
    window.open(url, '_blank');
  });
}

export function reinject() {
  const blocklyDiv = window.w2ui.layout.el('main');
  blocklyDiv.innerHTML = '';
  blocklyDiv.style.padding = '0px';
  if (!helpShown())window.w2ui.layout.el('bottom').style['white-space'] = 'pre';
  window.w2ui.layout.el('right').style['white-space'] = 'pre';

  localStorage.setItem(`dev_${getUserEmail()}`, JSON.stringify(devices));
  setupDroplists(devices);
  workspace = window.Blockly.inject(blocklyDiv, options);
  workspace.registerButtonCallback('viberCallback', () => explainChatID('BOTVIBER', 'viber://pa?chatURI=iotproxy'));
  workspace.registerButtonCallback('telegramCallback', () => explainChatID('BOTTELEGRAM', 'https://t.me/iotproxy_bot'));
  window.Blockly.defineBlocksWithJsonArray(customBlocks);
  // assignGenerators();

  function myUpdateFunction() {
    updateCode();
    const xml = window.Blockly.Xml.workspaceToDom(workspace);
    const xmlText = window.Blockly.Xml.domToText(xml);
    proj.storeProjectCompletely(currentPageIndex(), currentTabContentTagName(), xmlText);
  }
  window.w2ui.layout.on('resize', () => {
    setTimeout(() => window.Blockly.svgResize(workspace), 100);
  });
  workspace.addChangeListener(myUpdateFunction);
  const workspaceBlocks = proj.getCurrentProject().blocks;
  if (workspaceBlocks && workspaceBlocks.length) {
    window.Blockly.Xml.domToWorkspace(window.Blockly.Xml.textToDom(workspaceBlocks), workspace);
  }
  window.Blockly.svgResize(workspace);
}
