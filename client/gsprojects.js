/* eslint-disable import/no-cycle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */

import { googleApi } from './google';
import { removeDriveFileByName, getDriveFilesLike, readDriveFile, updateDriveFileByName, removeDriveFile } from './gdrive';
import { currentPageIndex, startSpin, stopSpin, insertPageIntoLayout, showPage } from './ui';
import { GsProject } from './gsproject';
import { reinject } from './workspace';

export class Projects {
  constructor() {
    this.openedProjects = [];
    this.needToSave = {};
    this.projectBase = 'iot-proxy-project-';
    this.toDeploy = {};
    this.isEmpty = true;

    document.addEventListener('loggedInGoogle', () => {
      console.log('event : loggedInGoogle');
      for (const [pidx, scriptText] of Object.entries(this.toDeploy)) {
        this.deploySigned(Number.parseInt(pidx, 10), scriptText);
      }
      this.toDeploy = {};
      /// try to read projects from the Google Drive
      getDriveFilesLike(this.projectBase, res => {
        console.log('getDriveFilesLike, id', res);
        res.forEach(el => {
          readDriveFile(el.id, file => {
            try {
              const obj = JSON.parse(file);
              this.tryToAddToProjects(obj);
            } catch (err) {
              console.log(err);
            }
          });
        });
      });
    });

    document.addEventListener('signInFailed', () => {
      this.toDeploy = {};
    });

    setInterval(() => {
      if (googleApi.authorized()) {
        for (const [name, str] of Object.entries(this.needToSave)) {
          console.log('stored project to GDrive', name);
          updateDriveFileByName(name, str);
        }
        this.needToSave = {};
      }
    }, 40000);
  }

  getEmptyPageIndex() {
    for (let i = 0; ; i++) {
      if (!this.openedProjects.find(el => el.page === i)) return i;
    }
  }

  getCurrentProject() {
    const pidx = currentPageIndex();
    let project = this.openedProjects.find(el => el.page === pidx);
    if (project) return project;
    const guid = this.getGuidForPageIndex(pidx);
    project = this.getProjectByGuid(guid);
    project.page = pidx;
    return project;
  }

  getCurrentProjectFilename() {
    const project = this.getCurrentProject();
    return `${this.projectBase}${project.guid}.json`;
  }

  tryToAddToProjects(obj) {
    const mod = obj;
    if ('guid' in mod && 'timestamp' in mod && mod.blocks && mod.blocks.length > 90) {
      if (!mod.name || mod.name.length === 0)mod.name = 'Project';
      if ('page' in mod) delete (mod.page);
      const exist = this.openedProjects.find(el => el.guid === mod.guid);
      if (exist) {
        let changed = false;
        if (mod.version > exist.version) {
          for (const [key, val] of Object.entries(mod)) {
            if (exist[key] !== val) {
              exist[key] = val;
              changed = true;
            }
          }
        }
        if (changed && exist.page === currentPageIndex()) {
          reinject();
        }
      } else {
        mod.page = this.getEmptyPageIndex();
        const project = new GsProject();
        for (const [key, val] of Object.entries(mod))project[key] = val;
        this.openedProjects.push(project);
        insertPageIntoLayout(mod.page);
      }
    }
  }

  convertOldProjects() {
    let nn = 0;
    for (let i = 0; i < 1000; i++) {
      const ws = `workspace_${i}`;
      const el = window.localStorage.getItem(ws);
      if (el) {
        nn = 0;
        if (el.length > 80) {
          console.log('old project found');
          const name = window.localStorage.getItem(`name_${i}`) || `Project_${i}`;
          const guid = this.getGuidForPageIndex(i);
          const project = this.getProjectByGuid(guid);
          project.blocks = ws;
          project.name = name;
        }
        window.localStorage.removeItem(ws);
        window.localStorage.removeItem(`name_${i}`);
        window.localStorage.removeItem(`Guid_${i}`);
      } else {
        nn++;
        if (nn > 10) break;
      }
    }
  }

