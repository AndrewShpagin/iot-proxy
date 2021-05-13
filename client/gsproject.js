/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-cycle */
import { nanoid } from 'nanoid';
import { proj } from './gsprojects';
import { textByID } from './languages';
import { googleApi } from './google';

export class GsProject {
  constructor() {
    this.spreadsheet = null;
    this.script = null;
    this.name = 'Project';
    this.text = '';
    this.blocks = '';
    this.errorsCallback = null;
    this.sheetCreatedCallback = null;
    this.sheetCreationError = null;
    this.scriptUpdatedCallback = null;
    this.scriptUpdateError = null;
    this.version = 0;
    this.guid = nanoid();
    this.page = proj.getEmptyPageIndex();
  }

  // eslint-disable-next-line class-methods-use-this
  check403(error) {
    console.log('check403', error);
    if (('status' in error && error.status === 403) || ('code' in error && error.code === 403)) {
      // eslint-disable-next-line no-undef
      w2alert(textByID('ENABLEAPI')).ok(() => window.open('https://script.google.com/home/usersettings', '_blank'));
    }
  }

  updateScriptContentInGboogleScripts(scriptText) {
    if (this.script) {
      window.gapi.client.script.projects.updateContent({
        scriptId: this.script.scriptId,
        resource: {
          files: [{
            name: this.name,
            type: 'SERVER_JS',
            source: scriptText,
          }, {
            name: 'appsscript',
            type: 'JSON',
            source: '{"exceptionLogging":"CLOUD", "runtimeVersion": "V8"}',
          }],
        },
      }).then(result => {
        if (result.error) {
          console.error(result.error);
          if (this.errorsCallback) this.errorsCallback(result.error);
          if (this.scriptUpdateError) this.scriptUpdateError(result.error);
        } else {
          this.text = scriptText;
          if (this.scriptUpdatedCallback) this.scriptUpdatedCallback(result.result);
        }
      }).catch(error => {
        console.error('API error', error);
        // The API encountered a problem.
        this.check403(error);
        if (this.errorsCallback) this.errorsCallback(error);
      });
    }
  }

  createScriptForExistingSpeadsheet(name, scriptText) {
    if (scriptText !== this.text) {
      if (this.spreadsheet) {
        window.gapi.client.script.projects.create({
          resource: {
            title: name,
            parentId: this.spreadsheet.spreadsheetId,
          },
        }).then(result => {
          if (result.error) {
            console.error(result.error);
            if (this.errorsCallback) this.errorsCallback(result.error);
          } else {
            this.script = result.result;
            this.updateScriptContentInGboogleScripts(scriptText);
          }
        });
      }
    }
  }

  createOrUpdateGoogleScript(name1, scriptText) {
    let name = name1;
    this.name = name;
    if (name.length === 0)name = 'Project';
    console.log('createOrUpdateGoogleScript:', name, this);
    if (googleApi.authorized()) {
      if (!this.spreadsheet) {
        const request = window.gapi.client.sheets.spreadsheets.create({}, {
          properties: {
            title: name,
          },
        });
        request.then(response => {
          this.spreadsheet = response.result;
          this.createScriptForExistingSpeadsheet(name, scriptText);
        }, error => {
          this.check403(error);
        });
      } else if (!this.script) {
        this.createScriptForExistingSpeadsheet(name, scriptText);
      } else {
        this.updateScriptContentInGboogleScripts(scriptText);
      }
    }
  }
}
