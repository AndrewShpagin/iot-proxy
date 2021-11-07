/* eslint-disable max-len */
/* eslint-disable func-names */
/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
/* eslint-env jquery */

import { Spinner } from 'spin.js';
import { reinject, assignProject, getUserData, clearDevices, updateCode, storeUser, updateCodeCompletely, localRunScript, updateDevices, setupDevicesGrid } from './workspace';
import { correctHeader, isMobile } from './index';
import { textByID, translateToolbar } from './languages';
import { proj } from './gsprojects';

let helpTriggered = false;

export function helpShown() {
  return helpTriggered;
}

window.spinner = null;

export function startSpin() {
  if (!window.spinner) {
    window.spinner = new Spinner({
      lines: 9, // The number of lines to draw
      length: 8, // The length of each line
      width: 6, // The line thickness
      radius: 12, // The radius of the inner circle
      scale: 1, // Scales overall size of the spinner
      corners: 1, // Corner roundness (0..1)
      speed: 1, // Rounds per second
      rotate: 0, // The rotation offset
      animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#4CAF50', // CSS color or array of colors
      fadeColor: 'transparent', // CSS color or array of colors
      top: '50%', // Top position relative to parent
      left: '50%', // Left position relative to parent
      shadow: '0 0 1px transparent', // Box-shadow for the lines
      zIndex: 2000000000, // The z-index (defaults to 2e9)
      className: 'spinner', // The CSS class to assign to the spinner
      position: 'absolute', // Element positioning
    });
  }
  window.spinner.spin(document.documentElement);
  setTimeout(() => {
    stopSpin();
  }, 15000);
}

export function stopSpin() {
  window.spinner.stop();
}

export function triggerHelpMode(mode) {
  helpTriggered = mode;
  if (mode) {
    const item = window.w2ui.layout_bottom_toolbar.items[0];
    item.text = ticon('#000000', 'arrow-circle-left', 'TOPROJECTS');
    item.tooltip = '';
    window.w2ui.layout_bottom_toolbar.hide('%ID_COPYOPEN');
    window.w2ui.layout_bottom_toolbar.refresh();
  }
}

