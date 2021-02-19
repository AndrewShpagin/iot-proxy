/* eslint-disable no-extend-native */
/* eslint-disable camelcase */
import Blockly from 'blockly';

String.prototype.trimLeft = function (charlist) {
  if (charlist === undefined) { charlist = '\s'; }
  return this.replace(new RegExp(`^[${charlist}]+`), '');
};

String.prototype.trimRight = function (charlist) {
  if (charlist === undefined) { charlist = '\s'; }
  return this.replace(new RegExp(`[${charlist}]+$`), '');
};

String.prototype.trim = function (charlist) {
  return this.trimLeft(charlist).trimRight(charlist);
};

function pure(dev) {
  return dev.trim('()');
}

Blockly.JavaScript.switchedOn = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `deviceCommand(${pure(value_device)}, '/value=switch') === 'on'`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.switchedOff = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `deviceCommand(${pure(value_device)}, '/value=switch') === 'off'`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.device = function (block) {
  const dropdown_name = block.getFieldValue('NAME');
  const val = block.getField('NAME').selectedOption_;
  const code = `'${dropdown_name}'`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.console = function (block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `console.log(${value_name});\n`;
  return code;
};

Blockly.JavaScript.device_state = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const value_state = Blockly.JavaScript.valueToCode(block, 'State', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `deviceCommand(${pure(value_device)}, '/value=${value_state}') === 'on'`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.pause = function (block) {
  const value_pause = Blockly.JavaScript.valueToCode(block, 'pause', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `Utilities.sleep(${value_pause}*1000);\n`;
  return code;
};

Blockly.JavaScript.turnon = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'device', Blockly.JavaScript.ORDER_ATOMIC);
  return `deviceCommand(${pure(value_device)}, '/on');\n`;
};

Blockly.JavaScript.turnoff = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'device', Blockly.JavaScript.ORDER_ATOMIC);
  return `deviceCommand(${pure(value_device)}, '/off');\n`;
};

Blockly.JavaScript.ewelink_devices_access = function (block) {
  const text_email = block.getFieldValue('EMAIL');
  const text_pass = block.getFieldValue('PASS');
  const dropdown_reg_list = block.getFieldValue('reg_list');
  // TODO: Assemble JavaScript into code variable.
  const code = '...;\n';
  return code;
};

Blockly.JavaScript.temperature = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `deviceCommand(${pure(value_device)}, '/value=currentTemperature')`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.humidity = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `deviceCommand(${pure(value_device)}, '/value=currentHumidity')`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.power = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `deviceCommand(${pure(value_device)}, '/value=power')`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

function sheet(value_sheet) {
  if (value_sheet === 'undefined' || value_sheet === '') return 'mySheet';
  return value_sheet;
}
Blockly.JavaScript.getcellvalue = function (block) {
  const value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  const value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `mySheet.getRange(${value_row}, ${value_column}).getValue()`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.setcellvalue = function (block) {
  const value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  const value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  const value_value = Blockly.JavaScript.valueToCode(block, 'Value', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  const code = `mySheet.getRange(${value_row}, ${value_column}).setValue(${value_value});\n`;
  return code;
};

Blockly.JavaScript.getlastrow = function (block) {
  const code = 'mySheet.getLastRow() + 1';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.namedsheet = function (block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `mySheet = SpreadsheetApp.getSheetByName(${value_name})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.currenttime = function (block) {
  const code = 'new Date()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.passedsince = function (block) {
  const value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `(new Date() - ${value_time})/1000`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.addsectodate = function (block) {
  const value_date = Blockly.JavaScript.valueToCode(block, 'date', Blockly.JavaScript.ORDER_ATOMIC);
  const value_interval = Blockly.JavaScript.valueToCode(block, 'interval', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `new Date(${value_date}.getTime() + ${value_interval}*1000)`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.addmintodate = function (block) {
  const value_date = Blockly.JavaScript.valueToCode(block, 'date', Blockly.JavaScript.ORDER_ATOMIC);
  const value_interval = Blockly.JavaScript.valueToCode(block, 'interval', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `new Date(${value_date}.getTime() + ${value_interval}*1000*60)`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.addhourstodate = function (block) {
  const value_date = Blockly.JavaScript.valueToCode(block, 'date', Blockly.JavaScript.ORDER_ATOMIC);
  const value_interval = Blockly.JavaScript.valueToCode(block, 'interval', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `new Date(${value_date}.getTime() + ${value_interval}*1000*60*60)`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
