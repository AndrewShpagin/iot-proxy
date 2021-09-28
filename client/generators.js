/* eslint-disable import/no-cycle */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-extend-native */
/* eslint-disable camelcase */
// import Blockly from 'blockly';

import { hashStrShort, getDevice } from './workspace';

let accumCode = '';
let tempArray = [];
let uniq = 0;
export function startCodeGeneration() {
  accumCode = '';
  tempArray = [];
  uniq = 0;
}
export function endCodeGeneration(code) {
  return code + accumCode;
}

let ewpreffix = '';

export function setPreffix(prf) {
  ewpreffix = prf;
}

function gang(name) {
  if (name.length > 8) {
    const c3 = name.indexOf('[outlet:');
    if (c3 >= 0) {
      const c4 = name.indexOf(']', c3 + 8);
      return parseInt(name.slice(c3 + 8, c4), 10);
    }
  }
  return -1;
}
Blockly.JavaScript.switchedOn = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const code = `${ewpreffix}deviceGet(${value_device}, 'switch') === 'on'`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.switchedOff = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const code = `${ewpreffix}deviceGet(${value_device}, 'switch') === 'off'`;
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
  const code = ewpreffix.length > 0 ? `${ewpreffix}log(${value_name});\n` : `console.log(${value_name});\n`;
  return code;
};

Blockly.JavaScript.device_state = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const value_state = Blockly.JavaScript.valueToCode(block, 'State', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}deviceGet(${value_device}, '${value_state}')`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.pause = function (block) {
  const value_pause = Blockly.JavaScript.valueToCode(block, 'pause', Blockly.JavaScript.ORDER_ATOMIC);
  if (ewpreffix.length) return `${ewpreffix}makePause(${value_pause}*1000);\n`;
  return `Utilities.sleep(${value_pause}*1000);\n`;
};

Blockly.JavaScript.turnon = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const g = gang(value_device);
  return g === -1 ?
    `${ewpreffix}deviceSet(${value_device}, {switch: 'on', pulse: 'off'});\n` :
    `${ewpreffix}deviceSet(${value_device}, {switches:[{switch: "on", outlet: ${g} }]});\n`;
};

Blockly.JavaScript.turnoff = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const g = gang(value_device);
  return g === -1 ?
    `${ewpreffix}deviceSet(${value_device}, {switch: 'off', pulse: 'off'});\n` :
    `${ewpreffix}deviceSet(${value_device}, {switches:[{switch: "off", outlet: ${g} }]});\n`;
};

Blockly.JavaScript.setbrightness = function (block) {
  const value_device = block.getFieldValue('EW_BRIGHTNESS');
  const value_value = Blockly.JavaScript.valueToCode(block, 'Value', Blockly.JavaScript.ORDER_ATOMIC);
  return `${ewpreffix}deviceSet(${value_device}, {brightness: ${value_value}});\n`;
};

Blockly.JavaScript.temperature = function (block) {
  const value_device = block.getFieldValue('EW_TEMPERATURE');
  const dev = getDevice(value_device);
  let code = '';
  if (dev && 'temperature' in dev)code = `${ewpreffix}toInt(${ewpreffix}deviceGet(${value_device}, 'temperature')) / 100.0`;
  else code = `${ewpreffix}deviceGet(${value_device}, 'currentTemperature')`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.brightness = function (block) {
  const value_device = block.getFieldValue('EW_BRIGHTNESS');
  let code = '';
  code = `${ewpreffix}toInt(${ewpreffix}deviceGet(${value_device}, 'brightness'))`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.battery = function (block) {
  const value_device = block.getFieldValue('EW_BATTERY');
  const code = `${ewpreffix}deviceGet(${value_device}, 'battery')`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.motion = function (block) {
  const value_device = block.getFieldValue('EW_MOTION');
  const code = `${ewpreffix}toInt(${ewpreffix}deviceGet(${value_device}, 'motion')) === 1`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.humidity = function (block) {
  const value_device = block.getFieldValue('EW_HUMIDITY');
  const dev = getDevice(value_device);
  let code = '';
  if (dev && 'humidity' in dev)code = `${ewpreffix}toInt(${ewpreffix}deviceGet(${value_device}, 'humidity')) / 100.0`;
  else code = `${ewpreffix}deviceGet(${value_device}, 'currentHumidity')`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.power = function (block) {
  const value_device = block.getFieldValue('EW_POWER');
  const code = `${ewpreffix}deviceGet(${value_device}, 'power')`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.getcellvalue = function (block) {
  const value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  const value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}getCell(${value_row}, ${value_column})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.setcellvalue = function (block) {
  const value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  const value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  const value_value = Blockly.JavaScript.valueToCode(block, 'Value', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  const code = `${ewpreffix}setCell(${value_row}, ${value_column}, ${value_value});\n`;
  return code;
};

Blockly.JavaScript.accamulatecell = function (block) {
  const value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  const value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  const value_value = Blockly.JavaScript.valueToCode(block, 'Value', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}incrementCell(${value_row}, ${value_column}, ${value_value});\n`;
  return code;
};

