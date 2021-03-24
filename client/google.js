/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import { show } from './index';
import keys from './keys.json';
import { getDriveFiles, updateDriveFileByName, removeDriveFileByName } from './gdrive';

export class GoogleSignIn {
  constructor(CLIENT_ID, API_KEY, SCOPES, statusCallback, errorCallback) {
    console.log('GoogleSignIn');
    this.CLIENT_ID = CLIENT_ID;
    this.API_KEY = API_KEY;
    this.DISCOVERY_DOCS = [
      'https://script.googleapis.com/$discovery/rest?version=v1',
      'https://sheets.googleapis.com/$discovery/rest?version=v4',
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    ];
    this.ready = false;
    this.signed = false;
    this.SCOPES = SCOPES;
    this.statusCallback = statusCallback;
    this.errorCallback = errorCallback;
    this.onSignedTempCallback = null;

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
          if (state && this.onSignedTempCallback) this.onSignedTempCallback();
          this.onSignedTempCallback = null;
        });
        // Handle the initial sign-in state.
        this.signed = window.gapi.auth2.getAuthInstance().isSignedIn.get();
        console.log('this.signed', this.signed);
        this.statusCallback(this.signed);
        this.ready = true;
      }, error => {
        console.log(JSON.stringify(error, null, 2));
        this.errorCallback(error);
        this.onSignedTempCallback = null;
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
}

export const googleApi = new GoogleSignIn(
  keys.CLIENT_ID,
  keys.API_KEY,
  'https://www.googleapis.com/auth/script.projects ' +
  'https://www.googleapis.com/auth/spreadsheets ' +
  'https://www.googleapis.com/auth/drive',
  signed => {
    console.log('signed', signed);
    if (signed) {
      show('gsignin', false);
      show('gsignout', true);
      $('#gsignout').on('click', () => {
        console.log('sign out click');
        googleApi.clickedSignOut();
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
