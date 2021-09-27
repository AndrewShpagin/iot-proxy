/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
/* eslint-env jquery */

import { show } from './index';
import keys from './keys.json';

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
          const event = new Event(state ? 'loggedInGoogle' : 'loggedOutGoogle');
          document.dispatchEvent(event);
        });
        // Handle the initial sign-in state.
        this.signed = window.gapi.auth2.getAuthInstance().isSignedIn.get();
        console.log('this.signed', this.signed);
        this.statusCallback(this.signed);
        this.ready = true;
        if (this.signed) {
          const event = new Event('loggedInGoogle');
          document.dispatchEvent(event);
        }
      }, error => {
        console.log(JSON.stringify(error, null, 2));
        this.errorCallback(error);
        const event = new CustomEvent('loginFailed', { detail: error });
        document.dispatchEvent(event);
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
  'https://www.googleapis.com/auth/drive.appdata ' +
  'https://www.googleapis.com/auth/drive.file ',
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
    const event = new CustomEvent('loginFailed', { detail: error });
    document.dispatchEvent(event);
  },
);
