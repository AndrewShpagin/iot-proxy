/**
 * Provide email, password and region to control the eWeLink devices through the script.
 *
 */
function setup(mail, pass, reg, sheet) {
  email = mail;
  password = pass;
  region = reg;
  mySheet = sheet;
}
let email = '';
let password = '';
let region = '';
let devices = null;
const APP_ID = 'YzfeftUVcZ6twZw1OoVKPRFYTrGEg01Q';
function baseUrl() {
  return `https://${region}-api.coolkit.cc:8080/api/user`;
}
let token = null;

let mySheet = SpreadsheetApp.getActiveSheet();

function ewLogin() {
  if (!token) {
    if (email.length && password.length && region.length) {
      const data = JSON.stringify({ appid: APP_ID, email, password, ts: Math.floor(Date.now() / 1000), version: 8 });
      const encoded = Utilities.base64Encode(Utilities.computeHmacSha256Signature(data, '4G91qSoboqYO4Y0XJ0LPPKIsq8reHdfa'));
      const options = { headers: { Authorization: `Sign ${encoded}` }, method: 'post', contentType: 'application/json', payload: data };
      const answ = JSON.parse(UrlFetchApp.fetch(`${baseUrl()}/login`, options).getContentText());
      if (answ.hasOwnProperty('at')) {
        console.log('Login to eWeLink successful.');
        token = answ.at;
        return true;
      } else {
        console.error('Login to eWeLink failed.');
      }
    } else {
      console.error('Email, password, region not specified. Use setup(...) first.');
    }
    return false;
  }
  return true;
}

/**
   * Get full sate of the device as javascript object, use console.log to discover the object.
   *
   * @param {device} the device identifier, in ''
   */
function ewGetDevice(device) {
  if (ewLogin()) {
    const uri = `${baseUrl()}/device/${device}?deviceid=${device}&appid=${APP_ID}&version=8`;
    const object = JSON.parse(UrlFetchApp.fetch(uri, { headers: { Authorization: `Bearer ${token}` } }).getContentText());
    return object;
  } else return {};
}

/**
   * Get all devices list. Use console.log to discover the structure.
   */
function ewGetDevices() {
  if (devices) return devices;
  if (ewLogin()) {
    const uri = `${baseUrl()}/device?lang=en&appid=${APP_ID}&version=8&getTags=1`;
    devices = JSON.parse(UrlFetchApp.fetch(uri, { headers: { Authorization: `Bearer ${token}` } }).getContentText());
    if (devices && devices.hasOwnProperty('devicelist')) {
      console.log(`Got devices list successvully, ${devices.devicelist.length} devices found.`);
    } else {
      console.error('Unable to get devices list.');
      devices = null;
    }
    return devices;
  } else return {};
}

/**
   * Returns the device identifier by it' name. Returns '' if the device not found. This function triggers ewGetDevices(), it is slow, but if performed once, next calls of getDeviceID will be fast.
   *
   * @param {string} deviceName - the device name
   */
function getDeviceID(deviceName) {
  const dev = ewGetDevices();
  if (dev) {
    const device = dev.devicelist.find(el => el.name == deviceName);
    if (device) {
      console.log(`Found the device by name: ${deviceName} => ${device.deviceid}`);
      return device.deviceid;
    } else {
      console.error(`Device "${deviceName}" not found. This is the list of available devices:`);
      dev.devicelist.forEach(dev => console.log(`${dev.deviceid}: ${dev.name}`));
    }
  }
  return '';
}

/**
   * Get the device state related to the given field.
   *
   * @param {string} device - the device identifier, in ''
   * @param {string} field - the value to get state, usually it are 'switch', 'currentTemperature', 'currentHumidity'.
   */
function ewGetDeviceState(device, field) {
  const res = ewGetDevice(device);
  let result = '';
  if (res.hasOwnProperty(field)) result = res[field];
  if (res.hasOwnProperty('params') && res.params.hasOwnProperty(field)) result = res.params[field];
  console.log(`Got device ${device} (${device.name}), state: ${result}`);
  return result;
}

/**
   * Set the device states. You may set multiple states at once.
   *
   * @param {string} device - the device identifier, in ''
   * @param {object} value - the object that containt the list of fields to change. Example: {switch: 'on', pulse: 'on', pulseWidth: 5000}.
   * Look the console.log(ewGetDevice(device).params) for the full set of possible values.
   */
function deviceSet(device, value) {
  if (ewLogin()) {
    const uri = `${baseUrl()}/device/status`;
    const data = `{"deviceid":"${device}","params":${JSON.stringify(value)},"appid":"${APP_ID}","version":8}`;
    const options = { headers: { Authorization: `Bearer ${token}` }, method: 'post', contentType: 'application/json', payload: data };
    const response = JSON.parse(UrlFetchApp.fetch(uri, options).getContentText());
    console.log(`Sent request to change state ${device}: ${JSON.stringify(value)}, got responce: ${JSON.stringify(response)}, ${response.error === 0 ? 'no errors' : 'error returned!'}`);
    return response.error === 0;
  }
  return false;
}

/**
   * Returns '' if value is incorrect or undefined.
   * @ignore
   * @param {string} str - the value to check
   */
const validate = str => (str === 'undefined' || str.length > 40 ? '' : str);

