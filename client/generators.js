/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-extend-native */
/* eslint-disable camelcase */
// import Blockly from 'blockly';

Blockly.JavaScript.switchedOn = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const code = `ew.deviceGet(${value_device}, 'switch') === 'on'`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.switchedOff = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
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
  const value_device = block.getFieldValue('EW_DEVICE');
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
  const value_device = block.getFieldValue('EW_DEVICE');
  return `ew.deviceSet(${value_device}, {switch: 'on', pulse: 'off'});\n`;
};

Blockly.JavaScript.turnoff = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
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
  const value_device = block.getFieldValue('EW_TEMPERATURE');
  const code = `ew.deviceGet(${value_device}, 'currentTemperature')`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.humidity = function (block) {
  const value_device = block.getFieldValue('EW_HUMIDITY');
  const code = `ew.deviceGet(${value_device}, 'currentHumidity')`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.power = function (block) {
  const value_device = block.getFieldValue('EW_POWER');
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
  const value_device = block.getFieldValue('EW_DEVICE');
  const value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.deviceSet(${value_device}, {switch: 'on', pulse: 'on', pulseWidth: ${value_time}*1000});\n`;
  return code;
};

Blockly.JavaScript.turnonpulsemode = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.deviceSet(${value_device}, {pulse: 'on', pulseWidth: ${value_time}*1000});\n`;
  return code;
};

Blockly.JavaScript.turnoffpulsemode = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const code = `ew.deviceSet(${value_device}, {pulse: 'off'});\n`;
  return code;
};

Blockly.JavaScript.doininterval = function (block) {
  const value_hour1 = Blockly.JavaScript.valueToCode(block, 'HOUR1', Blockly.JavaScript.ORDER_ATOMIC);
  const value_min1 = Blockly.JavaScript.valueToCode(block, 'MIN1', Blockly.JavaScript.ORDER_ATOMIC);
  const value_hour2 = Blockly.JavaScript.valueToCode(block, 'HOUR2', Blockly.JavaScript.ORDER_ATOMIC);
  const value_min2 = Blockly.JavaScript.valueToCode(block, 'MIN2', Blockly.JavaScript.ORDER_ATOMIC);
  const dropdown_day = block.getFieldValue('DAY');
  const statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  let code = '';
  if (dropdown_day === '-1') {
    code = `if( ew.thisDayTime() >= ew.dayTime(${value_hour1}, ${value_min1})  && ew.thisDayTime() <= ew.dayTime(${value_hour2}, ${value_min2})) {\n` +
           `${statements_name}` +
           '}\n';
  } else {
    code = `if( ew.thisDayTime() >= ew.dayTime(${value_hour1}, ${value_min1}) && ew.thisDayTime() <= ew.dayTime(${value_hour2}, ${value_min2}) && ew.thisWeekDay() === ${dropdown_day}) {\n` +
           `${statements_name}` +
           '}\n';
  }
  return code;
};

Blockly.JavaScript.hoursinterval = function (block) {
  const value_hour1 = Blockly.JavaScript.valueToCode(block, 'HOUR1', Blockly.JavaScript.ORDER_ATOMIC);
  const value_min1 = Blockly.JavaScript.valueToCode(block, 'MIN1', Blockly.JavaScript.ORDER_ATOMIC);
  const value_hour2 = Blockly.JavaScript.valueToCode(block, 'HOUR2', Blockly.JavaScript.ORDER_ATOMIC);
  const value_min2 = Blockly.JavaScript.valueToCode(block, 'MIN2', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.thisDayTime() >= ew.dayTime(${value_hour1}, ${value_min1}) && ew.thisDayTime() <= dayTime(${value_hour2}, ${value_min2})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.aftertime = function (block) {
  const value_hour = Blockly.JavaScript.valueToCode(block, 'HOUR', Blockly.JavaScript.ORDER_ATOMIC);
  const value_min = Blockly.JavaScript.valueToCode(block, 'MIN', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.thisDayTime() >= ew.dayTime(${value_hour}, ${value_min})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.beforetime = function (block) {
  const value_hour = Blockly.JavaScript.valueToCode(block, 'HOUR', Blockly.JavaScript.ORDER_ATOMIC);
  const value_min = Blockly.JavaScript.valueToCode(block, 'MIN', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `ew.thisDayTime() <= ew.dayTime(${value_hour}, ${value_min})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.dayoftheweek = function (block) {
  const dropdown_day = block.getFieldValue('DAY');
  const code = `ew.thisDayTime() === ${dropdown_day}`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.sendmail = function (block) {
  const value_email = Blockly.JavaScript.valueToCode(block, 'EMAIL', Blockly.JavaScript.ORDER_ATOMIC);
  const value_subject = Blockly.JavaScript.valueToCode(block, 'SUBJECT', Blockly.JavaScript.ORDER_ATOMIC);
  const value_body = Blockly.JavaScript.valueToCode(block, 'BODY', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  if (value_email === 'me') {
    return `MailApp.sendEmail(Session.getActiveUser().getEmail(), ${value_subject}, ${value_body});\n`;
  } else {
    return `MailApp.sendEmail(${value_email}, ${value_subject}, ${value_body});\n`;
  }
};

Blockly.JavaScript.gotnewmessage = function (block) {
  const value_from = Blockly.JavaScript.valueToCode(block, 'FROM', Blockly.JavaScript.ORDER_ATOMIC);
  const value_subject = Blockly.JavaScript.valueToCode(block, 'SUBJECT', Blockly.JavaScript.ORDER_ATOMIC);
  const value_body = Blockly.JavaScript.valueToCode(block, 'BODY', Blockly.JavaScript.ORDER_ATOMIC);
  const statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  const checkbox_markasread = block.getFieldValue('MARKASREAD') === 'TRUE';
  const checkbox_delete = block.getFieldValue('DELETE') === 'TRUE';
  let code = `ew.forAllRecentUnreadMails(${value_from}, ${value_subject}, ${value_body}, message => {\n`;
  if (checkbox_markasread) code += '  GmailApp.markMessageRead(message);\n';
  if (checkbox_delete) code += '  GmailApp.moveMessageToTrash(message);\n';
  code += statements_name;
  code += '});\n';
  return code;
};

Blockly.JavaScript.getfrom = function (block) {
  // TODO: Assemble JavaScript into code variable.
  const code = 'message.getFrom()';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
