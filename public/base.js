/// The script generated using the iot-proxy.com
function myFunction() {
  '...functionBodyThere...';
}

/// The script below contains basic simple functions to beautify the generated code look.

const server = 'serverNameThere';
const mySheet = SpreadsheetApp.getActiveSheet();
/// device requests commands
const validate = str => (str === 'undefined' || str.length > 40 ? '' : str);
const deviceCommand = (device, command) => validate(UrlFetchApp.fetch(`${server}/device=${device}${command}`).getContentText());
const deviceGet = (id, field) => deviceCommand(id, `/value=${field}`); // get state of the device
const deviceSet = (id, field) => deviceCommand(id, `/${field}`);// change state of the device, usually 'on' or 'off'

/// simplest math
const sqr = x => x * x;
const sqrt = x => Math.sqrt(x, 0.5);
const sin = x => Math.sin(x);
const cos = x => Math.cos(x);
const valid = x => (x < 10000000000 && x > -10000000000 ? x : 0);

/// Google Sheets cells access
const getCell = (r, c) => mySheet.getRange(r, c).getValue(); // Get the cell from the sheet
const setCell = (r, c, value) => mySheet.getRange(r, c).setValue(value);// set the cell value
const incrementCell = (r, c, value) => setCell(r, c, getCell(r, c) + value); // add some value to the cell
const deleteColumn = c => mySheet.deleteColumn(c);
const deleteRow = c => mySheet.deleteRow(c);
const clearCells = (r0, c0, r1, c1) => mySheet.getRange(r0, c0, r1, c1).clear();
const cellsOperate = (r0, c0, r1, c1, init, op) => {
  let initial = init;
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) { initial = op(initial, getCell(r, c)); }
  }
  return valid(initial);
};
const summCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, 0, (summ, value) => summ + Number(value));
const concatenateCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, '', (summ, value) => summ + value);
const productCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, 1.0, (summ, value) => summ * Number(value));
const maxInCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, -20000000000, (summ, value) => Math.max(summ, Number(value)));
const minInCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, 20000000000, (summ, value) => Math.min(summ, Number(value)));
const countFilledCells = (r0, c0, r1, c1) => cellsOperate(r0, c0, r1, c1, 0.0, (summ, value) => (value === '' ? summ : summ + 1));
const averageInCells = (r0, c0, r1, c1) => summCells(r0, c0, r1, c1) / countFilledCells(r0, c0, r1, c1);
const deviationInCells = (r0, c0, r1, c1) => {
  const av = averageInCells(r0, c0, r1, c1);
  return valid(sqrt(cellsOperate(r0, c0, r1, c1, 0.0, (summ, value) => summ + sqr(Number(value) - av)) / countFilledCells(r0, c0, r1, c1)));
};

/// Date and time
const now = () => new Date(); // current date & time
const toDate = x => new Date(x); // convert to date & time format
