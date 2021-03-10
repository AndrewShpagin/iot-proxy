/* eslint-disable func-names */
/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */

import { reinject, assignProject, getUserData, updateCode, storeUser, updateCodeCompletely, localRunScript } from './workspace';
import { textByID, translateToCurrent } from './index';

let helpTriggered = false;

export function helpShown() {
  return helpTriggered;
}
export function triggerHelpMode(mode) {
  helpTriggered = mode;
  if (mode) {
    const item = w2ui.layout_main_toolbar.items[0];
    item.text = ticon('#000000', 'arrow-circle-left', 'TOPROJECTS');
    item.tooltip = '';
    w2ui.layout_main_toolbar.hide('%ID_COPYOPEN');
    w2ui.layout_main_toolbar.refresh();
  }
}

export function downloadScript() {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(window.localStorage.getItem(currentTabContentTag()))}`);
  element.setAttribute('download', `${currentTabContentTagName()}.ewelink.xml`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function uploadScript() {
  if (!w2ui.upload) {
    $().w2form({
      name: 'upload',
      style: 'border: 0px; background-color: transparent;',
      formHTML:
        '<div class="w2ui-page page-0">' +
        '    <div class="w2ui-field">' +
        '        <label>Project file:</label>' +
        '        <div>' +
        '           <input name="ProjectFile" type="file" style="width: 280px"/>' +
        '        </div>' +
        '    </div>' +
        '</div>' +
        '<div class="w2ui-buttons">' +
        '    <button class="w2ui-btn" name="open">Open</button>' +
        '    <button class="w2ui-btn" name="close">Cancel</button>' +
        '</div>',
      fields: [
        { name: 'ProjectFile', type: 'file', options: { max: 1 } },
      ],
      actions: {
        open() {
          $('#file').w2field('file', {});
          try {
            if ($('#ProjectFile').data('selected').length) {
              const xml = atob($('#ProjectFile').data('selected')[0].content);
              const empty = getEmptyIndex();
              let prjName = $('#ProjectFile').data('selected')[0].name;
              let end = prjName.indexOf('.ewelink (');
              if (end === -1)end = prjName.indexOf('.ewelink.');
              if (end !== -1)prjName = prjName.substring(0, end);
              w2ui.layout_top_tabs.animateInsert('new', { id: `workspace_${empty}`, text: prjName, closable: true });
              window.localStorage.setItem(`name_${empty}`, prjName);
              setTimeout(() => {
                w2ui.layout_top_tabs.click(`workspace_${empty}`);
                setTimeout(() => {
                  assignProject(xml);
                  checkClosable();
                }, 200);
              }, 600);
            }
          } catch (error) {
            console.log(error);
          }
          w2popup.close();
        },
        close() {
          w2popup.close();
        },
      },
    });
  }
  $().w2popup('open', {
    title: 'Open project',
    showMax: true,
    body:
    '<div id="upload" style="width: 100%; height: 100%;"></div>' +
    '<div class="w2ui-centered">Please select the Blockly project file that you saved or downloaded previously. This is the file with .ewelink.xml extension. </div>',
    style: 'padding: 15px 0px 0px 0px',
    width: 480,
    height: 190,
    onToggle(event) {
      $(w2ui.upload.box).hide();
      event.onComplete = function () {
        $(w2ui.upload.box).show();
        w2ui.upload.resize();
      };
    },
    onOpen(event) {
      event.onComplete = function () {
        $('#w2ui-popup #upload').w2render('upload');
      };
    },
  });
}

export function openLoginPopup() {
  if (!w2ui.foo) {
    $().w2form({
      name: 'foo',
      style: 'border: 0px; background-color: transparent;',
      fields: [
        { name: 'Email', type: 'email', required: true },
        { name: 'Password', type: 'password', required: true },
        {
          name: 'Server',
          type: 'list',
          required: true,
          options: {
            items: [
              { id: 1, text: 'eu' },
              { id: 2, text: 'us' },
              { id: 3, text: 'cn' },
            ],
          },
        },
      ],
      actions: {
        Login() {
          storeUser(`/email=${w2ui.foo.get('Email').$el[0].value}/password=${w2ui.foo.get('Password').$el[0].value}/region=${w2ui.foo.get('Server').$el[0].value}`);
          w2popup.close();
          reinject();
        },
        Cancel() {
          window.localStorage.removeItem('userlogindata');
          w2popup.close();
          reinject();
        },
      },
    });
  }
  $().w2popup('open', {
    title: 'Login',
    body: '<div id="form" style="width: 100%; height: 100%;"></div>',
    style: 'padding: 15px 0px 0px 0px',
    width: 350,
    height: 230,
    showMax: true,
    onToggle(event) {
      $(w2ui.foo.box).hide();
      event.onComplete = function () {
        $(w2ui.foo.box).show();
        w2ui.foo.resize();
      };
    },
    onOpen(event) {
      event.onComplete = function () {
        $('#w2ui-popup #form').w2render('foo');
      };
    },
  });
}

let currentContentTab = 0;
function getEmptyIndex() {
  for (let i = 1; i < 10000; i++) {
    const ws = `workspace_${i}`;
    const el = window.localStorage.getItem(ws);
    if (!el) return i;
  }
  return 10000;
}
export function currentTabContentTagName() {
  const name = window.localStorage.getItem(`name_${currentContentTab}`);
  return name || 'Project';
}

export function currentTabContentTag() {
  return `workspace_${currentContentTab}`;
}

export function switchToTabContent(tabName) {
  if (tabName.includes('workspace_')) {
    const tab = parseInt(tabName.substring(10), 10);
    if (tab === currentContentTab) {
      renameCurrentTab();
    } else {
      const text = window.localStorage.getItem(tabName);
      assignProject(text || '<xml></xml>');
    }
    currentContentTab = tab;
  }
}
function askNewTabName() {
  const newName = `Project ${getEmptyIndex()}`;
  if (!w2ui.newTab) {
    $().w2form({
      name: 'newTab',
      style: 'border: 0px; background-color: transparent;',
      fields: [
        { name: 'Project', type: 'text', required: true },
      ],
      actions: {
        Create() {
          const prjName = w2ui.newTab.record.Project;
          w2popup.close();
          const empty = getEmptyIndex();
          w2ui.layout_top_tabs.animateInsert('new', { id: `workspace_${empty}`, text: prjName, closable: true });
          window.localStorage.setItem(`name_${empty}`, prjName);
          setTimeout(() => {
            w2ui.layout_top_tabs.click(`workspace_${empty}`);
            setTimeout(() => {
              assignProject('<xml></xml>');
              checkClosable();
            }, 200);
          }, 600);
        },
        Cancel() { w2popup.close(); },
      },
    });
  }
  $().w2popup('open', {
    title: 'New project',
    body: '<div id="form" style="width: 100%; height: 100%;"></div>',
    style: 'padding: 15px 0px 0px 0px',
    width: 350,
    height: 170,
    showMax: true,
    onToggle(event) {
      $(w2ui.newTab.box).hide();
      event.onComplete = function () {
        $(w2ui.newTab.box).show();
        w2ui.newTab.resize();
      };
    },
    onOpen(event) {
      w2ui.newTab.record.Project = newName;
      event.onComplete = function () {
        $('#w2ui-popup #form').w2render('newTab');
      };
    },
  });
}
export function currentProjectName() {
  return window.localStorage.getItem(`name_${currentContentTab}`);
}
function renameCurrentTab() {
  if (!w2ui.renameTab) {
    $().w2form({
      name: 'renameTab',
      style: 'border: 0px; background-color: transparent;',
      fields: [
        { name: 'New name', type: 'text', required: true },
      ],
      actions: {
        Rename() {
          const prjName = w2ui.renameTab.record['New name'];
          w2popup.close();
          const tab = w2ui.layout_top_tabs.tabs.find(el => el.id === w2ui.layout_top_tabs.active);
          if (tab)tab.text = prjName;
          w2ui.layout_top_tabs.refresh(w2ui.layout_top_tabs.active);
          window.localStorage.setItem(`name_${currentContentTab}`, prjName);
        },
        Cancel() { w2popup.close(); },
      },
    });
  }
  $().w2popup('open', {
    title: 'Rename the tab',
    body: '<div id="form" style="width: 100%; height: 100%;"></div>',
    style: 'padding: 15px 0px 0px 0px',
    width: 350,
    height: 170,
    showMax: true,
    onToggle(event) {
      $(w2ui.renameTab.box).hide();
      event.onComplete = function () {
        $(w2ui.renameTab.box).show();
        w2ui.newTab.resize();
      };
    },
    onOpen(event) {
      w2ui.renameTab.record['New name'] = currentTabContentTagName();
      event.onComplete = function () {
        $('#w2ui-popup #form').w2render('renameTab');
      };
    },
  });
}
function downloadTab(i) {
  let name = window.localStorage.getItem(`name_${i}`);
  if (!name)name = 'Project';
  const content = window.localStorage.getItem(`workspace_${i}`);
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', `${name}.ewelink.xml`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  window.localStorage.removeItem(`workspace_${i}`);
  window.localStorage.removeItem(`name_${i}`);
}
function restoreTab(i) {
  const name = window.localStorage.getItem(`name_${i}`);
  w2ui.layout_top_tabs.insert('new', { id: `workspace_${i}`, text: name || `Project ${i}`, closable: true });
  checkClosable();
}
window.downloadTab = downloadTab;
window.restoreTab = restoreTab;

function checkClosableImmediately() {
  if (w2ui.layout_top_tabs.tabs.length < 3) {
    w2ui.layout_top_tabs.tabs.forEach(element => {
      if (element.closable) {
        element.closable = false;
        w2ui.layout_top_tabs.refresh(element.id);
      }
    });
  } else {
    w2ui.layout_top_tabs.tabs.forEach(element => {
      if (element.id !== 'new' && !element.closable) {
        element.closable = true;
        w2ui.layout_top_tabs.refresh(element.id);
      }
    });
  }
}
function checkClosable() {
  if (w2ui.layout_top_tabs.tabs) {
    setTimeout(() => {
      checkClosableImmediately();
    }, 100);
    setTimeout(() => {
      checkClosableImmediately();
    }, 300);
    setTimeout(() => {
      checkClosableImmediately();
    }, 700);
  }
}
function closeTab(tabId) {
  checkClosable();
  // w2ui.layout_top_tabs.click(`workspace_${i}`);
  if (w2ui.layout_top_tabs.active === tabId) {
    const tab = w2ui.layout_top_tabs.tabs.find(t => t.id !== tabId);
    w2ui.layout_top_tabs.click(tab.id);
  }
  const idx = tabId.substring(10);
  const content = window.localStorage.getItem(tabId);
  if (content.length > 100) {
    $().w2popup('open', {
      title: 'Close the tab',
      body: '<div id="form" style="width: 100%; height: 100%;">' +
            'You are about to close the tab. There are three possibilities:<br>' +
            '1) Download the project from the tab and close it forever.<br>' +
            '2) Just close it, but it will it will appear again when you will refresh the page or visit us again.<br>' +
            '3) Keep the tab.<br>' +
            '</div>',
      buttons:
            `<button class="w2ui-btn" onclick="downloadTab('${idx}');w2popup.close();">Close and download</button> ` +
            '<button class="w2ui-btn" onclick="w2popup.close();">Just close</button>' +
            `<button class="w2ui-btn" onclick="restoreTab('${idx}');w2popup.close();">Keep the tab</button>`,
      style: 'padding: 15px 20px 20px 20px',
      width: 450,
      height: 250,
      onToggle(event) {
        $(w2ui.renameTab.box).hide();
        event.onComplete = function () {
          $(w2ui.closeTab.box).show();
          w2ui.newTab.resize();
        };
      },
      onOpen(event) {
        event.onComplete = function () {
          $('#w2ui-popup #form').w2render('closeTab');
        };
      },
    });
  }
}
function addNewLayoutTab() {
  askNewTabName();
}
function restoreToolbar() {
  const item = w2ui.layout_main_toolbar.items[0];
  item.text = ticon('#000000', 'copy', 'COPYGS');
  item.hint = textByID('COPYGSHINT');
  w2ui.layout_main_toolbar.show('%ID_COPYOPEN');
  w2ui.layout_main_toolbar.refresh();
}
function copyCode() {
  if (helpTriggered)removeHelp();
  else {
    const r = document.createRange();
    updateCodeCompletely();
    r.selectNode(w2ui.layout.el('main'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    updateCode();
  }
}
function ticon(color, icon, message) {
  return `<i style="color: ${color}; transform: scale(1.3);" class="fa fa-${icon}" aria-hidden="true"></i>  ${textByID(message)}`;
}
function showSheetsMessage(panel) {
  w2ui.layout.message(panel, {
    width: 400,
    height: 70,
    buttons:
      `<button class="w2ui-btn" onclick="w2ui.layout.message('${panel}'); scriptInfo();">${ticon('#000000', 'info', 'INSTRUCTIONS')}</button>` +
      `<button class="w2ui-btn" onclick="w2ui.layout.message('${panel}'); window.open('https://docs.google.com/spreadsheets/u/0/', '_blank');">${ticon('#4CAF50', 'table', 'OPENGSHEETS')}</button>` +
      `<button class="w2ui-btn" onclick="w2ui.layout.message('${panel}')">${textByID('CANCEL')}</button>`,
  });
}

/// Setup the layout
$(() => {
  const pstyle = 'padding: 0px;';
  $('#layout').w2layout({
    name: 'layout',
    padding: 4,
    panels: [
      { type: 'top',
        size: '70%',
        resizable: true,
        style: `${pstyle}border-top: 0px;`,
        content: '',
        toolbar: {
          items: [
            { type: 'button', id: '%ID_SAVESCENE', caption: ticon('#000000', 'download', 'SAVESCENE'), hint: textByID('SAVESCENE_HINT') },
            { type: 'button', id: '%ID_OPENSCENE', caption: ticon('#000000', 'upload', 'OPENSCENE'), hint: textByID('OPENSCENE_HINT') },
            { type: 'button', id: '%ID_RUNSCRIPT', caption: ticon('#4CAF50', 'play', 'RUNSCRIPT'), hint: textByID('RUNSCRIPT_HINT') },
            { type: 'button', id: '%ID_SHEDULE', caption: ticon('#000000', 'tasks', 'SHEDULE'), hint: textByID('SHEDULE_HINT') },
            { type: 'button', id: '%ID_GSHEETS', caption: ticon('#4CAF50', 'table', 'GSHEETS'), hint: textByID('GSHEETS_HINT') },
          ],
          onClick(event) {
            if (event.target === '%ID_SAVESCENE') {
              downloadScript();
            }
            if (event.target === '%ID_OPENSCENE') {
              uploadScript();
            }
            if (event.target === '%ID_RUNSCRIPT') {
              localRunScript();
            }
            if (event.target === '%ID_GSHEETS') {
              showSheetsMessage('top');
              copyCode();
              // window.open('https://docs.google.com/spreadsheets/u/0/', '_blank');
            }
          },
        },
        tabs: {
          active: 'workspace_0',
          tabs: [
            { id: 'workspace_0', text: currentTabContentTagName(), closable: true },
            { id: 'new', text: '+', closable: false },
          ],
          onClick(event) {
            if (event.target === 'new') {
              addNewLayoutTab();
            } else {
              switchToTabContent(event.target);
              // this.owner.content('top', event);
            }
          },
          onClose(event) {
            closeTab(event.target);
            return true;
          },
        },
      },
      { type: 'main',
        size: '70%',
        resizable: true,
        style: pstyle,
        toolbar: {
          items: [
            { type: 'button', id: '%ID_COPYGS', caption: ticon('#000000', 'copy', 'COPYGS'), hint: textByID('COPYGSHINT') },
            { type: 'button', id: '%ID_COPYOPEN', caption: ticon('#4CAF50', 'table', 'COPYOPEN'), hint: textByID('COPYOPENHINT') },
          ],
          onClick(event) {
            if (event.target === '%ID_COPYGS') {
              copyCode();
            }
            if (event.target === '%ID_COPYOPEN') {
              copyCode();
              window.open('https://docs.google.com/spreadsheets/u/0/', '_blank');
            }
          },
        },
      },
      { type: 'right', size: '30%', resizable: true, style: pstyle, name: 'devices', title: 'Devices:' },
    ],
  });
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
  w2ui.layout.content('right', $().w2grid(grid1));
  const uData = getUserData();
  if (uData) {
    reinject();
  } else {
    reinject();
    setTimeout(scriptInfo(), 800);
  }
  let nn = 0;
  for (let i = 1; i < 1000; i++) {
    const ws = `workspace_${i}`;
    const el = window.localStorage.getItem(ws);
    if (el) {
      nn = 0;
      if (el.length > 80) {
        const name = window.localStorage.getItem(`name_${i}`);
        w2ui.layout_top_tabs.insert('new', { id: `workspace_${i}`, text: name || `Project ${i}`, closable: true });
      } else {
        window.localStorage.removeItem(ws);
      }
    } else {
      nn++;
      if (nn > 10) break;
    }
  }
  checkClosable();
});

function removeHelp() {
  if (helpTriggered) {
    if (!getUserData()) {
      setTimeout(() => {
        w2alert('You may operate devices only after getting access to eWeLink devices. You need to provide email, password and region. This App never stores the data outside your computer. The provided information used only to get list of devices within this application.')
          .ok(() => {
            setTimeout(() => openLoginPopup(), 2000);
          });
      }, 2000);
      reinject();
    }
    w2ui.layout.el('main').style['white-space'] = 'pre';
    helpTriggered = false;
    restoreToolbar();
    updateCode();
    w2ui.layout.show('right');
    w2ui.layout.show('top');
  }
}
function scriptInfo() {
  if (!helpTriggered) {
    triggerHelpMode(true);
    w2ui.layout.hide('right');
    w2ui.layout.hide('top');
    w2ui.layout.el('main').style['white-space'] = 'nowrap';
    w2ui.layout.load('main', 'slides/slideshow.html');
  }
}

function translateToolbar(toolbar) {
  toolbar.items.forEach(el => {
    let str = el.text;
    let preffix = '';
    const ii = str.indexOf('</i>');
    if (ii >= 0) {
      preffix = str.substring(0, ii+6);
      str = str.substring(ii+6);
    }
    el.text = preffix + translateToCurrent(str);
    el.tooltip = translateToCurrent(el.tooltip);
  });
  toolbar.refresh();
}

export function refreshui() {
  translateToolbar(w2ui.layout_main_toolbar);
  translateToolbar(w2ui.layout_top_toolbar);
}

window.openLoginPopup = openLoginPopup;
window.downloadScript = downloadScript;
window.uploadScript = uploadScript;
window.scriptInfo = scriptInfo;
window.removeHelp = removeHelp;
