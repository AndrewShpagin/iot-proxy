/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import Blockly from 'blockly';
import { download, multiDownload } from './assets';
import './generators';
import Cookies from 'js-cookie';

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

const blocklyArea = document.getElementById('blocklyArea');
const blocklyDiv = document.getElementById('blocklyDiv');
const textArea = document.getElementById('textarea');

const blocks = 'custom-blocks.json';
const tools = 'toolbox.xml';
function loginData() {
  return '/email=andrewshpagin@gmail.com/password=Andrew75/region=eu';
}
function myBlocks() {
  return `${blocks}${loginData()}`;
}

multiDownload([myBlocks(), tools], response => {
  const customBlocks = JSON.parse(response[myBlocks()]);
  options.toolbox = response[tools];
  const workspace = Blockly.inject(blocklyDiv, options);
  Blockly.defineBlocksWithJsonArray(customBlocks);

  function myUpdateFunction(event) {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    document.getElementById('textarea').textContent = code;
    const comm = `${loginData()}/runjscode/${encodeURI(code)}`;
    download(comm, response => { console.log(response); });
    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xml_text = Blockly.Xml.domToText(xml);
    Cookies.set('Blockly_workspace', xml_text, { expires: 365 });
  }
  const workspaceBlocks = Cookies.get('Blockly_workspace');
  console.log(workspaceBlocks);
  Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspaceBlocks), workspace);
  workspace.addChangeListener(myUpdateFunction);

  const onresize = e => {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    let element = blocklyArea;
    let x = 0;
    let y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = `${x}px`;
    blocklyDiv.style.top = `${y}px`;
    blocklyDiv.style.width = `${blocklyArea.offsetWidth}px`;
    blocklyDiv.style.height = `${blocklyArea.offsetHeight}px`;

    textArea.style.left = `${x}px`;
    textArea.style.top = `${y + blocklyArea.offsetHeight}px`;
    textArea.style.width = `${blocklyArea.offsetWidth}px`;
    textArea.style.height = `${textArea.offsetHeight}px`;

    Blockly.svgResize(workspace);
  };

  window.addEventListener('resize', onresize, false);
  onresize();
  Blockly.svgResize(workspace);
});
