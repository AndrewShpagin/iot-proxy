/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import { show } from './index';
import keys from './keys.json';

export class GoogleSignIn {
  constructor(CLIENT_ID, API_KEY, SCOPES, statusCallback, errorCallback) {
    console.log('GoogleSignIn');
    this.CLIENT_ID = CLIENT_ID;
    this.API_KEY = API_KEY;
    this.DISCOVERY_DOCS = ['https://script.googleapis.com/$discovery/rest?version=v1'];
    this.ready = false;
    this.signed = false;
    this.SCOPES = SCOPES;
    this.statusCallback = statusCallback;
    this.errorCallback = errorCallback;

    window.gapi.load('client:auth2', () => {
      console.log('client:auth2');
      window.gapi.client.init({
        apiKey: this.API_KEY,
        clientId: this.CLIENT_ID,
        discoveryDocs: this.DISCOVERY_DOCS,
        scope: this.SCOPES,
      }).then(() => {
        console.log('gapi initialized successfully');
        // Listen for sign-in state changes.
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(state => {
          console.log('gapi.auth2.getAuthInstance().isSignedIn.listen', state);
          this.signed = state;
          this.statusCallback(state);
        });
        // Handle the initial sign-in state.
        this.signed = window.gapi.auth2.getAuthInstance().isSignedIn.get();
        console.log('this.signed', this.signed);
        this.statusCallback(this.signed);
        this.ready = true;
      }, error => {
        console.log(JSON.stringify(error, null, 2));
        this.errorCallback(error);
      });
    });
  }

  clickedSignIn() {
    this.signed = false;
    window.gapi.auth2.getAuthInstance().signIn();
  }

  clickedSignOut() {
    window.gapi.auth2.getAuthInstance().signOut();
    this.signed = false;
  }

  authorized() {
    return this.signed;
  }

  readyToSignIn() {
    return this.signed && this.ready;
  }

  readyToSignOut() {
    return !this.signed && this.ready;
  }

  createOrUpdateScript(name, scriptText, readyCallback, errorCallback) {
    if (this.authorized()) {
      window.gapi.client.script.projects.create({
        resource: {
          title: name,
        },
      }).then(resp => window.gapi.client.script.projects.updateContent({
        scriptId: resp.result.scriptId,
        resource: {
          files: [{
            name,
            type: 'SERVER_JS',
            source: scriptText,
          }, {
            name: 'appsscript',
            type: 'JSON',
            source: '{"timeZone":"America/New_York","' +
                 'exceptionLogging":"CLOUD"}',
          }],
        },
      })).then(resp => {
        const { result } = resp;
        if (result.error) {
          errorCallback(result.error);
          return;
        }
        console.log(`https://script.google.com/d/${result.scriptId}/edit`);
        readyCallback({
          scriptId: result.scriptId,
          uri: `https://script.google.com/d/${result.scriptId}/edit`,
        });
      }).catch(error => {
        // The API encountered a problem.
        errorCallback(error);
      });
    }
  }
}

const googleApi = new GoogleSignIn(
  keys.CLIENT_ID,
  keys.API_KEY,
  'https://www.googleapis.com/auth/script.projects',
  signed => {
    console.log('signed', signed);
    if (signed) {
      show('gsignin', false);
      show('gsignout', true);
      $('#gsignout').on('click', () => {
        console.log('sign out click');
        googleApi.clickedSignOut();
      });
      googleApi.createOrUpdateScript('testscript', 'function fn(){}',
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        });
    } else {
      show('gsignin', true);
      show('gsignout', false);
      $('#gsignin').on('click', () => {
        console.log('sign in click');
        googleApi.clickedSignIn();
      });
    }
  },
  error => {
    console.log('Error:', JSON.stringify(error));
  },
);