  preloadProjectsFromLocalStorage() {
    Object.keys(localStorage).forEach(key => {
      if (key.substring(0, this.projectBase.length) === this.projectBase && key.endsWith('.json')) {
        console.log('local storage key:', key);
        try {
          const obj = JSON.parse(localStorage.getItem(key));
          if ('guid' in obj && (key !== `${this.projectBase}${obj.guid}.json` || obj.blocks.length < 90)) {
            localStorage.removeItem(key);
          } else this.tryToAddToProjects(obj);
        } catch (err) {
          console.log(err);
        }
      }
    });
    console.log('restored from local storage:', this.openedProjects);
  }

  getProjectByGuid(guid) {
    let project = this.openedProjects.find(el => el.guid === guid);
    if (!project) {
      project = new GsProject();
      const sobj = localStorage.getItem(guid);
      if (sobj) {
        const obj = JSON.parse(sobj);
        for (const [key, value] of Object.entries(obj)) project[key] = value;
        this.openedProjects.push(project);
      }
    }
    return project;
  }

  getProjectByPageIndex(pidx) {
    return this.getProjectByGuid(this.getGuidForPageIndex(pidx));
  }

  removeCompletelyByGuid(guid) {
    localStorage.removeItem(guid);
    if (guid) {
      const projId = `${this.projectBase}${guid}.json`;
      localStorage.removeItem(projId);
      if (googleApi.authorized()) {
        const project = this.getProjectByGuid(guid);
        if (project.script && project.script.scriptId) {
          removeDriveFile(project.script.scriptId, res => console.log('del script:', res), res => console.log('del script error:', res));
        }
        if (project.spreadsheet) {
          removeDriveFile(project.spreadsheet.spreadsheetId, res => console.log('del spreadsheet:', res), res => console.log('del spreadsheet error:', res));
        }
        if (projId in this.needToSave) delete (this.needToSave[projId]);
        removeDriveFileByName(projId);
      }
    }
    this.openedProjects = this.openedProjects.filter(el => el.guid !== guid);
  }

  getGuidForPageIndex(pidx) {
    let project = this.openedProjects.find(el => el.page === pidx);
    if (!project) {
      project = new GsProject();
      project.page = pidx;
      this.openedProjects.push(project);
    }
    return project.guid;
  }

  deploySigned(pidx, scriptText) {
    const guid = this.getGuidForPageIndex(pidx);
    const project = this.getProjectByGuid(guid);
    console.log('deploySigned', pidx, guid, project, this.openedProjects);
    if (project) {
      startSpin();
      project.scriptUpdatedCallback = () => {
        stopSpin();
        project.scriptUri = `https://script.google.com/home/projects/${project.script.scriptId}/edit`;
        console.log(project.scriptUri);
        window.open(project.spreadsheet.spreadsheetUrl, project.spreadsheet.spreadsheetUrl);
        window.open(project.scriptUri, project.scriptUri);
        // showPage(project.scriptUri, 60);
      };
      project.createOrUpdateGoogleScript(project.name, scriptText);
    }
  }

  storeCurrentProject() {
    const project = this.getCurrentProject();
    this.storeProjectCompletelyByGuid(project.guid, project.name, project.blocks, true);
  }

  storeProjectCompletelyByGuid(guid, pagename, blocks, force) {
    const project = this.getProjectByGuid(guid);
    const L1 = project.blocks ? project.blocks.length : -1;
    const L2 = blocks.length;
    if (L1 !== L2 || pagename !== project.name || force) {
      project.blocks = blocks;
      if ('version' in project && typeof (project.version) === 'number')project.version++;
      else project.version = 0;
      if (pagename) project.name = pagename;
      project.timestamp = Date.now();
      const { errorsCallback, sheetCreatedCallback, sheetCreationError, scriptUpdatedCallback, scriptUpdateError, text, page, ...rest } = project;
      const info = JSON.stringify(rest);
      this.needToSave[`${this.projectBase}${guid}.json`] = info;
      localStorage.setItem(`${this.projectBase}${guid}.json`, info);
    }
  }

  storeProjectCompletely(pidx, pagename, blocks) {
    const guid = this.getGuidForPageIndex(pidx);
    if (guid) {
      this.storeProjectCompletelyByGuid(guid, pagename, blocks);
    }
  }

  deployScript(pidx, scriptText) {
    if (googleApi.authorized()) this.deploySigned(pidx, scriptText);
    else {
      this.toDeploy[pidx] = scriptText;
      googleApi.clickedSignIn();
    }
  }
}

export const proj = new Projects();

console.log('Initial projects:', proj.openedProjects);
