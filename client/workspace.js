/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import Blockly from 'blockly';
import { download, multiDownload } from './assets';
import './generators';
import Cookies from 'js-cookie';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { ewSimple } from '../common/eWeLinkSimple';
import 'highlight.js/styles/github.css';
import { openLoginPopup } from './ui';
import { customBlocks } from './custom-blocks';
import customToolbox from './toolbox.xml';
import './custom_render';

require('babel-core/register');
require('babel-polyfill');

console.log('eTest');
const eTest = new ewSimple('andrewshpagin@gmail.com', 'Andrew75', 'eu');
console.log('eTest1');
eTest.getDevice().then(res => {
  console.log(res);
});

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

const tools = 'toolbox.xml';
function loginData() {
  return Cookies.get('userlogindata');
}
function myBlocks() {
  return blocks;
}
function extract(path, key) {
  const idx = path.indexOf(key);
  if (idx >= 0) {
    let sub = path.substring(idx + key.length);
    const r = sub.indexOf('/');
    if (r > 0)sub = sub.substring(0, r);
    return sub;
  }
  return null;
}
let baseJs = '';
function getWholeCode(code) {
  const email = extract(loginData(), '/email=');
  const password = extract(loginData(), '/password=');
  const region = extract(loginData(), '/region=');
  let pre = baseJs.replace('useremail', email);
  pre = pre.replace('userpassword', password);
  pre = pre.replace('userregion', region);
  const rcode = code.trim().replace(/\n/g, '\n  ');
  return pre.replace('\'...functionBodyThere...\';', rcode);
}
export function injectBlockly() {
  const ioturl = `${loginData()}/devices/`;
  multiDownload(['base.js', ioturl], response => {
    const blocklyDiv = w2ui.layout.el('top');
    blocklyDiv.innerHTML = '';
    blocklyDiv.style.padding = '0px';
    w2ui.layout.el('left').style['white-space'] = 'pre';
    w2ui.layout.el('main').style['white-space'] = 'pre';
    baseJs = response['base.js'];

    const devices = JSON.parse(response[ioturl]);

    // options.toolbox = response[tools];

    customBlocks[0].args0[0].options = [];
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
        online: element[1].online,
        state: element[1].switch,
      });
      i++;
    });
    if (customBlocks[0].args0[0].options.length === 0) {
      customBlocks[0].args0[0].options.push(['You need to login', 'You need to login']);
    }
    // w2ui.layout.html('main').html = '';
    // w2ui.layout.html('main', $().w2grid(grid1));

    const workspace = Blockly.inject(blocklyDiv, options);
    Blockly.defineBlocksWithJsonArray(customBlocks);

    function myUpdateFunction(event) {
      const code = Blockly.JavaScript.workspaceToCode(workspace);
      const wholecode = getWholeCode(code);
      w2ui.layout.el('left').textContent = wholecode;
      hljs.highlightBlock(w2ui.layout.el('left'));
      // const comm = `${loginData()}/runjscode/${encodeURI(code)}`;
      // download(comm, response => { w2ui.layout.el('main').textContent = response; });
      const xml = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(xml);
      window.localStorage.setItem('Blockly_workspace', xmlText);
    }
    w2ui.layout.on('resize', event => {
      setTimeout(() => Blockly.svgResize(workspace), 100);
    });
    workspace.addChangeListener(myUpdateFunction);
    const workspaceBlocks = window.localStorage.getItem('Blockly_workspace');
    if (workspaceBlocks) {
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspaceBlocks), workspace);
    }
    Blockly.svgResize(workspace);
  });
}
if (loginData()) {
  injectBlockly();
} else {
  setTimeout(() => {
    w2alert('You may operate devices only after login. You need to provide email and password to your eWeLink account to access the devices.')
      .ok(() => {
        setTimeout(() => openLoginPopup(), 2000);
      });
  }, 2000);
  injectBlockly();
}