/**
   * Get the device state related to the given field.
   *
   * @param {string} device - the device identifier, in ''
   * @param {string} field - the value to get state, usually it are 'switch', 'currentTemperature', 'currentHumidity'.
   */
const deviceGet = (id, field) => ewGetDeviceState(id, field);

/// simplest math

/**
   * Returns x^2
   * @ignore
   */
const sqr = x => x * x;

/**
   * Returns sqrt(x)
   * @ignore
   */
const sqrt = x => Math.sqrt(x, 0.5);

/**
   * Returns 0 if value is invalid or value itself
   * @ignore
   */
const valid = x => (x < 10000000000 && x > -10000000000 ? x : 0);

/// Google Sheets cells access

/**
   * Returns the cell value for the current Google Sheet
   *
   * @param {number} r - the row
   * @param {number} c - the column
   */
const getCell = (r, c) => mySheet.getRange(r, c).getValue(); // Get the cell from the sheet

/**
   * Set the cell value
   *
   * @param {number} r - the row
   * @param {number} c - the column
   * @param {number} value - the value to write in the cell
   */
const setCell = (r, c, value) => mySheet.getRange(r, c).setValue(value);// set the cell value

/**
   * Increment the cell on the given value
   *
   * @param {number} r - the row
   * @param {number} c - the column
   * @param {number} value - the increment value
   */
const incrementCell = (r, c, value) => setCell(r, c, getCell(r, c) + value); // add some value to the cell

/**
   * Delete the whole column
   *
   * @param {number} c - the column to delete
   */
const deleteColumn = c => mySheet.deleteColumn(c);

/**
   * Delete the whole row
   *
   * @param {number} c - the row to delete
   */
const deleteRow = c => mySheet.deleteRow(c);

/**
   * Clear cells in range
   * @param {number} r0 - start row
   * @param {number} c0 - start column
   * @param {number} r1 - end row
   * @param {number} c1 - end column
   */
const clearCells = (r0, c0, r1, c1) => mySheet.getRange(r0, c0, r1, c1).clear();

/**
   * Operate over the cells in square region
   *
   * @param {number} r0 - start row
   * @param {number} c0 - start column
   * @param {number} r1 - end row
   * @param {number} c1 - end column
   * @param {init} the initial value
   * @param {op} the function to operate, example of usage:
   * const summCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, 0, (summ, value) => summ + Number(value));
   */
const cellsOperate = (r0, c0, r1, c1, init, op) => {
  let initial = init;
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) { initial = op(initial, getCell(r, c)); }
  }
  return valid(initial);
};

/**
   * Summ cells values in range (as numerical values)
   *
   * @param {number} r0 - start row
   * @param {number} c0 - start column
   * @param {number} r1 - end row
   * @param {number} c1 - end column
   */
const summCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, 0, (summ, value) => summ + Number(value));

/**
   * Concatenate cells in range (as strings)
   * @param {number} r0 - start row
   * @param {number} c0 - start column
   * @param {number} r1 - end row
   * @param {number} c1 - end column
   */
const concatenateCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, '', (summ, value) => summ + value);

/**
   * Multiply cells values in range (as numerical values)
   *
   * @param {number} r0 - start row
   * @param {number} c0 - start column
   * @param {number} r1 - end row
   * @param {number} c1 - end column
   */
const productCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, 1.0, (summ, value) => summ * Number(value));

/**
   * Find maximim value in cells (as numerical values)
   *
   * @param {number} r0 - start row
   * @param {number} c0 - start column
   * @param {number} r1 - end row
   * @param {number} c1 - end column
   */
const maxInCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, -20000000000, (summ, value) => Math.max(summ, Number(value)));

/**
   * Find minimum value in cells (as numerical values)
   *
   * @param {number} r0 - start row
   * @param {number} c0 - start column
   * @param {number} r1 - end row
   * @param {number} c1 - end column
   */
const minInCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, 20000000000, (summ, value) => Math.min(summ, Number(value)));

/**
   * Get amount of non-empty cells in range
   *
   * @param {number} r0 - start row
   * @param {number} c0 - start column
   * @param {number} r1 - end row
   * @param {number} c1 - end column
   */
const countFilledCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, 0.0, (summ, value) => (value === '' ? summ : summ + 1));

/**
   * Get average value of cells in range
   *
   * @param {number} r0 - start row
   * @param {number} c0 - start column
   * @param {number} r1 - end row
   * @param {number} c1 - end column
   */
const averageInCells = (r0, c0, r1, c1) => summCells(r0, c0, r1, c1) / countFilledCells(r0, c0, r1, c1);

/**
   * Get standart deviation of the values in range
   *
   * @param {number} r0 - start row
   * @param {number} c0 - start column
   * @param {number} r1 - end row
   * @param {number} c1 - end column
   */
const deviationInCells = (r0, c0, r1, c1) => {
  const av = averageInCells(r0, c0, r1, c1);
  return valid(sqrt(cellsOperate(r0, c0, r1, c1, 0.0, (summ, value) => summ + sqr(Number(value) - av)) / countFilledCells(r0, c0, r1, c1)));
};

/// Date and time

/**
   * Get current date/time
   */
const now = () => new Date(); // current date & time

/**
   * Convert value to date format
   */
const toDate = x => new Date(x); // convert to date & time format
