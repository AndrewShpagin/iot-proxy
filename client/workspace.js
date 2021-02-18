/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import Blockly from 'blockly';
import { download, multiDownload } from './assets';
import './generators';
import Cookies from 'js-cookie';
import { openLoginPopup } from './ui';

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
  toolbox: '',
};

const blocks = 'custom-blocks.json';
const tools = 'toolbox.xml';
function loginData() {
  return Cookies.get('userlogindata');
}
function myBlocks() {
  return `${blocks}${loginData()}`;
}
export function injectBlockly() {
  console.log(loginData());
  multiDownload([myBlocks(), tools], response => {
    const blocklyDiv = w2ui.layout.el('top');
    blocklyDiv.style.padding = '0px';
    w2ui.layout.el('left').style['white-space'] = 'pre';
    w2ui.layout.el('main').style['white-space'] = 'pre';

    const customBlocks = JSON.parse(response[myBlocks()]);
    options.toolbox = response[tools];
    const workspace = Blockly.inject(blocklyDiv, options);
    Blockly.defineBlocksWithJsonArray(customBlocks);

    function myUpdateFunction(event) {
      const code = Blockly.JavaScript.workspaceToCode(workspace);
      w2ui.layout.el('left').textContent = code;
      const comm = `${loginData()}/runjscode/${encodeURI(code)}`;
      download(comm, response => { w2ui.layout.el('main').textContent = response; });
      const xml = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(xml);
      console.log('xmlText', xmlText);
      Cookies.set('Blockly_workspace', xmlText, { expires: 365 });
    }
    w2ui.layout.on('resize', event => {
      setTimeout(() => Blockly.svgResize(workspace), 100);
    });
    workspace.addChangeListener(myUpdateFunction);
    const workspaceBlocks = Cookies.get('Blockly_workspace');
    if (workspaceBlocks) {
      console.log(workspaceBlocks);
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
