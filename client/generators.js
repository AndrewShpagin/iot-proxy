/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-extend-native */
/* eslint-disable camelcase */
//import Blockly from 'blockly';

Blockly.JavaScript.switchedOn = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.deviceGet(${value_device}, 'switch') === 'on'`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.switchedOff = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.deviceGet(${value_device}, 'switch') === 'off'`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.device = function (block) {
  const dropdown_name = block.getFieldValue('NAME');
  const val = block.getField('NAME').selectedOption_;
  const code = `'${dropdown_name}'/*${val[0]}*/`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.console = function (block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `console.log(${value_name});\n`;
  return code;
};

Blockly.JavaScript.device_state = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const value_state = Blockly.JavaScript.valueToCode(block, 'State', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.deviceGet(${value_device}, '${value_state}')`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.pause = function (block) {
  const value_pause = Blockly.JavaScript.valueToCode(block, 'pause', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `Utilities.sleep(${value_pause}*1000);\n`;
  return code;
};

Blockly.JavaScript.turnon = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'device', Blockly.JavaScript.ORDER_ATOMIC);
  return `ew.deviceSet(${value_device}, {switch: 'on', pulse: 'off'});\n`;
};

Blockly.JavaScript.turnoff = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'device', Blockly.JavaScript.ORDER_ATOMIC);
  return `ew.deviceSet(${value_device}, {switch: 'off', pulse: 'off'});\n`;
};

Blockly.JavaScript.ewelink_devices_access = function (block) {
  const text_email = block.getFieldValue('EMAIL');
  const text_pass = block.getFieldValue('PASS');
  const dropdown_reg_list = block.getFieldValue('reg_list');
  // TODO: Assemble JavaScript into code variable.
  const code = ';\n';
  return code;
};

Blockly.JavaScript.temperature = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.deviceGet(${value_device}, 'currentTemperature')`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.humidity = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.deviceGet(${value_device}, 'currentHumidity')`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.power = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.deviceGet(${value_device}, 'power')`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

function sheet(value_sheet) {
  if (value_sheet === 'undefined' || value_sheet === '') return 'mySheet';
  return value_sheet;
}
Blockly.JavaScript.getcellvalue = function (block) {
  const value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  const value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.getCell(${value_row}, ${value_column})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.setcellvalue = function (block) {
  const value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  const value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  const value_value = Blockly.JavaScript.valueToCode(block, 'Value', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  const code = `ew.setCell(${value_row}, ${value_column}, ${value_value});\n`;
  return code;
};

Blockly.JavaScript.accamulatecell = function (block) {
  const value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  const value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  const value_value = Blockly.JavaScript.valueToCode(block, 'Value', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.incrementCell(${value_row}, ${value_column}, ${value_value});\n`;
  return code;
};

Blockly.JavaScript.getlastrow = function (block) {
  const code = 'ew.mySheet.getLastRow() + 1';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.namedsheet = function (block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.mySheet = SpreadsheetApp.getSheetByName(${value_name})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.currenttime = function (block) {
  const code = 'ew.now()';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.passedsince = function (block) {
  const value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `(ew.now() - ${value_time})/1000`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.addsectodate = function (block) {
  const value_date = Blockly.JavaScript.valueToCode(block, 'date', Blockly.JavaScript.ORDER_ATOMIC);
  const value_interval = Blockly.JavaScript.valueToCode(block, 'interval', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.toDate(${value_date}.getTime() + ${value_interval}*1000)`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.addmintodate = function (block) {
  const value_date = Blockly.JavaScript.valueToCode(block, 'date', Blockly.JavaScript.ORDER_ATOMIC);
  const value_interval = Blockly.JavaScript.valueToCode(block, 'interval', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.toDate(${value_date}.getTime() + ${value_interval}*1000*60)`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.addhourstodate = function (block) {
  const value_date = Blockly.JavaScript.valueToCode(block, 'date', Blockly.JavaScript.ORDER_ATOMIC);
  const value_interval = Blockly.JavaScript.valueToCode(block, 'interval', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.toDate(${value_date}.getTime() + ${value_interval}*1000*60*60)`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.comment = function (block) {
  const text_name = block.getFieldValue('NAME');
  const code = `/// ${text_name}\n`;
  return code;
};

Blockly.JavaScript.clearrange = function (block) {
  const value_row0 = Blockly.JavaScript.valueToCode(block, 'row0', Blockly.JavaScript.ORDER_ATOMIC);
  const value_column0 = Blockly.JavaScript.valueToCode(block, 'column0', Blockly.JavaScript.ORDER_ATOMIC);
  const value_row1 = Blockly.JavaScript.valueToCode(block, 'row1', Blockly.JavaScript.ORDER_ATOMIC);
  const value_column1 = Blockly.JavaScript.valueToCode(block, 'column1', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.clearCells(${value_row0}, ${value_column0}, ${value_row1}, ${value_column1});\n`;
  return code;
};

Blockly.JavaScript.removerow = function (block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  const code = `ew.deleteRow(${value_name});\n`;
  return code;
};

Blockly.JavaScript.removecolumn = function (block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  const code = `ew.deleteColumn(${value_name});\n`;
  return code;
};

Blockly.JavaScript.operaterange = function (block) {
  const dropdown_name = block.getFieldValue('NAME');
  const value_row0 = Blockly.JavaScript.valueToCode(block, 'row0', Blockly.JavaScript.ORDER_ATOMIC);
  const value_column0 = Blockly.JavaScript.valueToCode(block, 'column0', Blockly.JavaScript.ORDER_ATOMIC);
  const value_row1 = Blockly.JavaScript.valueToCode(block, 'row1', Blockly.JavaScript.ORDER_ATOMIC);
  const value_column1 = Blockly.JavaScript.valueToCode(block, 'column1', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${dropdown_name}(${value_row0}, ${value_column0}, ${value_row1}, ${value_column1})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.turnontemporary = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'device', Blockly.JavaScript.ORDER_ATOMIC);
  const value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.deviceSet(${value_device}, {switch: 'on', pulse: 'on', pulseWidth: ${value_time}*1000});\n`;
  return code;
};

Blockly.JavaScript.turnonpulsemode = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'device', Blockly.JavaScript.ORDER_ATOMIC);
  const value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.deviceSet(${value_device}, {pulse: 'on', pulseWidth: ${value_time}*1000});\n`;
  return code;
};

Blockly.JavaScript.turnoffpulsemode = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.deviceSet(${value_device}, {pulse: 'off'});\n`;
  return code;
};
