/* eslint-disable camelcase */
import Blockly from 'blockly';

Blockly.JavaScript.switched = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `device_state(${value_device}, 'switch') === 'on'`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.switchedOff = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `device_state(${value_device}, 'switch') === 'off'`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.device = function (block) {
  const dropdown_name = block.getFieldValue('NAME');
  const code = `'${dropdown_name}'`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.console = function (block) {
  const value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `console(${value_name});\n`;
  return code;
};

Blockly.JavaScript.device_state = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'Device', Blockly.JavaScript.ORDER_ATOMIC);
  const value_state = Blockly.JavaScript.valueToCode(block, 'State', Blockly.JavaScript.ORDER_ATOMIC);
  const code = `device_state(${value_device}, ${value_state})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.pause = function (block) {
  const value_pause = Blockly.JavaScript.valueToCode(block, 'pause', Blockly.JavaScript.ORDER_ATOMIC);
  const code = ';\n';
  return code;
};

Blockly.JavaScript.turnon = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = ';\n';
  return code;
};

Blockly.JavaScript.turnoff = function (block) {
  const value_device = Blockly.JavaScript.valueToCode(block, 'device', Blockly.JavaScript.ORDER_ATOMIC);
  const code = ';\n';
  return code;
};
