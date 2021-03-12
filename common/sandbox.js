/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-eval */
// const Parallel = require('paralleljs');
// let {SandCastle} = require('sandcastle');

// const { VM } = require('vm2');
const CryptoJS = require('crypto-js');
const { encode } = require('url-safe-base64');
const { SandboxTable } = require('./table');

const APP_ID = 'YzfeftUVcZ6twZw1OoVKPRFYTrGEg01Q';
const APP_SECRET = '4G91qSoboqYO4Y0XJ0LPPKIsq8reHdfa';

export class SandBox {
  constructor(email, password, region, scriptName, maxTime, onServer) {
    this.email = email;
    this.password = password;
    this.region = region;
    this.maxTime = maxTime;
    this.auth = null;
    this.scriptName = scriptName;
    this.onServer = onServer;
    this.tables = { default: new SandboxTable() };
    this.mySheet = this.tables.default;
    this.curtable = 'default';
    this.ts = Math.floor(Date.now() / 1000);
    this.base = `https://${this.region}-api.coolkit.cc:8080/api/user`;
    this.devices = null;
    this.restoreTables();
    this.devcache = {};
    this.logsumm = '';
    this.lastUnusedRow = this.mySheet.getLastRow() + 1;
    this.asyncReplace = [
      'ewLogin',
      'ewGetDevice',
      'ewGetDevices',
      'getDeviceID',
      'ewGetDeviceState',
      'secondsPassedSinceOnline',
      'secondsPassedSinceOffline',
      'deviceSet',
      'deviceGet',
      'makePause',
    ];
  }

  isDate(str) {
    return str.length === 24 && str.slice(-1) === 'Z' && str.includes('-') && str.includes(':');
  }

  humanVal(val) {
    if (val) {
      const str = val.toString();
      if (this.isDate(str)) {
        // eslint-disable-next-line no-undef
        return w2utils.formatDateTime(new Date(val), 'mm-dd-yyyy|h:m:s');
      }
      // eslint-disable-next-line no-undef
      if (w2utils.isFloat(str)) return Number((Number(str)).toFixed(3)).toString();
      return str;
    } else return 'null';
  }

  createTable() {
    const result = {
      name: 'Result',
      columns: [],
      records: [],
    };
    this.storeTables();
    this.restoreTables();
    const t = this.curTable();
    const width = [];
    for (let i = 0; i <= t.lastcolumn; i++) width.push(0);
    width[0] = 4;
    for (let i = 1; i <= t.lastrow; i++) {
      const rowValues = t.table[i];
      if (rowValues) {
        for (const [col, value] of Object.entries(rowValues)) {
          const val = value;
          width[col] = Math.max(width[col], this.humanVal(value).length);
        }
      }
    }
    let summ = 1;
    for (let i = 1; i <= t.lastcolumn; i++) summ += width[i];
    result.columns.push({
      field: '0',
      caption: '#',
      size: '40px',
    });
    for (let i = 1; i <= t.lastcolumn; i++) {
      result.columns.push({
        field: i,
        caption: i,
        size: `${(width[i] * 100.0) / summ}%`,
      });
    }
    for (let i = 0; i <= t.lastrow; i++) {
      const rowValues = t.table[i];
      const elm = { recid: i, 0: i };
      if (rowValues) {
        for (const [col, value] of Object.entries(rowValues)) {
          elm[col] = this.humanVal(value);
        }
      }
      result.records.push(elm);
    }
    return result;
  }

  tableStoreID(name) {
    return `SandboxTable_${this.email}_${this.scriptName}_${name}`;
  }

  restoreTables() {
    if (!this.onServer) {
      const tab = window.localStorage.getItem(this.tableStoreID('default'));
      if (tab && tab.length) {
        const tb = this.tables.default;
        const res = JSON.parse(tab);
        tb.table = res.table || new SandboxTable();
        tb.lastcolumn = res.lastcolumn;
        tb.lastrow = res.lastrow;
      }
    }
  }

  storeTables() {
    if (!this.onServer) {
      window.localStorage.setItem(this.tableStoreID('default'), JSON.stringify(this.tables.default));
    }
  }

  curTable() {
    return this.tables[this.curtable];
  }

