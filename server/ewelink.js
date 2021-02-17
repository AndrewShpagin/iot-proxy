/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-await-in-loop */
/* eslint-disable new-cap */
const ewelink = require('ewelink-api');
const { getUser, UserDevices, deviceInfo } = require('./user');

async function getDevList(login) {
  const res = [];
  try {
    const user = getUser(login);
    const connection = await user.getConnection();
    if (connection) {
      await user.sendGetDevices();
      for (const [key, value] of Object.entries(user.devices)) {
        res.push({
          name: value.name,
          deviceid: key,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
  return res;
}

function extract(path, key) {
  const idx = path.indexOf(key);
  if (idx >= 0) {
    let sub = path.substring(idx + key.length);
    const r = sub.indexOf('/');
    if (r > 0)sub = sub.substring(0, r);
    return sub;
  }
  return null;
}

function extractLoginData(path) {
  const Email = extract(path, '/email=');
  const Password = extract(path, '/password=');
  const Region = extract(path, '/region=');
  if (Email && Password && Region) {
    return {
      email: Email,
      password: Password,
      region: Region,
    };
  }
  return null;
}

function removeTags(...args) {
  let res = args[0];
  for (let i = 1; i < args.length; i++) {
    const idx = res.indexOf(args[i]);
    if (idx >= 0) {
      const idx1 = res.indexOf('/', idx + 1);
      res = res.substring(0, idx) + res.substring(0, idx) + (idx1 >= 0 ? res.substring(idx1) : '');
    }
  }
  return res;
}

function getTag(path) {
  let idx = path.indexOf('/', 1);
  if (idx === -1)idx = path.length;
  let eq = path.indexOf('=');
  if (eq === -1 || eq > idx)eq = idx;
  let eq1 = eq + 1;
  if (eq1 > idx)eq1 = idx;
  return [
    path.substring(1, eq),
    path.substring(eq1, idx),
    path.substring(idx),
  ];
}

async function handle_ew(rpath) {
  const login = extractLoginData(rpath);
  if (login.hasOwnProperty('email')) {
    const user = getUser(login);
    const connection = await user.getConnection();
    if (connection) {
      let path = decodeURI(rpath);
      path = removeTags(path, '/eWeLink', '/email=', '/password=', '/region=');
      let answer = '';
      let deviceid = null;
      let state = null;
      let key = null;
      let val = null;
      let some = false;
      const accumulate = el => { answer += el; some = true; };
      do {
        [key, val, path] = getTag(path);
        if (key.length) {
          some = false;
          if (key === 'devices') {
            await user.sendGetDevices();
            user.devices.forEach(element => accumulate(JSON.stringify(element)));
          }
          if (key === 'device') {
            deviceid = val;
            await user.sendGetDevice(deviceid);
            state = user.getDevice(deviceid);
            some = true;
          }
          if (state && deviceid.length) {
            if (key === 'info') accumulate(JSON.stringify(state));
            if (key === 'toggle') {
              user.sendToggleDevice(deviceid);
              some = true;
            }
            if ('on|off'.indexOf(key) >= 0) {
              if (key.indexOf(state.switch) === -1) {
                user.sendToggleDevice(deviceid);
              }
              some = true;
            }
            if (key === 'value') accumulate(state[val]);
          }
          if (!some) accumulate(key);
        }
      } while (path.length > 0);
      return answer;
    }
  }
  return '';
}

function get_device_state(login, device, field) {
  const user = getUser(login);
  const dev = user.getDevice(device);
  let dt = 60000;
  if (!dev)dt = 3000;
  if (Date.now() - user.lastQuest > dt) {
    user.lastQuest = Date.now();
    handle_ew(`/email=${login.email}/password=${login.password}/region=${login.region}/devices/`);
  }
  if (dev) {
    return dev[field];
  }
}

function device_command(login, command) {
  handle_ew(`/email=${login.email}/password=${login.password}/region=${login.region}${command}/`);
}
module.exports = { getDevList, handle_ew, get_device_state, extractLoginData, device_command };
