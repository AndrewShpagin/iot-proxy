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
import 'highlight.js/styles/github.css';
import { openLoginPopup } from './ui';
import { customBlocks } from './custom-blocks';
import customToolbox from './toolbox.xml';
import { reg_custom } from './custom_render';

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
  oneBasedIndex: true,
  toolbox: customToolbox,
};

const tools = 'toolbox.xml';
function loginData() {
  return Cookies.get('userlogindata');
}
function myBlocks() {
  return blocks;
}
let baseJs = '';
const iot_server = 'http://iot-proxy.com';
function getWholeCode(code) {
  const pre = baseJs.replace('serverNameThere', `${iot_server}${encodeURI(loginData())}`);
  const rcode = code.trim().replace(/\n/g, '\n  ');
  return pre.replace('\'...functionBodyThere...\';', rcode);
}
reg_custom();
export function injectBlockly() {
  const ioturl = `/eWeLink${loginData()}/devices/`;
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
