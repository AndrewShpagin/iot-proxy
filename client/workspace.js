/* eslint-disable import/no-cycle */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import Blockly from 'blockly';
import './generators';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';

import { randomBytes, randomInt } from 'crypto';
import { multiDownload } from './assets';
import { currentTabContentTag, helpShown } from './ui';
import { customBlocks } from './custom-blocks';
import customToolbox from './toolbox.xml';
import './custom_render';

const CryptoJS = require('crypto-js');

const seqPp = 'JHghhjJHgYiguuyuy786GhhjbYT6';

function encStr(str) {
  return CryptoJS.AES.encrypt(str, seqPp);
}

function decStr(str) {
  return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(str, seqPp));
}

/*
console.log('eTest');
const eTest = new ewSimple('andrewshpagin@gmail.com', 'Andrew75', 'eu');
console.log('eTest1');
eTest.getDevice().then(res => {
  console.log(res);
});
*/

hljs.registerLanguage('javascript', javascript);

const options = {
  collapse: true,
  comments: true,
  disable: true,
  maxBlocks: Infinity,
  trashcan: true,
  horizontalLayout: false,
  toolboxPosition: 'start',
  css: true,
  media: 'https://blockly-demo.appspot.com/static/media/',
  rtl: false,
  scrollbars: true,
  sounds: true,
  renderer: 'custom_renderer',
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
    pinch: true,
  },
  oneBasedIndex: false,
  toolbox: customToolbox,
};

export function getUserData() {
  const log = window.localStorage.getItem('userlogindata');
  if (log) {
    return decStr(log);
  }
  return null;
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
let baseJs = '';
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
let workspace = null;
export function assignProject(text) {
  Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.textToDom(text), workspace);
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
export function injectBlockly() {
  let ioturl = '';
  const dlist = ['base.js'];
  const user = getUserData();
  if (user) {
    const sdata = `${user}/devices/`;
    const hv = Date.now().toString().slice(-6);
    console.log(hv);
    ioturl = `/xRet78uz${encodeURI(encStr(hv + sdata))}`;
    console.log(ioturl);
    dlist.push(ioturl);
  }
  multiDownload(dlist, response => {
    const blocklyDiv = w2ui.layout.el('top');
    blocklyDiv.innerHTML = '';
    blocklyDiv.style.padding = '0px';
    w2ui.layout.el('main').style['white-space'] = 'pre';
    w2ui.layout.el('right').style['white-space'] = 'pre';
    baseJs = response['base.js'];

    let devices = {};
    if (ioturl.length) devices = JSON.parse(response[ioturl]);

    customBlocks[0].args0[0].options = [];
    if (Object.keys(devices).length) {
      w2ui.devGrid.clear();
      let i = 1;
      Object.entries(devices).forEach(element => {
        customBlocks[0].args0[0].options.push([element[1].name, element[1].deviceid]);
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
    }
    // w2ui.devGrid.innerHTML = `<span class="notranslate">${w2ui.devGrid.innerHTML}`;
    if (customBlocks[0].args0[0].options.length === 0) {
      customBlocks[0].args0[0].options.push(['You need to login', 'You need to login']);
    }
    // w2ui.layout.html('main').html = '';
    // w2ui.layout.html('main', $().w2grid(grid1));

    workspace = Blockly.inject(blocklyDiv, options);
    Blockly.defineBlocksWithJsonArray(customBlocks);

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
  });
}