Blockly.JavaScript.getlastrow = function () {
  const code = `${ewpreffix}lastUnusedRow`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.namedsheet = function (block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  let code = `${ewpreffix}mySheet = SpreadsheetApp.getSheetByName(${value_name});\n${ewpreffix}lastUnusedRow = mySheet.getLastRow() + 1;\n`;
  if (ewpreffix.length) {
    code = `${ewpreffix}error('Only one table per script allowed!');\n`;
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.currenttime = function () {
  const code = `${ewpreffix}now()`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.passedsince = function (block) {
  const value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `(${ewpreffix}now() - ${ewpreffix}toDate(${value_time}))/1000`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.addsectodate = function (block) {
  const value_date = Blockly.JavaScript.valueToCode(block, 'date', Blockly.JavaScript.ORDER_ATOMIC);
  const value_interval = Blockly.JavaScript.valueToCode(block, 'interval', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}toDate(${value_date}.getTime() + ${value_interval}*1000)`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.addmintodate = function (block) {
  const value_date = Blockly.JavaScript.valueToCode(block, 'date', Blockly.JavaScript.ORDER_ATOMIC);
  const value_interval = Blockly.JavaScript.valueToCode(block, 'interval', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}toDate(${value_date}.getTime() + ${value_interval}*1000*60)`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.addhourstodate = function (block) {
  const value_date = Blockly.JavaScript.valueToCode(block, 'date', Blockly.JavaScript.ORDER_ATOMIC);
  const value_interval = Blockly.JavaScript.valueToCode(block, 'interval', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}toDate(${value_date}.getTime() + ${value_interval}*1000*60*60)`;
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
  const code = `${ewpreffix}clearCells(${value_row0}, ${value_column0}, ${value_row1}, ${value_column1});\n`;
  return code;
};

Blockly.JavaScript.removerow = function (block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  const code = `${ewpreffix}deleteRow(${value_name});\n`;
  return code;
};

Blockly.JavaScript.removecolumn = function (block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  const code = `${ewpreffix}deleteColumn(${value_name});\n`;
  return code;
};

Blockly.JavaScript.operaterange = function (block) {
  const dropdown_name = block.getFieldValue('NAME');
  const value_row0 = Blockly.JavaScript.valueToCode(block, 'row0', Blockly.JavaScript.ORDER_ATOMIC);
  const value_column0 = Blockly.JavaScript.valueToCode(block, 'column0', Blockly.JavaScript.ORDER_ATOMIC);
  const value_row1 = Blockly.JavaScript.valueToCode(block, 'row1', Blockly.JavaScript.ORDER_ATOMIC);
  const value_column1 = Blockly.JavaScript.valueToCode(block, 'column1', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}${dropdown_name}(${value_row0}, ${value_column0}, ${value_row1}, ${value_column1})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.turnontemporary = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  const g = gang(value_device);
  const code = g === -1 ?
    `${ewpreffix}deviceSet(${value_device}, {switch: 'on', pulse: 'on', pulseWidth: ${value_time}*1000});\n` :
    `${ewpreffix}deviceSet(${value_device}, {switches: [{switch: 'on', outlet: ${g}}], pulses: [{pulse: 'on', width: ${value_time}*1000, outlet: ${g}}]});\n`;
  return code;
};

Blockly.JavaScript.turnonpulsemode = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const g = gang(value_device);
  const value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  const code = g === -1 ?
    `${ewpreffix}deviceSet(${value_device}, {pulse: 'on', pulseWidth: ${value_time}*1000});\n` :
    `${ewpreffix}deviceSet(${value_device}, {pulses: [{pulse: 'on', width: ${value_time}*1000, outlet: ${g}}]});\n`;
  return code;
};

Blockly.JavaScript.turnoffpulsemode = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const g = gang(value_device);
  const code = g === -1 ?
    `${ewpreffix}deviceSet(${value_device}, {pulse: 'off'});\n` :
    `${ewpreffix}deviceSet(${value_device}, {pulses: [{pulse: 'off', outlet: ${g}}]});\n`;
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
    code = `if( ${ewpreffix}thisDayTime() >= ${ewpreffix}dayTime(${value_hour1}, ${value_min1})  && ${ewpreffix}thisDayTime() <= ${ewpreffix}dayTime(${value_hour2}, ${value_min2})) {\n` +
           `${statements_name}` +
           '}\n';
  } else {
    code = `if( ${ewpreffix}thisDayTime() >= ${ewpreffix}dayTime(${value_hour1}, ${value_min1}) && ${ewpreffix}thisDayTime() <= ${ewpreffix}dayTime(${value_hour2}, ${value_min2}) && ${ewpreffix}thisWeekDay() === ${dropdown_day}) {\n` +
           `${statements_name}` +
           '}\n';
  }
  return code;
};

Blockly.JavaScript.doinweekdays = function (block) {
  const value_hour1 = Blockly.JavaScript.valueToCode(block, 'HOUR1', Blockly.JavaScript.ORDER_ATOMIC);
  const value_min1 = Blockly.JavaScript.valueToCode(block, 'MIN1', Blockly.JavaScript.ORDER_ATOMIC);
  const value_hour2 = Blockly.JavaScript.valueToCode(block, 'HOUR2', Blockly.JavaScript.ORDER_ATOMIC);
  const value_min2 = Blockly.JavaScript.valueToCode(block, 'MIN2', Blockly.JavaScript.ORDER_ATOMIC);
  let days = '';
  for (let k = 0; k < 7; k++) {
    if (block.getFieldValue(`W${k}`) === 'TRUE') {
      if (days.length)days += ', ';
      days += k;
    }
  }
  days = `[${days}]`;
  const statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  let code = '';
  if (days.length === 21) {
    code = `if( ${ewpreffix}thisDayTime() >= ${ewpreffix}dayTime(${value_hour1}, ${value_min1})  && ${ewpreffix}thisDayTime() <= ${ewpreffix}dayTime(${value_hour2}, ${value_min2})) {\n` +
           `${statements_name}` +
           '}\n';
  } else {
    code = `if( ${ewpreffix}thisDayTime() >= ${ewpreffix}dayTime(${value_hour1}, ${value_min1}) && ${ewpreffix}thisDayTime() <= ${ewpreffix}dayTime(${value_hour2}, ${value_min2}) && ${days}.includes(${ewpreffix}thisWeekDay())) {\n` +
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
  const code = `${ewpreffix}thisDayTime() >= ${ewpreffix}dayTime(${value_hour1}, ${value_min1}) && ${ewpreffix}thisDayTime() <= dayTime(${value_hour2}, ${value_min2})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.aftertime = function (block) {
  const value_hour = Blockly.JavaScript.valueToCode(block, 'HOUR', Blockly.JavaScript.ORDER_ATOMIC);
  const value_min = Blockly.JavaScript.valueToCode(block, 'MIN', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}thisDayTime() >= ${ewpreffix}dayTime(${value_hour}, ${value_min})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.beforetime = function (block) {
  const value_hour = Blockly.JavaScript.valueToCode(block, 'HOUR', Blockly.JavaScript.ORDER_ATOMIC);
  const value_min = Blockly.JavaScript.valueToCode(block, 'MIN', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}thisDayTime() <= ${ewpreffix}dayTime(${value_hour}, ${value_min})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.dayoftheweek = function (block) {
  const dropdown_day = block.getFieldValue('DAY');
  const code = `${ewpreffix}thisWeekDay() === ${dropdown_day}`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.sendmail = function (block) {
  const value_email = Blockly.JavaScript.valueToCode(block, 'EMAIL', Blockly.JavaScript.ORDER_ATOMIC);
  const value_subject = Blockly.JavaScript.valueToCode(block, 'SUBJECT', Blockly.JavaScript.ORDER_ATOMIC);
  const value_body = Blockly.JavaScript.valueToCode(block, 'BODY', Blockly.JavaScript.ORDER_ATOMIC);
  let code = `console.log('Sent email to', ${value_email}, 'subject:', ${value_subject});\n`;
  if (ewpreffix.length) {
    code += `${ewpreffix}sendEmail(${value_email}, ${value_subject}, ${value_body});\n`;
  } else
  if (value_email === 'me' || value_email === "'me'") {
    code += `MailApp.sendEmail(Session.getActiveUser().getEmail(), ${value_subject}, ${value_body});\n`;
  } else {
    code += `MailApp.sendEmail(${value_email}, ${value_subject}, ${value_body});\n`;
  }
  return code;
};

Blockly.JavaScript.gotnewmessage = function (block) {
  const value_from = Blockly.JavaScript.valueToCode(block, 'FROM', Blockly.JavaScript.ORDER_ATOMIC);
  const value_subject = Blockly.JavaScript.valueToCode(block, 'SUBJECT', Blockly.JavaScript.ORDER_ATOMIC);
  const value_body = Blockly.JavaScript.valueToCode(block, 'BODY', Blockly.JavaScript.ORDER_ATOMIC);
  const statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  const checkbox_markasread = block.getFieldValue('MARKASREAD') === 'TRUE';
  const checkbox_delete = block.getFieldValue('DELETE') === 'TRUE';
  let code = `${ewpreffix}forAllRecentUnreadMails(${value_from}, ${value_subject}, ${value_body}, message => {\n`;
  if (checkbox_markasread) code += '  GmailApp.markMessageRead(message);\n';
  if (checkbox_delete) code += '  GmailApp.moveMessageToTrash(message);\n';
  code += statements_name;
  code += '});\n';
  return code;
};

Blockly.JavaScript.getfrom = function () {
  // TODO: Assemble JavaScript into code variable.
  const code = 'message.getFrom()';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.controls_forEach = function (block) {
  // For each loop.
  const variable0 = Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE,
  );
  const argument0 = Blockly.JavaScript.valueToCode(block, 'LIST',
    Blockly.JavaScript.ORDER_ASSIGNMENT) || '[]';
  let branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  let code = '';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  let listVar = argument0;
  if (!argument0.match(/^\w+$/)) {
    listVar = Blockly.JavaScript.variableDB_.getDistinctName(
      `${variable0}_list`, Blockly.Variables.NAME_TYPE,
    );
    code += `var ${listVar} = ${argument0};\n`;
  }
  const indexVar = Blockly.JavaScript.variableDB_.getDistinctName(
    `${variable0}_index`, Blockly.Variables.NAME_TYPE,
  );
  branch = `${Blockly.JavaScript.INDENT + variable0} = ${
    listVar}[${indexVar}];\n${branch}`;
  code += `for (var ${indexVar} of ${listVar}) {if (${listVar}.hasOwnProperty(${indexVar})) {\n${branch}}}\n`;
  return code;
};

Blockly.JavaScript.onlineofflinepassed = function (block) {
  const device = block.getFieldValue('EW_DEVICE');
  const dropdown_state = block.getFieldValue('STATE');
  const dropdown_timeunits = block.getFieldValue('TIMEUNITS');
  let code = '';
  let K = 60;
  if (dropdown_timeunits === 'HOURS')K *= 60;
  if (dropdown_timeunits === 'DAYS')K *= 24 * 60;
  if (dropdown_state === 'ONLINE') {
    code = `${ewpreffix}secondsPassedSinceOnline(${device}) / ${K}`;
  } else {
    code = `${ewpreffix}secondsPassedSinceOffline(${device}) / ${K}`;
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.isonline = function (block) {
  const value_device = block.getFieldValue('EW_DEVICE');
  const g = gang(value_device);
  const dropdown_state = block.getFieldValue('STATE');
  let code = '';
  if (dropdown_state === 'ONLINE') code = `${ewpreffix}deviceGet(${value_device}, 'online')`;
  if (dropdown_state === 'OFFLINE')code = `!${ewpreffix}deviceGet(${value_device}, 'online')`;
  if (dropdown_state === 'ON') {
    code = g === -1 ?
      `${ewpreffix}deviceGet(${value_device}, 'switch') === 'on'` :
      `${ewpreffix}deviceGet(${value_device})', 'params.switches[${g}].switch') === 'on'`;
  }
  if (dropdown_state === 'OFF') {
    code = g === -1 ?
      `${ewpreffix}deviceGet(${value_device}, 'switch') === 'off'` :
      `${ewpreffix}deviceGet(${value_device}, 'params.switches[${g}].switch') === 'off'`;
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.statechanged = function (block) {
  const dropdown_ew_device = block.getFieldValue('EW_DEVICE');
  const g = gang(dropdown_ew_device);
  let dropdown_state = block.getFieldValue('STATE');
  if (g !== -1 && dropdown_state === 'switch') {
    dropdown_state = `params.switches[${g}].switch`;
  }
  const statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  const code = `if (${ewpreffix}stateChanged(${dropdown_ew_device}, '${dropdown_state}')) {\n${statements_name}}\n`;
  const s = `${dropdown_ew_device}+${dropdown_state}`;
  if (!(s in tempArray)) {
    tempArray.push(s);
    accumCode += `${ewpreffix}storeDeviceState(${dropdown_ew_device}, '${dropdown_state}');\n`;
  }
  return code;
};

Blockly.JavaScript.sincelastrun = function (block) {
  const units = Number.parseInt(block.getFieldValue('UNITS'), 10);
  const code = units > 1 ? `${passedSinceLastRun}/${units}` : `${passedSinceLastRun}`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.accumtime = function (block) {
  const value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
  const value_limit = Blockly.JavaScript.valueToCode(block, 'LIMIT', Blockly.JavaScript.ORDER_ATOMIC);
  const units = Number.parseInt(block.getFieldValue('UNITS'), 10);
  let statements_todo = Blockly.JavaScript.statementToCode(block, 'TODO');
  const hash = hashStrShort(value_value);
  const varname = `prev_state_${hash}`;
  const timename = `accum_time_${hash}`;
  const mulsuffix = units > 1 ? `  limit *= ${units};\n` : '';
  statements_todo = statements_todo.replace(/\n/g, '\n  ');
  const code =
    // eslint-disable-next-line prefer-template
    '{\n' +
    `  const cur = ${value_value};\n` +
    `  let limit = ${value_limit};\n` + mulsuffix +
    `  let time = ${ewpreffix}toFloat(${ewpreffix}getProperty('${timename}') || '0');\n` +
    `  if (cur && cur.toString() === ${ewpreffix}getProperty('${varname}')) time += passedSinceLastRun;\n` +
    '  console.log(\'Accumulated time:\', time);\n' +
    '  if (time > limit) {\n' +
    '    time -= limit;\n' +
    `  ${statements_todo}}\n` +
    `  ${ewpreffix}setProperty('${timename}', time);\n` +
    `  ${ewpreffix}setProperty('${varname}', cur);\n` +
    '}\n';
  return code;
};

Blockly.JavaScript.cellaccumulate = function (block) {
  const value_row = Blockly.JavaScript.valueToCode(block, 'ROW', Blockly.JavaScript.ORDER_ATOMIC);
  const value_column = Blockly.JavaScript.valueToCode(block, 'COLUMN', Blockly.JavaScript.ORDER_ATOMIC);
  const units = block.getFieldValue('UNITS');
  const value_cond = Blockly.JavaScript.valueToCode(block, 'COND', Blockly.JavaScript.ORDER_ATOMIC);
  const suffix = `${uniq + 1}_${value_row}${value_column}`;
  const divsuffix = units > 1 ? `  / ${units}` : '';
  uniq++;
  const code =
    // eslint-disable-next-line prefer-template
    `const cur_state${uniq} = ${value_cond};\n` +
    `if (cur_state${uniq} && cur_state${uniq}.toString() === ${ewpreffix}getProperty('state${suffix}')) ${ewpreffix}incrementCell(${value_row}, ${value_column}, passedSinceLastRun${divsuffix});\n` +
    `${ewpreffix}setProperty('state${suffix}', cur_state${uniq});\n`;
  return code;
};

Blockly.JavaScript.sendtelegram = function (block) {
  const value_chatid = Blockly.JavaScript.valueToCode(block, 'chatid', Blockly.JavaScript.ORDER_ATOMIC);
  const value_msg = Blockly.JavaScript.valueToCode(block, 'msg', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}sendTelegramMessage(${value_chatid}, ${value_msg});\n`;
  if (value_chatid.length >= 11 && value_chatid.length < 20) {
    // console.log(value_chatid.substring(1, value_chatid.length - 1));
    localStorage.setItem('telegramChatID', value_chatid.substring(1, value_chatid.length - 1));
  }
  return code;
};

Blockly.JavaScript.sendviber = function (block) {
  const value_chatid = Blockly.JavaScript.valueToCode(block, 'chatid', Blockly.JavaScript.ORDER_ATOMIC);
  const value_msg = Blockly.JavaScript.valueToCode(block, 'msg', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}sendViberMessage(${value_chatid}, ${value_msg});\n`;
  if (value_chatid.length >= 11 && value_chatid.length < 20) {
    // console.log(value_chatid.substring(1, value_chatid.length - 1));
    localStorage.setItem('viberChatID', value_chatid.substring(1, value_chatid.length - 1));
  }
  return code;
};

Blockly.JavaScript.getunusedincol = function (block) {
  const value_column = Blockly.JavaScript.valueToCode(block, 'column', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}findUnusedRowInColumn(${value_column})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.insertrow = function (block) {
  const value_row = Blockly.JavaScript.valueToCode(block, 'row', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}insertEmptyRow(${value_row});\n`;
  return code;
};

Blockly.JavaScript.insertcol = function (block) {
  const value_col = Blockly.JavaScript.valueToCode(block, 'col', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `${ewpreffix}insertEmptyColumn(${value_col});\n`;
  return code;
};

Blockly.JavaScript.gotmsg = function (block) {
  const value_chatid = Blockly.JavaScript.valueToCode(block, 'chatid', Blockly.JavaScript.ORDER_ATOMIC);
  const variable_msg = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('msg'), Blockly.Variables.NAME_TYPE);
  const statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  const code =
    `${ewpreffix}forEachMessage(${value_chatid}, msg => {\n` +
    `  ${variable_msg} = msg;\n` +
    `${statements_name}});\n`;
  return code;
};