  syncRequest(method, uri, auth, body) {
    try {
      const req = new XMLHttpRequest();
      if (this.onServer) {
        req.open(method, uri, false);
        req.setRequestHeader('Authorization', auth);
        req.send(body);
      } else {
        const text = JSON.stringify({
          method,
          uri,
          auth,
          body,
        });
        req.open('GET', `/aSevT56x${encode(btoa(text))}`, false);
        req.send(null);
      }
      if (req.status === 200) { // OK
        // console.log('response:', JSON.parse(req.responseText));
        return JSON.parse(req.responseText);
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async asyncRequest(method, uri, auth, body) {
    try {
      if (this.onServer) {
        const request = await fetch(uri, { method, headers: { Authorization: auth }, body });
        return await request.json();
      } else {
        const text = JSON.stringify({
          method,
          uri,
          auth,
          body,
        });
        const request = await fetch(`/aSevT56x${encode(btoa(text))}`, { method: 'get' });
        return await request.json();
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  log(par) {
    const d = new Date();
    const out = `${d.toLocaleTimeString()} : ${par}`;
    if (this.logcallback) this.logcallback(out);
    this.logsumm += `${par}\n`;
  }

  error(par) {
    const d = new Date();
    const out = `${d.toLocaleTimeString()} : 'ERROR!' : ${par}`;
    if (this.logcallback) this.logcallback(out);
  }

  async makePause(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  async ewLogin() {
    if (!this.auth) {
      const payload = JSON.stringify({
        appid: APP_ID,
        email: this.email,
        password: this.password,
        ts: this.ts,
        version: 8,
      });
      const sign = CryptoJS.HmacSHA256(payload, APP_SECRET).toString(CryptoJS.enc.Base64);
      const res = await this.asyncRequest('POST', `${this.base}/login`, `Sign ${sign}`, payload);
      if (res) { // OK
        if (res.hasOwnProperty('at')) {
          await this.log('Login to eWeLink successful.');
          this.auth = res.at;
          return this.auth;
        }
      } else {
        await this.error('Login to eWeLink failed.');
      }
    }
    return this.auth;
  }

  async ewGetDevice(deviceid) {
    if (await this.ewLogin()) {
      if (this.devcache[deviceid]) return this.devcache[deviceid];
      const uri = `${this.base}/device/${deviceid}?deviceid=${deviceid}&appid=${APP_ID}&version=8`;
      const res = await this.asyncRequest('GET', uri, `Bearer ${this.auth}`, null);
      if (res && res.hasOwnProperty('deviceid')) {
        this.devcache[deviceid] = res;
        return res;
      }
    }
    return null;
  }

  async ewGetDevices() {
    if (this.devices) return this.devices;
    if (await this.ewLogin()) {
      const uri = `${this.base}/device?lang=en&appid=${APP_ID}&version=8&getTags=1`;
      this.devices = await this.asyncRequest('GET', uri, `Bearer ${this.auth}`, null);
      if (this.devices && this.devices.hasOwnProperty('devicelist')) {
        await this.log(`Got devices list successvully, ${this.devices.devicelist.length} devices found.`);
        // eslint-disable-next-line no-return-assign
        this.devices.devicelist.forEach(el => this.devcache[el.deviceid] = el);
      } else {
        await this.error('Unable to get devices list.');
        this.devices = null;
      }
      return this.devices;
    }
    return {};
  }

  async getDeviceID(deviceName) {
    const devs = await this.ewGetDevices();
    if (devs) {
      const device = devs.devicelist.find(el => el.name === deviceName);
      if (device) {
        await this.log(`Found the device by name: ${deviceName} => ${device.deviceid}`);
        return device.deviceid;
      } else {
        await this.error(`Device "${deviceName}" not found. This is the list of available devices:`);
        this.devices.devicelist.forEach(d => this.log(`${d.deviceid}: ${d.name}`));
      }
    }
    return '';
  }

  async ewGetDeviceState(device, field) {
    const res = await this.ewGetDevice(device);
    let result = '';
    if (res) {
      if (res.hasOwnProperty(field)) result = res[field];
      if (res.hasOwnProperty('params') && res.params.hasOwnProperty(field)) result = res.params[field];
      this.log(`Got device ${device} (${res.name}), field ${field}, got state: ${result}`);
    }
    return result;
  }

  async secondsPassedSinceOnline(device) {
    const dt = (new Date() - new Date(await this.ewGetDeviceState(device, 'onlineTime'))) / 1000.0;
    this.log(`secondsPassedSinceOnline(${device}) => ${dt} sec`);
    return dt;
  }

  async secondsPassedSinceOffline(device) {
    const dt = (new Date() - new Date(await this.ewGetDeviceState(device, 'offlineTime'))) / 1000.0;
    this.log(`secondsPassedSinceOffline(${device}) => ${dt} sec`);
    return dt;
  }

  async deviceSet(device, state) {
    if (await this.ewGetDevice(device)) {
      this.log(`deviceSet(${device}, ${JSON.stringify(state)})`);
      if (await this.ewLogin()) {
        const dev = this.devcache[device];
        let any = false;
        if (dev) {
          for (const [st, value] of Object.entries(state)) {
            if (dev.params.hasOwnProperty(st) && dev.params[st] !== value) any = true;
          }
        }
        if (any) {
          const uri = `${this.base}/device/status`;
          const data = JSON.stringify({ deviceid: device,
            params: state,
            appid: APP_ID,
            version: 8,
          });
          this.log(`Sent request to change state ${device}: ${JSON.stringify(state)}`);
          const res = await this.asyncRequest('POST', uri, `Bearer ${this.auth}`, data);
          this.log(`Got responce: ${JSON.stringify(res)}, ${res.error === 0 ? 'no errors' : 'error returned!'}`);
          if (res && res.error === 0) {
            if (dev) {
              for (const [st, value] of Object.entries(state)) {
                if (dev.params.hasOwnProperty(st))dev.params[st] = value;
              }
            }
            return true;
          }
        } else {
          this.log(`deviceSet(${device}, ${JSON.stringify(state)}) has not changed any state. Sent nothing to servers.`);
          return true;
        }
      }
    }
    return false;
  }

  async deviceGet(id, field) {
    const res = await this.ewGetDeviceState(id, field);
    this.setProperty(`device_${id}_${field}`, res);
    this.log(`deviceGet(${id}, ${field}) => ${res}`);
    return res;
  }

  deviceGetPrevState(id, field) {
    return this.getProperty(`device_${id}_${field}`);
  }

  getCell(r, c) {
    const rr = this.curTable().get(r, c);
    this.log(`getCell(${r}, ${c}) => ${rr}`);
    return rr;
  }

  valid(x) {
    return x < 10000000000 && x > -10000000000 ? x : 0;
  }

  setCell(r, c, value) {
    this.log(`setCell(${r}, ${c}, ${value})`);
    return (this.curTable()).set(r, c, value);
  }

  incrementCell(r, c, value) {
    const cc = this.getCell(r, c);
    if (cc === '') this.setCell(r, c, value);
    else this.setCell(r, c, cc + value);
    this.log(`incrementCell(${r}, ${c}, ${value}) : ${cc} => ${this.getCell(r, c)}`);
  }

  deleteColumn(c) {
    this.log(`deleteColumn(${c})`);
    this.curTable().delColumn(c);
  }

  deleteRow(r) {
    this.log(`deleteRow(${r})`);
    this.curTable().delRow(r);
  }

  clearCells(r0, c0, r1, c1) {
    this.log(`clearCells(${r0}, ${c0}, ${r1}, ${c1})`);
    this.curTable().clearRange(r0, c0, r1, c1);
  }

  cellsOperate(r0, c0, r1, c1, init, func) {
    const res = this.curTable().cellsOperate(r0, c0, r1, c1, init, func);
    // await this.log(`cellsOperate(${r0}, ${c0}, ${r1}, ${c1}, ...) => ${res}`);
    return res;
  }

  async summCells(r0, c0, r1, c1) {
    const res = this.cellsOperate(r0, c0, r1, c1, 0, (summ, value) => summ + Number(value));
    this.log(`summCells(${r0}, ${c0}, ${r1}, ${c1}) => ${res}`);
    return res;
  }

  concatenateCells(r0, c0, r1, c1) {
    const res = this.cellsOperate(r0, c0, r1, c1, '', (summ, value) => summ + value);
    this.log(`concatenateCells(${r0}, ${c0}, ${r1}, ${c1}) => ${res}`);
    return res;
  }

  productCells(r0, c0, r1, c1) {
    const res = this.cellsOperate(r0, c0, r1, c1, 1.0, (summ, value) => summ * Number(value));
    this.log(`productCells(${r0}, ${c0}, ${r1}, ${c1}) => ${res}`);
    return res;
  }

  maxInCells(r0, c0, r1, c1) {
    const res = this.cellsOperate(r0, c0, r1, c1, -20000000000, (summ, value) => Math.max(summ, Number(value)));
    this.log(`maxInCells(${r0}, ${c0}, ${r1}, ${c1}) => ${res}`);
    return res;
  }

  minInCells(r0, c0, r1, c1) {
    const res = this.cellsOperate(r0, c0, r1, c1, 20000000000, (summ, value) => Math.min(summ, Number(value)));
    this.log(`minInCells(${r0}, ${c0}, ${r1}, ${c1}) => ${res}`);
    return res;
  }

  countFilledCells(r0, c0, r1, c1) {
    const res = this.cellsOperate(r0, c0, r1, c1, 0.0, (summ, value) => (value === '' ? summ : summ + 1));
    this.log(`countFilledCells(${r0}, ${c0}, ${r1}, ${c1}) => ${res}`);
    return res;
  }

  averageInCells(r0, c0, r1, c1) {
    const res = this.summCells(r0, c0, r1, c1) / this.countFilledCells(r0, c0, r1, c1);
    this.log(`averageInCells(${r0}, ${c0}, ${r1}, ${c1}) => ${res}`);
    return res;
  }

  deviationInCells(r0, c0, r1, c1) {
    const av = this.averageInCells(r0, c0, r1, c1);
    const res = this.valid(Math.sqrt(this.cellsOperate(r0, c0, r1, c1, 0.0, (summ, value) => summ + this.sqr(Number(value) - av)) / this.countFilledCells(r0, c0, r1, c1)));
    this.log(`deviationInCells(${r0}, ${c0}, ${r1}, ${c1}) => ${res}`);
    return res;
  }

  now() {
    const rr = new Date();
    this.log(`now() => ${rr}`);
    return rr;
  }

  toDate(x) {
    return new Date(x);
  }

  thisDayTime() {
    const tm = new Date();
    return tm.getHours() * 60 + tm.getMinutes();
  }

  dayTime(hour, minute) {
    return hour * 60 + minute;
  }

  thisWeekDay() {
    return (new Date()).getDay();
  }

  forAllRecentUnreadMails(from, subject, body, todo) {
    this.error('forAllRecentUnreadMails: e-mail functions not supported when you run in the Browser.');
  }

  sendEmail(email, subj, body) {
    this.error('sendEmail: e-mail functions not supported when you run in the Browser.');
  }

  getProperty(key) {
    return localStorage.getItem(key);
  }

  setProperty(key, value) {
    localStorage.setItem(key, value);
  }

  replaceAll(body, what, to) {
    let res = body;
    if (what !== to) {
      do {
        const r = res.replace(what, to);
        if (r === res) break;
        res = r;
      // eslint-disable-next-line no-constant-condition
      } while (true);
    }
    return res;
  }

  replaceAsync(body) {
    let res = body;
    this.asyncReplace.forEach(el => {
      res = this.replaceAll(res, `myObject.${el}`, `-*+[]==&&+()!!~.${el}`);
    });
    return this.replaceAll(res, '-*+[]==&&+()!!~.', 'await myObject.');
  }

  baseRun(asyncCode, endCallback) {
    const myObject = this;
    const resfn =
      `async function ev() { 
        ${asyncCode} 
      } 
      ev().then(res => { 
        myObject.storeTables();
        endCallback(myObject);
      });`;
    eval(resfn);
  }

  async run(code, logcallback, endCallback) {
    this.logcallback = logcallback;
    this.log(`Executing code:\n/*-------------------------------------------*/\n${code}/*-------------------------------------------*/`);
    const asyncCode = this.replaceAsync(code);
    this.baseRun(asyncCode, endCallback);
  }
}
