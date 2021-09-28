/* eslint-disable no-prototype-builtins */
/* eslint-disable no-await-in-loop */
/* eslint-disable new-cap */
const ewelink = require('ewelink-api');
const CryptoJS = require('crypto-js');

const seqPp = 'JHghhjJHgYiguuyuy786GhhjbYT6';

function decStr(str) {
  return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(str, seqPp));
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
  } else {
    const auth = extract(path, '/auth=');
    const region = extract(path, '/region=');
    if (auth && region) {
      return {
        at: auth,
        region,
      };
    }
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

async function ewconnect(path) {
  const obj = extractLoginData(path);
  if (obj) {
    return new ewelink(obj);
  }
  return null;
}

function deviceInfo(element) {
  const object = {};
  const opt = property => {
    if (element.hasOwnProperty(property)) {
      if (element[property] !== 'unavailable')object[property] = element[property];
    }
    if (element.hasOwnProperty('params') && element.params.hasOwnProperty(property)) {
      if (element.params[property] !== 'unavailable')object[property] = element.params[property];
    }
  };
  opt('currentTemperature');
  opt('currentHumidity');
  opt('temperature');
  opt('humidity');
  opt('deviceid');
  opt('trigTime');
  opt('battery');
  opt('motion');
  opt('switch');
  opt('switches');
  opt('online');
  opt('power');
  opt('name');
  opt('brightness');
  return object;
}

async function proxyRequest(path0) {
  console.log('proxyRequest', path0);
  let path = path0;
  let answer = '';
  const connection = await ewconnect(path);
  if (connection) {
    path = removeTags(path, '/auth=', '/email=', '/password=', '/region=');
    let deviceid = null;
    let device = null;
    let state = null;
    let key = null;
    let val = null;
    let some = false;
    const accumulate = el => { answer += el; some = true; };
    try {
      do {
        [key, val, path] = getTag(path);
        if (key.length) {
          some = false;
          if (key === 'login') {
            const login = await connection.getCredentials();
            accumulate(login.at);
          }
          if (key === 'devices') {
            const devices = await connection.getDevices();
            const short = {};
            devices.forEach(dev => { short[dev.deviceid] = deviceInfo(dev); });
            accumulate(JSON.stringify(short, null, '\t'));
          }
          if (key === 'raw') {
            const devices = await connection.getDevices();
            accumulate(JSON.stringify(devices, null, '\t'));
          }
          if (key === 'device') {
            deviceid = val;
            device = await connection.getDevice(deviceid);
            state = deviceInfo(device);
            some = true;
          }
          if (device && deviceid.length) {
            if (key === 'rawinfo') accumulate(JSON.stringify(device, null, '\t'));
            if (key === 'info') accumulate(JSON.stringify(state, null, '\t'));
            if (key === 'toggle') {
              connection.toggleDevice(deviceid);
              some = true;
            }
            if (key === 'on') {
              connection.setDevicePowerState(deviceid, 'on');
              some = true;
            }
            if (key === 'off') {
              connection.setDevicePowerState(deviceid, 'off');
              some = true;
            }
            if (key === 'value') accumulate(state[val]);
          }
          if (!some) accumulate(key);
        }
      } while (path.length > 0);
    } catch (error) {
      answer = JSON.stringify(error, null, '\t');
    }
  }
  return answer;
}
async function ewRequest(req, res, next) {
  const idx = req.path.indexOf('/xRet78uz');
  if (idx >= 0) {
    const path = decStr(decodeURI(req.path.substring(idx + 9))).substring(6);
    if (path.indexOf('/email=') >= 0 || path.indexOf('/auth=') >= 0) {
      try {
        const answer = await proxyRequest(path);
        if (answer) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(answer);
          res.end();
        }
      } catch (error) {
        next(error);
      }
    }
  }
  next();
}

module.exports = { ewRequest, proxyRequest };
