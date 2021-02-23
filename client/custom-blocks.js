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
            'Login to get devices list',
            '0',
          ],
        ],
      },
    ],
    output: 'deviceID',
    colour: 60,
    tooltip: 'The device to operate with',
    helpUrl: '',
  },
  {
    type: 'switchedOn',
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
    colour: 210,
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
    colour: 210,
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
    colour: 150,
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
  {
    type: 'temperature',
    message0: 'Temperature %1',
    args0: [
      {
        type: 'input_value',
        name: 'Device',
        check: 'deviceID',
      },
    ],
    inputsInline: true,
    output: 'Number',
    colour: 240,
    tooltip: 'Returns the temperature reported by the device.',
    helpUrl: '',
  },
  {
    type: 'humidity',
    message0: 'Humidity %1',
    args0: [
      {
        type: 'input_value',
        name: 'Device',
        check: 'deviceID',
      },
    ],
    inputsInline: true,
    output: 'Number',
    colour: 240,
    tooltip: 'Returns the temperature reported by the device.',
    helpUrl: '',
  },
  {
    type: 'power',
    message0: 'Power %1',
    args0: [
      {
        type: 'input_value',
        name: 'Device',
        check: 'deviceID',
      },
    ],
    inputsInline: true,
    output: 'Number',
    colour: 240,
    tooltip: 'Returns the temperature reported by the device.',
    helpUrl: '',
  },
  {
    type: 'getcellvalue',
    message0: 'Get cell,  %1 Row %2 Column %3',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'input_value',
        name: 'row',
      },
      {
        type: 'input_value',
        name: 'column',
      },
    ],
    inputsInline: true,
    output: [
      'Number',
      'String',
      'Time',
    ],
    colour: 150,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'setcellvalue',
    message0: 'Set cell value,  %1 Row %2 Column %3 Value %4',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'input_value',
        name: 'row',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'column',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'Value',
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
    type: 'accamulatecell',
    message0: 'Increment the cell, %1 Row %2 Column %3 Increment %4',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'input_value',
        name: 'row',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'column',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'Value',
        check: 'Number',
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
    type: 'getlastrow',
    message0: 'Get unused row in the Sheet %1',
    args0: [
      {
        type: 'input_dummy',
      },
    ],
    inputsInline: true,
    output: 'Number',
    colour: 230,
    tooltip: 'Get the last row in the Google Sheet',
    helpUrl: '',
  },
  {
    type: 'namedsheet',
    message0: 'Set current sheet: %1',
    args0: [
      {
        type: 'input_value',
        name: 'NAME',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'currenttime',
    message0: 'Current time',
    output: 'Time',
    colour: 90,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'passedsince',
    message0: 'Time passed since, sec %1',
    args0: [
      {
        type: 'input_value',
        name: 'time',
      },
    ],
    output: 'Number',
    colour: 90,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'addsectodate',
    message0: 'Add to date, sec. Date: %1 Interval, sec %2',
    args0: [
      {
        type: 'input_value',
        name: 'date',
      },
      {
        type: 'input_value',
        name: 'interval',
        check: 'Number',
      },
    ],
    inputsInline: true,
    output: 'Time',
    colour: 90,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'addmintodate',
    message0: 'Add to date, min. Date: %1 Interval, min %2',
    args0: [
      {
        type: 'input_value',
        name: 'date',
      },
      {
        type: 'input_value',
        name: 'interval',
        check: 'Number',
      },
    ],
    inputsInline: true,
    output: 'Time',
    colour: 90,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'addhourstodate',
    message0: 'Add to date, hours. Date: %1 Interval, hours %2',
    args0: [
      {
        type: 'input_value',
        name: 'date',
      },
      {
        type: 'input_value',
        name: 'interval',
        check: 'Number',
      },
    ],
    inputsInline: true,
    output: 'Time',
    colour: 90,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'comment',
    message0: '/* %1 %2 */',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'Enter the comment there',
      },
      {
        type: 'input_dummy',
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'removerow',
    message0: 'Remove the row %1',
    args0: [
      {
        type: 'input_value',
        name: 'NAME',
        check: 'Number',
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'removecolumn',
    message0: 'Remove the column %1',
    args0: [
      {
        type: 'input_value',
        name: 'NAME',
        check: 'Number',
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'clearrange',
    message0: 'Clear range, from %1 row %2 column %3 to row %4 column %5',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'input_value',
        name: 'row0',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'column0',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'row1',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'column1',
        check: 'Number',
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 0,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'operaterange',
    message0: 'do %1 , from %2 row %3 column %4 to row %5 column %6',
    args0: [
      {
        type: 'field_dropdown',
        name: 'NAME',
        options: [
          [
            'summ',
            'summCells',
          ],
          [
            'multiply',
            'multiplyCells',
          ],
          [
            'max',
            'maxInCells',
          ],
          [
            'min',
            'minInCells',
          ],
          [
            'average',
            'averageInCells',
          ],
          [
            'deviation',
            'deviationInCells',
          ],
          [
            'concatenate',
            'concatenateCells',
          ],
          [
            'count filled',
            'countFilledCells',
          ],
        ],
      },
      {
        type: 'input_dummy',
      },
      {
        type: 'input_value',
        name: 'row0',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'column0',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'row1',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'column1',
        check: 'Number',
      },
    ],
    inputsInline: true,
    output: null,
    colour: 180,
    tooltip: '',
    helpUrl: '',
  },
  {
    type: 'turnontemporary',
    message0: 'Turn ON the device %1 and turn off after  %2 sec',
    args0: [
      {
        type: 'input_value',
        name: 'device',
        check: 'deviceID',
      },
      {
        type: 'input_value',
        name: 'time',
        check: 'Number',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: 'The device will be turned on and then turned off after the  period of time even if script will finish.  Pay attention that auto-turning off mode will be enabled on the device till the next tun on/off command from the script.',
    helpUrl: '',
  },
  {
    type: 'turnoffpulsemode',
    message0: 'Turn off pulse mode %1',
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
    tooltip: 'The pulse mode allows to turn off the device after the period of time after it will be turned ON.',
    helpUrl: '',
  },
  {
    type: 'turnonpulsemode',
    message0: 'Turn on pulse mode %1 , the delay is %2 sec',
    args0: [
      {
        type: 'input_value',
        name: 'device',
        check: 'deviceID',
      },
      {
        type: 'input_value',
        name: 'time',
        check: 'Number',
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: 'The pulse mode allows to turn off the device after the period of time after it will be turned ON.',
    helpUrl: '',
  },
  {
    type: 'ewelink',
    lastDummyAlign0: 'CENTRE',
    message0: 'eWeLink devices access %1 Email: %2 Password: %3 Region %4',
    args0: [
      {
        type: 'input_dummy',
      },
      {
        type: 'field_input',
        name: 'EMAIL',
        text: '',
      },
      {
        type: 'field_input',
        name: 'PASS',
        text: '',
      },
      {
        type: 'field_dropdown',
        name: 'REGION',
        options: [
          [
            'EU',
            'eu',
          ],
          [
            'US',
            'us',
          ],
          [
            'CN',
            'cn',
          ],
        ],
      },
    ],
    inputsInline: false,
    colour: 240,
    tooltip: 'This is mandatory block if you want to access eWeLink devices',
    helpUrl: '',
  },
];

module.exports = { customBlocks };
