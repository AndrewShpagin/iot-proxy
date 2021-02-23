/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
import Cookies from 'js-cookie';
import { injectBlockly } from './workspace';

export function downloadScript() {
  console.log('downloadScript');
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(window.localStorage.getItem('Blockly_workspace'))}`);
  element.setAttribute('download', 'project.ewelink.xml');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function openLoginPopup() {
  console.log('Try to login');
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
      record: {
        email: 'andrewshpagin@gmail.com',
      },
      actions: {
        Login() {
          Cookies.set('userlogindata',
            `/email=${w2ui.foo.get('Email').$el[0].value}/password=${w2ui.foo.get('Password').$el[0].value}/region=${w2ui.foo.get('Server').$el[0].value}`,
            { expires: 365 });
          console.log(Cookies.get('userlogindata'));
          w2popup.close();
          injectBlockly();
        },
        Cancel() { w2popup.close(); },
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

$(() => {
  const pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
  $('#layout').w2layout({
    name: 'layout',
    padding: 4,
    panels: [
      { type: 'top', size: '70%', resizable: true, style: `${pstyle}border-top: 0px;` },
      { type: 'left',
        size: '70%',
        resizable: true,
        style: pstyle,
        toolbar: {
          items: [
            { type: 'button', id: 'CopyGS', caption: 'Copy GS code to clipboard', img: 'icon-page', hint: 'Copy gs (Google Sheets) code to clipboard.' },
          ],
          onClick(event) {
            if (event.target === 'CopyGS') {
              const r = document.createRange();
              r.selectNode(w2ui.layout.el('left'));
              window.getSelection().removeAllRanges();
              window.getSelection().addRange(r);
              document.execCommand('copy');
              window.getSelection().removeAllRanges();
            }
          },
        },
      },
      { type: 'main', size: '30%', resizable: true, style: pstyle, name: 'devices', title: 'Devices:' },
    ],
  });
});

const grid1 = {
  name: 'devGrid',
  columns: [
    { field: 'deviceid', caption: 'DeviceID', size: '20%' },
    { field: 'deviceName', caption: 'Name', size: '40%' },
    { field: 'temperature', caption: 'Temperature', size: '13%' },
    { field: 'humidity', caption: 'Humidity', size: '13%' },
    { field: 'online', caption: 'Online', size: '60px' },
    { field: 'state', caption: 'State', size: '60px' },
  ],
  records: [],
};
$(() => {
  // initialization
  w2ui.layout.content('main', $().w2grid(grid1));
});

window.openLoginPopup = openLoginPopup;
window.downloadScript = downloadScript;
