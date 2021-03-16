import {  } from "module";

class ProjectsSpace {
  constructor(placement) {
    this.placement = placement;
    this.tabs = this.tabs;
  }

  closeTab(tabId) {
    checkClosable();
    if (this.tabs.active === tabId) {
      const tab = this.tabs.tabs.find(t => t.id !== tabId);
      this.tabs.click(tab.id);
    }
    const idx = tabId.substring(10);
    const content = window.localStorage.getItem(tabId);
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
              `<button class="w2ui-btn" onclick="delTabForever('${idx}');w2popup.close();">${textByID('DELFOREVER')}</button>` +
              `<button class="w2ui-btn" onclick="restoreTab('${idx}');w2popup.close();">${textByID('KEEPTAB')}</button>`,
        style: 'padding: 15px 20px 20px 20px',
        width: 580,
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
}

module.exports = { ProjectsSpace };