export function downloadScript() {
  const element = document.createElement('a');
  const project = proj.getCurrentProject();
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(project.blocks)}`);
  element.setAttribute('download', `${currentTabContentTagName()}.ewelink.xml`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
}

export function uploadScript() {
  if (!window.w2ui.upload) {
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
              const xml = b64DecodeUnicode($('#ProjectFile').data('selected')[0].content);
              const empty = getEmptyIndex();
              let prjName = $('#ProjectFile').data('selected')[0].name;
              let end = prjName.indexOf('.ewelink (');
              if (end === -1)end = prjName.indexOf('.ewelink.');
              if (end !== -1)prjName = prjName.substring(0, end);
              window.w2ui.layout_main_tabs.animateInsert('new', { id: `workspace_${empty}`, text: prjName, closable: true });
              setTimeout(() => {
                window.w2ui.layout_main_tabs.click(`workspace_${empty}`);
                setTimeout(() => {
                  proj.getCurrentProject().name = prjName;
                  assignProject(xml);
                  proj.storeCurrentProject();
                  checkClosable();
                }, 200);
              }, 600);
            }
          } catch (error) {
            console.log(error);
          }
          window.w2popup.close();
        },
        close() {
          window.w2popup.close();
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
      $(window.w2ui.upload.box).hide();
      event.onComplete = function () {
        $(window.w2ui.upload.box).show();
        window.w2ui.upload.resize();
      };
    },
    onOpen(event) {
      event.onComplete = function () {
        $('#w2ui-popup #upload').w2render('upload');
      };
    },
  });
}

export function logoutPopup() {
  clearDevices();
  window.localStorage.removeItem('userlogindata');
  correctHeader();
}

export function openLoginPopup() {
  if (!window.w2ui.foo) {
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
          storeUser(`/email=${window.w2ui.foo.get('Email').$el[0].value}/password=${window.w2ui.foo.get('Password').$el[0].value}/region=${window.w2ui.foo.get('Server').$el[0].value}`);
          window.w2popup.close();
          updateDevices(() => {
            window.w2alert(textByID('LOOGEDSUCCESSFULLY'));
          },
          () => {
            window.w2alert(textByID('LOGINFAILED'));
          });
          // reinject();
          correctHeader();
        },
        Cancel() {
          // window.localStorage.removeItem('userlogindata');
          window.w2popup.close();
          reinject();
        },
      },
    });
  }
  $().w2popup('open', {
    title: textByID('EWELINKLOGIN'),
    body: '<div id="form" style="width: 100%; height: 100%;"></div>',
    style: 'padding: 15px 0px 0px 0px',
    width: 350,
    height: 230,
    showMax: true,
    onToggle(event) {
      $(window.w2ui.foo.box).hide();
      event.onComplete = function () {
        $(window.w2ui.foo.box).show();
        window.w2ui.foo.resize();
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
  return proj.getEmptyPageIndex();
}
export function currentTabContentTagName() {
  return proj.getCurrentProject().name;
}

export function currentPageIndex() {
  if (typeof currentContentTab !== 'number') console.error(typeof currentContentTab);
  return currentContentTab;
}

export function switchToTabContent(tabName) {
  if (tabName.includes('workspace_')) {
    const tab = parseInt(tabName.substring(10), 10);
    if (tab === currentContentTab) {
      renameCurrentTab();
    } else {
      currentContentTab = tab;
      const project = proj.getProjectByPageIndex(tab);
      const text = project.blocks;
      assignProject(text || '<xml></xml>');
    }
  }
}

function askNewTabName() {
  const newName = `Project ${getEmptyIndex()}`;
  if (!window.w2ui.newTab) {
    $().w2form({
      name: 'newTab',
      style: 'border: 0px; background-color: transparent;',
      fields: [
        { name: 'Project', type: 'text', required: true },
      ],
      actions: {
        Create() {
          const prjName = window.w2ui.newTab.record.Project;
          window.w2popup.close();
          const empty = getEmptyIndex();
          window.w2ui.layout_main_tabs.animateInsert('new', { id: `workspace_${empty}`, text: prjName, closable: true });
          const project = proj.getProjectByPageIndex(empty);
          project.name = prjName;
          setTimeout(() => {
            window.w2ui.layout_main_tabs.click(`workspace_${empty}`);
            setTimeout(() => {
              assignProject('<xml></xml>');
              checkClosable();
            }, 200);
          }, 600);
        },
        Cancel() { window.w2popup.close(); },
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
      $(window.w2ui.newTab.box).hide();
      event.onComplete = function () {
        $(window.w2ui.newTab.box).show();
        window.w2ui.newTab.resize();
      };
    },
    onOpen(event) {
      window.w2ui.newTab.record.Project = newName;
      event.onComplete = function () {
        $('#w2ui-popup #form').w2render('newTab');
      };
    },
  });
}

export function currentProjectName() {
  return proj.getCurrentProject().name;
}

function renameCurrentTab() {
  if (!window.w2ui.renameTab) {
    $().w2form({
      name: 'renameTab',
      style: 'border: 0px; background-color: transparent;',
      fields: [
        { name: 'New name', type: 'text', required: true },
      ],
      actions: {
        Rename() {
          const prjName = window.w2ui.renameTab.record['New name'];
          window.w2popup.close();
          const tab = window.w2ui.layout_main_tabs.tabs.find(el => el.id === window.w2ui.layout_main_tabs.active);
          if (tab)tab.text = prjName;
          window.w2ui.layout_main_tabs.refresh(window.w2ui.layout_main_tabs.active);
          proj.getCurrentProject().name = prjName;
          proj.storeCurrentProject();
        },
        Cancel() { window.w2popup.close(); },
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
      $(window.w2ui.renameTab.box).hide();
      event.onComplete = function () {
        $(window.w2ui.renameTab.box).show();
        window.w2ui.newTab.resize();
      };
    },
    onOpen(event) {
      window.w2ui.renameTab.record['New name'] = currentTabContentTagName();
      event.onComplete = function () {
        $('#w2ui-popup #form').w2render('renameTab');
      };
    },
  });
}

function delTabForever(i) {
  console.log('delTabForever', i, proj);
  const guid = proj.getGuidForPageIndex(i);
  console.log('delTabForever', guid);
  if (guid)proj.removeCompletelyByGuid(guid);
  window.localStorage.removeItem(`workspace_${i}`);
  window.localStorage.removeItem(`name_${i}`);
  window.localStorage.removeItem(`Guid_${i}`);
}

function downloadTab(i) {
  const project = proj.getProjectByPageIndex(i);
  const name = project.name || 'Project';
  const content = project.blocks || '<xml></xml>';
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', `${name}.ewelink.xml`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function restoreTab(i) {
  const project = proj.getProjectByPageIndex(i);
  const { name } = project;
  window.w2ui.layout_main_tabs.insert('new', { id: `workspace_${i}`, text: name || `Project ${i}`, closable: true });
  checkClosable();
}

window.downloadTab = downloadTab;
window.restoreTab = restoreTab;

function checkClosableImmediately() {
  if (window.w2ui.layout_main_tabs.tabs.length < 3) {
    window.w2ui.layout_main_tabs.tabs.forEach(element => {
      if (element.closable) {
        element.closable = false;
        window.w2ui.layout_main_tabs.refresh(element.id);
      }
    });
  } else {
    window.w2ui.layout_main_tabs.tabs.forEach(element => {
      if (element.id !== 'new' && !element.closable) {
        element.closable = true;
        window.w2ui.layout_main_tabs.refresh(element.id);
      }
    });
  }
}

function checkClosable() {
  if (window.w2ui.layout_main_tabs.tabs) {
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
  // w2ui.layout_main_tabs.click(`workspace_${i}`);
  if (window.w2ui.layout_main_tabs.active === tabId) {
    const tab = window.w2ui.layout_main_tabs.tabs.find(t => t.id !== tabId);
    window.w2ui.layout_main_tabs.click(tab.id);
  }
  const idx = Number.parseInt(tabId.substring(10), 10);
  console.log('closeTab', tabId, idx);
  const project = proj.getProjectByPageIndex(idx);
  const content = project.blocks;
  console.log('closed content:', project);
  if (content.length > 100) {
    $().w2popup('open', {
      title: 'Close the tab',
      body: '<div id="form" style="width: 100%; height: 100%;">' +
            `${textByID('CLOSETABWARN')}<br>` +
            `${textByID('POSSB1')}<br>` +
            `${textByID('POSSB2')}<br>` +
            `${textByID('POSSB3')}<br>` +
            `${textByID('POSSB4')}<br>` +
            '</div>',
      buttons:
            `<button class="w2ui-btn" onclick="downloadTab('${idx}');w2popup.close();">${textByID('CLOSEDOWNLOAD')}</button> ` +
            `<button class="w2ui-btn" onclick="w2popup.close();">${textByID('JUSTCLOSE')}</button>` +
            `<button class="w2ui-btn" onclick="delTabForever(${idx});w2popup.close();">${textByID('DELFOREVER')}</button>` +
            `<button class="w2ui-btn" onclick="restoreTab('${idx}');w2popup.close();">${textByID('KEEPTAB')}</button>`,
      style: 'padding: 15px 20px 20px 20px',
      width: 580,
      height: 250,
      onToggle(event) {
        $(window.w2ui.renameTab.box).hide();
        event.onComplete = function () {
          $(window.w2ui.closeTab.box).show();
          window.w2ui.newTab.resize();
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
  const item = window.w2ui.layout_bottom_toolbar.items[0];
  item.text = ticon('#000000', 'copy', 'COPYGS');
  item.hint = textByID('COPYGSHINT');
  window.w2ui.layout_bottom_toolbar.show('%ID_COPYOPEN');
  window.w2ui.layout_bottom_toolbar.refresh();
}

let jsShown = false;
let devShown = false;

function copyCode() {
  if (helpTriggered)removeHelp();
  else {
    window.w2ui.layout.show('bottom', true);
    jsShown = true;
    const r = document.createRange();
    updateCodeCompletely();
    r.selectNode(window.w2ui.layout.el('bottom'));
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
function hideJs() {
  window.w2ui.layout.hide('bottom');
  jsShown = false;
}
function deploy() {
  proj.deployScript(currentContentTab, updateCodeCompletely());
}
window.deploy = deploy;

function showSheetsMessage(panel) {
  const text = textByID('PLDONATE').replace('<a>', '<a href="https://www.patreon.com/AndrewShpagin" target="_blank">');
  window.w2ui.layout.message(panel, {
    body: `<div style="text-align: center">${text}</div>`,
    width: 700,
    height: 70,
    buttons:
      `<button class="w2ui-btn" onclick="hideJs(); w2ui.layout.message('${panel}'); scriptInfo();">${ticon('#000000', 'info', 'INSTRUCTIONS')}</button>` +
      `<button class="w2ui-btn" onclick="hideJs(); w2ui.layout.message('${panel}'); deploy();">${ticon('#4CAF50', 'table', 'OPENGSHEETS')}</button>` +
      `<button class="w2ui-btn" onclick="hideJs(); w2ui.layout.message('${panel}');">${ticon('#4CAF50', 'copy', 'COPYGS')}</button>` +
      `<button class="w2ui-btn" onclick="hideJs(); w2ui.layout.message('${panel}')">${textByID('CANCEL')}</button>`,
  });
}

/// Setup the layout

$(() => {
  const pstyle = 'padding: 0px;';
  $('#layout').w2layout({
    name: 'layout',
    padding: 4,
    panels: [
      { type: 'main',
        size: '70%',
        resizable: true,
        style: `${pstyle}border-top: 0px;`,
        content: '',
        toolbar: {
          items: [
            { type: 'button', id: '%ID_DEVICES', caption: ticon('#000000', 'microchip', 'DEVICES'), hint: textByID('DEVICES_HINT') },
            { type: 'button', id: '%ID_SAVESCENE', caption: ticon('#000000', 'download', 'SAVESCENE'), hint: textByID('SAVESCENE_HINT') },
            { type: 'button', id: '%ID_OPENSCENE', caption: ticon('#000000', 'upload', 'OPENSCENE'), hint: textByID('OPENSCENE_HINT') },
            // { type: 'button', id: '%ID_RUNSCRIPT', caption: ticon('#4CAF50', 'play', 'RUNSCRIPT'), hint: textByID('RUNSCRIPT_HINT') },
            // { type: 'button', id: '%ID_SHEDULE', caption: ticon('#000000', 'tasks', 'SHEDULE'), hint: textByID('SHEDULE_HINT') },
            { type: 'button', id: '%ID_GSHEETS', caption: ticon('#4CAF50', 'table', 'GSHEETS'), hint: textByID('GSHEETS_HINT') },
            { type: 'button', id: '%ID_JS', caption: ticon('#000000', 'code', 'JS'), hint: textByID('JS_HINT') },
            { type: 'button', id: '%ID_ACTIVES', caption: ticon('#504CAF', 'cloud', 'ACTIVES'), hint: textByID('ACTIVES_HINT') },
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
              showSheetsMessage('main');
              copyCode();
            }
            if (event.target === '%ID_ACTIVES') {
              window.open('https://script.google.com/home/triggers', '_blank');
            }
            if (event.target === '%ID_JS') {
              if (jsShown) window.w2ui.layout.hide('bottom');
              else window.w2ui.layout.show('bottom');
              jsShown = !jsShown;
            }
            if (event.target === '%ID_DEVICES') {
              if (devShown) window.w2ui.layout.hide('right');
              else {
                window.w2ui.layout.show('right');
                setupDevicesGrid();
              }
              devShown = !devShown;
            }
          },
        },
        tabs: {
          active: 'workspace_0',
          tabs: [
            { id: 'workspace_0', text: 'Project', closable: true },
            { id: 'new', text: '+', closable: false },
          ],
          onClick(event) {
            if (event.target === 'new') {
              addNewLayoutTab();
            } else {
              switchToTabContent(event.target);
            }
          },
          onClose(event) {
            closeTab(event.target);
            return true;
          },
        },
      },
      { type: 'bottom',
        size: '30%',
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
              showSheetsMessage('bottom');
            }
          },
        },
      },
      { type: 'right', size: isMobile.any() ? '75%' : '30%', resizable: true, style: pstyle, name: 'devices', title: 'Devices:' },
    ],
  });
  window.w2ui.layout.hide('bottom', true);
  window.w2ui.layout.hide('right', true);

  proj.preloadProjectsFromLocalStorage();
  proj.convertOldProjects();

  const uData = getUserData();
  if (!uData) {
    setTimeout(scriptInfo(), 800);
  }
  reinject();
  checkClosable();
});

export function insertPageIntoLayout(pidx) {
  const project = proj.getProjectByPageIndex(pidx);
  const { name } = project;
  const pid = `workspace_${pidx}`;
  if (proj.isEmpty) {
    window.w2ui.layout_main_tabs.tabs[0].id = pid;
    window.w2ui.layout_main_tabs.tabs[0].text = project.name;
    window.w2ui.layout_main_tabs.refresh();
    proj.isEmpty = false;
  } else {
    const exist = window.w2ui.layout_main_tabs.tabs.find(el => el.id === pid);
    if (!exist) {
      window.w2ui.layout_main_tabs.insert('new', { id: pid, text: name || `Project ${pidx}`, closable: true });
    }
    if (pidx === currentContentTab) {
      reinject();
    }
  }
}

export function removeHelp() {
  document.hideLeft();
  if (helpTriggered) {
    if (!getUserData()) {
      setTimeout(() => {
        window.w2alert(textByID('LOGINHINT')).ok(() => {
          setTimeout(() => openLoginPopup(), 2000);
        });
      }, 2000);
      reinject();
    }
    window.w2ui.layout.el('bottom').style['white-space'] = 'pre';
    helpTriggered = false;
    restoreToolbar();
    updateCode();
    window.w2ui.layout.sizeTo('main', '70%', true);
    window.w2ui.layout.sizeTo('bottom', '30%', true);
    window.w2ui.layout.hide('right', true);
    window.w2ui.layout.hide('bottom', true);
    window.w2ui.layout.show('main');
  }
}
function scriptInfo() {
  document.hideLeft();
  if (!helpTriggered) {
    triggerHelpMode(true);
    window.w2ui.layout.hide('right', true);
    window.w2ui.layout.hide('main', true);
    window.w2ui.layout.show('bottom', true);
    window.w2ui.layout.sizeTo('main', '0%', true);
    window.w2ui.layout.sizeTo('bottom', '100%', true);
    window.w2ui.layout.el('bottom').style['white-space'] = 'nowrap';
    window.w2ui.layout.load('bottom', 'slides/slideshow.html');
  }
}

export function showPage(uri, percent) {
  if (!helpTriggered) {
    triggerHelpMode(true);
    window.w2ui.layout.hide('right', true);
    window.w2ui.layout.show('bottom', true);
    window.w2ui.layout.sizeTo('main', `${100 - percent}%`, true);
    window.w2ui.layout.sizeTo('bottom', `${percent}%`, true);
    window.w2ui.layout.el('bottom').style['white-space'] = 'nowrap';
    console.log('showPage, uri', uri);
    window.w2ui.layout.load('bottom', uri);
  }
}
document.showPage = showPage;

export function forceSlideshow() {
  window.w2ui.layout.load('bottom', 'slides/slideshow.html');
}

document.addEventListener('language', () => {
  if (window.w2ui.layout_bottom_toolbar) translateToolbar(window.w2ui.layout_bottom_toolbar);
  if (window.w2ui.layout_main_toolbar) translateToolbar(window.w2ui.layout_main_toolbar);
  if (helpShown()) {
    forceSlideshow();
  }
});

document.refreshLayout = () => {
  window.w2ui.refresh();
};

window.openLoginPopup = openLoginPopup;
window.downloadScript = downloadScript;
window.uploadScript = uploadScript;
window.scriptInfo = scriptInfo;
window.removeHelp = removeHelp;
window.logoutPopup = logoutPopup;
window.delTabForever = delTabForever;
window.copyCode = copyCode;
window.hideJs = hideJs;
