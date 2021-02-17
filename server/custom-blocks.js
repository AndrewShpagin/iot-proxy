const customBlocks =
[
  {
    type: 'device',
    message0: 'Device %1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'NAME',
        options: [
          [
            'Device1',
            'Device1',
          ],
          [
            'Device2',
            'Device2',
          ],
          [
            'Device3',
            'Device3',
          ],
        ],
      },
    ],
    output: 'deviceID',
    colour: 230,
    tooltip: 'The device to operate with',
    helpUrl: '',
  },
  {
    type: 'switched',
    message0: 'Turned ON? %1 %2',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'input_value',
        name: 'Device',
        check: 'deviceID',
      },
    ],
    inputsInline: true,
    output: 'Boolean',
    colour: 230,
    tooltip: 'Check if the device turned ON',
    helpUrl: '',
  },
  {
    type: 'switchedOff',
    message0: 'Turned OFF? %1 %2',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'input_value',
        name: 'Device',
        check: 'deviceID',
      },
    ],
    inputsInline: true,
    output: 'Boolean',
    colour: 230,
    tooltip: 'Check if the device turned OFF',
    helpUrl: '',
  },
  {
    type: 'console',
    message0: 'console %1',
    args0: [
      {
        type: 'input_value',
        name: 'NAME',
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'device_state',
    message0: 'device: %1 state: %2',
    args0: [
      {
        type: 'input_value',
        name: 'Device',
        check: 'deviceID',
      },
      {
        type: 'input_value',
        name: 'State',
        check: 'String',
      },
    ],
    inputsInline: true,
    output: 'String',
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'pause',
    message0: 'Pause, sec %1',
    args0: [
      {
        type: 'input_value',
        name: 'pause',
        check: 'Number',
      },
    ],
    colour: 230,
    previousStatement: null,
    nextStatement: null,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'turnon',
    message0: 'Turn ON %1',
    args0: [
      {
        type: 'input_value',
        name: 'device',
        check: 'deviceID',
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 135,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'turnoff',
    message0: 'Turn OFF %1',
    args0: [
      {
        type: 'input_value',
        name: 'device',
        check: 'deviceID',
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
];

module.exports = { customBlocks };
