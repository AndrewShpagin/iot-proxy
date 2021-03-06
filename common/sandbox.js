/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-eval */
const Parallel = require('paralleljs');
// let {SandCastle} = require('sandcastle');

// const { VM } = require('vm2');
const CryptoJS = require('crypto-js');
const { encode } = require('url-safe-base64');
const { table } = require('./table');
require('./table');

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
    this.tables = { default:
      new table(),
    };
    this.mySheet = this.tables.default;
    this.curtable = 'default';
    this.ts = Math.floor(Date.now() / 1000);
    this.base = `https://${this.region}-api.coolkit.cc:8080/api/user`;
    this.devices = null;
    this.restoreTables();
  }

  isDate(str) {
    return str.length === 24 && str.slice(-1) === 'Z' && str.includes('-') && str.includes(':');
  }

  humanVal(val) {
    const str = val.toString();
    if (this.isDate(str)) {
      console.log('date:', val, w2utils.formatDateTime(new Date(val), 'mm-dd-yyyy|h:m:s'));
      return w2utils.formatDateTime(new Date(val), 'mm-dd-yyyy|h:m:s');
    }
    if (w2utils.isFloat(str)) return Number((Number(str)).toFixed(3)).toString();
    return str;
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
    console.log(summ, width);
    result.columns.push({
      field: '0',
      caption: '#',
      size: '40px',
    });
    for (let i = 1; i <= t.lastcolumn; i++) {
      result.columns.push({
        field: i,
        caption: i,
        size: `${width[i] * 100.0 / summ}%`,
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
    console.log(result);
    return result;
  }

  tableStoreID(name) {
    return `table_${this.email}_${this.scriptName}_${name}`;
  }

  restoreTables() {
    if (!this.onServer) {
      const tab = window.localStorage.getItem(this.tableStoreID('default'));
      if (tab && tab.length) {
        const tb = this.tables.default;
        const res = JSON.parse(tab);
        tb.table = res.table;
        tb.lastcolumn = res.lastcolumn;
        tb.lastrow = res.lastrow;
      }
      console.log(this.tables);
      console.log(this.curTable());
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

  log(par) {
    const d = new Date();
    const out = `${d.toLocaleTimeString()} : ${par}`;
    if (this.logcallback) this.logcallback(out);
    // console.log(par);
  }

  error(par) {
    const d = new Date();
    const out = `${d.toLocaleTimeString()} : 'ERROR!' : ${par}`;
    if (this.logcallback) this.logcallback(out);
  }

  ewLogin() {
    if (!this.auth) {
      const payload = JSON.stringify({
        appid: APP_ID,
        email: this.email,
        password: this.password,
        ts: this.ts,
        version: 8,
      });
      const sign = CryptoJS.HmacSHA256(payload, APP_SECRET).toString(CryptoJS.enc.Base64);
      const res = this.syncRequest('POST', `${this.base}/login`, `Sign ${sign}`, payload);
      if (res) { // OK
        if (res.hasOwnProperty('at')) {
          this.log('Login to eWeLink successful.');
          this.auth = res.at;
          return this.auth;
        }
      } else {
        this.error('Login to eWeLink failed.');
      }
    }
    return this.auth;
  }

  ewGetDevice(deviceid) {
    if (this.ewLogin()) {
      const uri = `${this.base}/device/${deviceid}?deviceid=${deviceid}&appid=${APP_ID}&version=8`;
      const res = this.syncRequest('GET', uri, `Bearer ${this.auth}`, null);
      if (res) return res;
    }
    return {};
  }

  ewGetDevices() {
    if (this.devices) return this.devices;
    if (this.ewLogin()) {
      const uri = `${this.base}/device?lang=en&appid=${APP_ID}&version=8&getTags=1`;
      devices = this.syncRequest('GET', uri, `Bearer ${this.auth}`, null);
      if (devices && devices.hasOwnProperty('devicelist')) {
        this.log(`Got devices list successvully, ${devices.devicelist.length} devices found.`);
      } else {
        this.error('Unable to get devices list.');
        devices = null;
      }
      return devices;
    }
    return {};
  }

  getDeviceID(deviceName) {
    this.ewGetDevices();
    if (this.devices) {
      const device = this.devices.devicelist.find(el => el.name === deviceName);
      if (device) {
        console.log(`Found the device by name: ${deviceName} => ${device.deviceid}`);
        return device.deviceid;
      } else {
        this.error(`Device "${deviceName}" not found. This is the list of available devices:`);
        this.devices.devicelist.forEach(d => console.log(`${d.deviceid}: ${d.name}`));
      }
    }
    return '';
  }

  ewGetDeviceState(device, field) {
    const res = this.ewGetDevice(device);
    let result = '';
    if (res.hasOwnProperty(field)) result = res[field];
    if (res.hasOwnProperty('params') && res.params.hasOwnProperty(field)) result = res.params[field];
    this.log(`Got device ${device} (${res.name}), field ${field}, got state: ${result}`);
    return result;
  }

  secondsPassedSinceOnline(device) {
    const dt = (new Date() - new Date(this.ewGetDeviceState(device, 'onlineTime'))) / 1000.0;
    this.log(`secondsPassedSinceOnline(${device}) => ${dt} sec`);
    return dt;
  }

  secondsPassedSinceOffline(device) {
    const dt = (new Date() - new Date(this.ewGetDeviceState(device, 'offlineTime'))) / 1000.0;
    this.log(`secondsPassedSinceOffline(${device}) => ${dt} sec`);
    return dt;
  }

  deviceSet(device, state) {
    this.log(`deviceSet(${device}, ${JSON.stringify(state)})`);
    if (this.ewLogin()) {
      const uri = `${this.base}/device/status`;
      const data = JSON.stringify({ deviceid: device,
        params: { switch: state },
        appid: APP_ID,
        version: 8,
      });
      this.log(`Sent request to change state ${device}: ${JSON.stringify(state)}`);
      const res = this.syncRequest('POST', uri, `Bearer ${this.auth}`, data);
      this.log(`Got responce: ${JSON.stringify(res)}, ${res.error === 0 ? 'no errors' : 'error returned!'}`);
      if (res && res.error === 0) return true;
    }
    return false;
  }

  deviceGet(id, field) {
    const res = this.ewGetDeviceState(id, field);
    this.log(`deviceGet(${id}, ${field}) => ${res}`);
    return res;
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
    return this.curTable().set(r, c, value);
  }

  incrementCell(r, c, value) {
    const cc = getCell(r, c);
    if (cc === '')setCell(r, c, value);
    else setCell(r, c, cc + value);
    this.log(`incrementCell(${r}, ${c}, ${value}) : ${cc} => ${getCell(r, c)}`);
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
    // this.log(`cellsOperate(${r0}, ${c0}, ${r1}, ${c1}, ...) => ${res}`);
    return res;
  }

  summCells(r0, c0, r1, c1) {
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
    const res = this.valid(Math.sqrt(this.cellsOperate(r0, c0, r1, c1, 0.0, (summ, value) => summ + sqr(Number(value) - av)) / this.countFilledCells(r0, c0, r1, c1)));
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
    this.error('e-mail functions not supported');
  }

  run(code, logcallback) {
    // const p = new Parallel('forwards');
    // p.spawn(data => {
    //  console.log('START!');
    this.logcallback = logcallback;
    this.log(`Executing code:\n/*-------------------------------------------*/\n${code}/*-------------------------------------------*/`);
    eval(code);
    this.log('Execution finished!');
    this.storeTables();
    //  console.log('END!');
    //  return data;
    // }, {}).then(data => {
    //  console.log(data);
    // });
  }
}
