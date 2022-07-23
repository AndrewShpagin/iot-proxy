const defDevs = '%{BKY_LOGIN}';
const customBlocks =
  [
    {
      type: 'switchedOn',
      message0: '%{BKY_DEVSWITCHEDON}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_DEVICE',
          options: [[defDevs, '0']],
        },
      ],
      inputsInline: true,
      output: 'Boolean',
      colour: 210,
      tooltip: '%{BKY_DEVSWITCHEDON_HINT}',
      helpUrl: '',
    },
    {
      type: 'switchedOff',
      message0: '%{BKY_DEVSWITCHEDOFF}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_DEVICE',
          options: [[defDevs, '0']],
        },
      ],
      inputsInline: true,
      output: 'Boolean',
      colour: 210,
      tooltip: '%{BKY_DEVSWITCHEDOFF_HINT}',
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
      message0: '%{BKY_DEVSTATE12}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_DEVICE',
          options: [[defDevs, '0']],
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
      message0: '%{BKY_PAUSESEC1}',
      args0: [
        {
          type: 'input_value',
          name: 'pause',
          check: 'Number',
        },
      ],
      colour: '#60AA40',
      previousStatement: null,
      nextStatement: null,
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'turnon',
      message0: '%{BKY_TURNON1}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_DEVICE',
          options: [[defDevs, '0']],
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
      message0: '%{BKY_TURNOFF1}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_DEVICE',
          options: [[defDevs, '0']],
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
      message0: '%{BKY_TEMPERATURE1}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_TEMPERATURE',
          options: [[defDevs, '0']],
        },
      ],
      inputsInline: true,
      output: 'Number',
      colour: 240,
      tooltip: '%{BKY_REPORTT}',
      helpUrl: '',
    },
    {
      type: 'brightness',
      message0: '%{BKY_BRIGHTNESS1}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_BRIGHTNESS',
          options: [[defDevs, '0']],
        },
      ],
      inputsInline: true,
      output: 'Number',
      colour: 240,
      tooltip: '%{BKY_REPORTB}',
      helpUrl: '',
    },
    {
      type: 'setbrightness',
      message0: '%{BKY_SETBRIGHTNESS2}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_BRIGHTNESS',
          options: [[defDevs, '0']],
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
      colour: 240,
      tooltip: '%{BKY_SETBR}',
      helpUrl: '',
    },
    {
      type: 'battery',
      message0: '%{BKY_BATTERY1}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_BATTERY',
          options: [[defDevs, '0']],
        },
      ],
      inputsInline: true,
      output: 'Number',
      colour: 240,
      tooltip: '%{BKY_REPORTT}',
      helpUrl: '',
    },
    {
      type: 'motion',
      message0: '%{BKY_MOTION1}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_MOTION',
          options: [[defDevs, '0']],
        },
      ],
      inputsInline: true,
      output: 'Boolean',
      colour: 240,
      tooltip: '%{BKY_REPORTT}',
      helpUrl: '',
    },
    {
      type: 'humidity',
      message0: '%{BKY_HUMIDITY1}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_HUMIDITY',
          options: [[defDevs, '0']],
        },
      ],
      inputsInline: true,
      output: 'Number',
      colour: 240,
      tooltip: '%{BKY_REPORTH}',
      helpUrl: '',
    },
    {
      type: 'power',
      message0: '%{BKY_POWER1}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_POWER',
          options: [[defDevs, '0']],
        },
      ],
      inputsInline: true,
      output: 'Number',
      colour: 240,
      tooltip: '%{BKY_REPORTP}',
      helpUrl: '',
    },
    {
      type: 'getcellvalue',
      message0: '%{BKY_GETCELL123}',
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
      message0: '%{BKY_SETCELL123}',
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
      message0: '%{BKY_INCCELL1234}',
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
      message0: '%{BKY_UNUSEDROW1}',
      args0: [
        {
          type: 'input_dummy',
        },
      ],
      inputsInline: true,
      output: 'Number',
      colour: 230,
      tooltip: '%{BKY_GETLASTROWGS}',
      helpUrl: '',
    },
    {
      type: 'namedsheet',
      message0: '%{BKY_SETSHEET}',
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
      message0: '%{BKY_DATENOW}',
      output: 'Time',
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'passedsince',
      message0: '%{BKY_PASSEDSINCE}',
      args0: [
        {
          type: 'input_value',
          name: 'time',
        },
      ],
      output: 'Number',
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'addsectodate',
      message0: '%{BKY_ADDSEC12}',
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
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'addmintodate',
      message0: '%{BKY_ADDMIN12}',
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
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'addhourstodate',
      message0: '%{BKY_ADDHOUR12}',
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
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'comment',
      message0: '%{BKY_COMMENT12}',
      args0: [
        {
          type: 'field_input',
          name: 'NAME',
          text: '%{BKY_ENTERCOMMENT}',
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
      message0: '%{BKY_REMOVEROW1}',
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
      message0: '%{BKY_REMOVECOLUMN1}',
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
      message0: '%{BKY_CLEARRANE12345}',
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
      message0: '%{BKY_DOINRANE16}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'NAME',
          options: [
            [
              '%{BKY_CLSUMM}',
              'summCells',
            ],
            [
              '%{BKY_CLMUL}',
              'multiplyCells',
            ],
            [
              '%{BKY_CLMAX}',
              'maxInCells',
            ],
            [
              '%{BKY_CLMIN}',
              'minInCells',
            ],
            [
              '%{BKY_CLAVG}',
              'averageInCells',
            ],
            [
              '%{BKY_CLDEVI}',
              'deviationInCells',
            ],
            [
              '%{BKY_CLCONC}',
              'concatenateCells',
            ],
            [
              '%{BKY_CLCOUNT}',
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
      message0: '%{BKY_TURNONTEMP}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_DEVICE',
          options: [[defDevs, '0']],
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
      tooltip: '%{BKY_TURNONTEMP_HINT}',
      helpUrl: '',
    },
    {
      type: 'turnoffpulsemode',
      message0: '%{BKY_TURNOFFPULSE1}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_DEVICE',
          options: [[defDevs, '0']],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: 0,
      tooltip: '%{BKY_TURNOFFPULSE1_HINT}',
      helpUrl: '',
    },
    {
      type: 'turnonpulsemode',
      message0: '%{BKY_TURNONPULSE12}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_DEVICE',
          options: [[defDevs, '0']],
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
      tooltip: '%{BKY_TURNONPULSE12_HINT}',
      helpUrl: '',
    },
    {
      type: 'doininterval',
      message0: '%{BKY_DOININTERVAL17}',
      args0: [
        {
          type: 'input_value',
          name: 'HOUR1',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'MIN1',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'HOUR2',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'MIN2',
          check: 'Number',
        },
        {
          type: 'field_dropdown',
          name: 'DAY',
          options: [
            [
              '%{BKY_ANYDAY}',
              '-1',
            ],
            [
              '%{BKY_SUNDAY}',
              '0',
            ],
            [
              '%{BKY_MONDAY}',
              '1',
            ],
            [
              '%{BKY_TUESDAY}',
              '2',
            ],
            [
              '%{BKY_WEDNESDAY}',
              '3',
            ],
            [
              '%{BKY_THURSDAY}',
              '4',
            ],
            [
              '%{BKY_FRIDAY}',
              '5',
            ],
            [
              '%{BKY_SATURDAY}',
              '6',
            ],
          ],
        },
        {
          type: 'input_dummy',
        },
        {
          type: 'input_statement',
          name: 'NAME',
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'doinweekdays',
      message0: '%{BKY_WEEKSDAYSSET}',
      args0: [
        {
          type: 'input_value',
          name: 'HOUR1',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'MIN1',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'HOUR2',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'MIN2',
          check: 'Number',
        },
        {
          type: 'field_checkbox',
          name: 'W0',
          checked: true,
        },
        {
          type: 'field_checkbox',
          name: 'W1',
          checked: true,
        },
        {
          type: 'field_checkbox',
          name: 'W2',
          checked: true,
        },
        {
          type: 'field_checkbox',
          name: 'W3',
          checked: true,
        },
        {
          type: 'field_checkbox',
          name: 'W4',
          checked: true,
        },
        {
          type: 'field_checkbox',
          name: 'W5',
          checked: true,
        },
        {
          type: 'field_checkbox',
          name: 'W6',
          checked: true,
        },
        {
          type: 'input_dummy',
        },
        {
          type: 'input_statement',
          name: 'NAME',
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'hoursinterval',
      message0: '%{BKY_FROM1234}',
      args0: [
        {
          type: 'input_value',
          name: 'HOUR1',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'MIN1',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'HOUR2',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'MIN2',
          check: 'Number',
        },
      ],
      inputsInline: true,
      output: 'Boolean',
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'aftertime',
      message0: '%{BKY_AFTER12}',
      args0: [
        {
          type: 'input_value',
          name: 'HOUR',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'MIN',
          check: 'Number',
        },
      ],
      inputsInline: true,
      output: 'Boolean',
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'beforetime',
      message0: '%{BKY_BEFORE12}',
      args0: [
        {
          type: 'input_value',
          name: 'HOUR',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'MIN',
          check: 'Number',
        },
      ],
      inputsInline: true,
      output: 'Boolean',
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'dayoftheweek',
      message0: '%{BKY_ISTODAY}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'DAY',
          options: [
            [
              '%{BKY_SUNDAY}',
              '0',
            ],
            [
              '%{BKY_MONDAY}',
              '1',
            ],
            [
              '%{BKY_TUESDAY}',
              '2',
            ],
            [
              '%{BKY_WEDNESDAY}',
              '3',
            ],
            [
              '%{BKY_THURSDAY}',
              '4',
            ],
            [
              '%{BKY_FRIDAY}',
              '5',
            ],
            [
              '%{BKY_SATURDAY}',
              '6',
            ],
          ],
        },
      ],
      output: 'Boolean',
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'sendmail',
      message0: '%{BKY_SENDEMAIL123}',
      args0: [
        {
          type: 'input_value',
          name: 'EMAIL',
          align: 'RIGHT',
        },
        {
          type: 'input_value',
          name: 'SUBJECT',
          align: 'RIGHT',
        },
        {
          type: 'input_value',
          name: 'BODY',
          align: 'RIGHT',
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
      type: 'gotnewmessage',
      message0: '%{BKY_LISTEMAILS17}',
      args0: [
        {
          type: 'input_dummy',
        },
        {
          type: 'input_value',
          name: 'FROM',
          check: 'String',
          align: 'RIGHT',
        },
        {
          type: 'input_value',
          name: 'SUBJECT',
          check: 'String',
          align: 'RIGHT',
        },
        {
          type: 'input_value',
          name: 'BODY',
          check: 'String',
          align: 'RIGHT',
        },
        {
          type: 'input_statement',
          name: 'NAME',
        },
        {
          type: 'field_checkbox',
          name: 'MARKASREAD',
          checked: true,
        },
        {
          type: 'field_checkbox',
          name: 'DELETE',
          checked: false,
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
      type: 'getfrom',
      message0: '%{BKY_WHOSENT}',
      output: 'String',
      colour: 230,
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'onlineofflinepassed',
      message0: '%{BKY_ONLINEOFFLINE}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_DEVICE',
          options: [[defDevs, '0']],
          validate(newValue) {
            console.log('validate', newValue);
          },
        },
        {
          type: 'field_dropdown',
          name: 'STATE',
          options: [
            [
              '%{BKY_ONLINE}',
              'ONLINE',
            ],
            [
              '%{BKY_OFFLINE}',
              'OFFLINE',
            ],
          ],
        },
        {
          type: 'field_dropdown',
          name: 'TIMEUNITS',
          options: [
            [
              '%{BKY_MINUTES}',
              'MINUTES',
            ],
            [
              '%{BKY_HOURS}',
              'HOURS',
            ],
            [
              '%{BKY_DAYS}',
              'DAYS',
            ],
          ],
        },
      ],
      output: 'Number',
      colour: 230,
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'isonline',
      message0: '%{BKY_ISONLINE}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_DEVICE',
          options: [[defDevs, '0']],
        },
        {
          type: 'field_dropdown',
          name: 'STATE',
          options: [
            [
              '%{BKY_SWITCHEDON}',
              'ON',
            ],
            [
              '%{BKY_SWITCHEDOFF}',
              'OFF',
            ],
            [
              '%{BKY_ONLINE}',
              'ONLINE',
            ],
            [
              '%{BKY_OFFLINE}',
              'OFFLINE',
            ],
          ],
        },
      ],
      inputsInline: true,
      output: 'Boolean',
      colour: 210,
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'statechanged',
      message0: '%{BKY_STATECHANGED}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'EW_DEVICE',
          options: [
            [
              'defDevs',
              '0',
            ],
          ],
        },
        {
          type: 'field_dropdown',
          name: 'STATE',
          options: [
            [
              '%{BKY_STATESWITCHED}',
              'switch',
            ],
            [
              '%{BKY_STATEONLINE}',
              'online',
            ],
            [
              '%{BKY_TEMPERATURE}',
              'currentTemperature',
            ],
            [
              '%{BKY_HUMIDITY}',
              'currentHumidity',
            ],
            [
              '%{BKY_POWER}',
              'power',
            ],
          ],
        },
        {
          type: 'input_dummy',
        },
        {
          type: 'input_statement',
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
      type: 'sincelastrun',
      message0: '%{BKY_SINCELASTRUN}',
      args0: [
        {
          type: 'field_dropdown',
          name: 'UNITS',
          options: [
            [
              '%{BKY_SECONDS}',
              '1',
            ],
            [
              '%{BKY_MINUTES}',
              '60',
            ],
            [
              '%{BKY_HOURS}',
              '3600',
            ],
            [
              '%{BKY_DAYS}',
              '86400',
            ],
          ],
        },
      ],
      inputsInline: true,
      output: 'Number',
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'accumtime',
      message0: '%{BKY_ACCUMULATEDTIME}',
      args0: [
        {
          type: 'input_dummy',
        },
        {
          type: 'input_value',
          name: 'VALUE',
          check: 'Boolean',
        },
        {
          type: 'input_dummy',
        },
        {
          type: 'input_value',
          name: 'LIMIT',
          check: 'Number',
        },
        {
          type: 'field_dropdown',
          name: 'UNITS',
          options: [
            [
              '%{BKY_SECONDS}',
              '1',
            ],
            [
              '%{BKY_MINUTES}',
              '60',
            ],
            [
              '%{BKY_HOURS}',
              '3600',
            ],
            [
              '%{BKY_DAYS}',
              '86400',
            ],
          ],
        },
        {
          type: 'input_dummy',
        },
        {
          type: 'input_statement',
          name: 'TODO',
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'cellaccumulate',
      message0: '%{BKY_CELLACCUMULATE}',
      args0: [
        {
          type: 'input_dummy',
        },
        {
          type: 'input_value',
          name: 'ROW',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'COLUMN',
          check: 'Number',
        },
        {
          type: 'field_dropdown',
          name: 'UNITS',
          options: [
            [
              '%{BKY_SECONDS}',
              '1',
            ],
            [
              '%{BKY_MINUTES}',
              '60',
            ],
            [
              '%{BKY_HOURS}',
              '3600',
            ],
            [
              '%{BKY_DAYS}',
              '86400',
            ],
          ],
        },
        {
          type: 'input_value',
          name: 'COND',
          check: 'Boolean',
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: '#60AA40',
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'sendtelegram',
      message0: '%{BKY_SENDTELEGRAM}',
      args0: [
        {
          type: 'input_value',
          name: 'chatid',
          check: 'String',
        },
        {
          type: 'input_value',
          name: 'msg',
          check: 'String',
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: 'You need to joinn the channel first: https://t.me/iotproxy_bot',
      helpUrl: 'https://t.me/iotproxy_bot',
    },
    {
      type: 'checktgpublic',
      message0: '%{BKY_CHECKTGPUBLIC}',
      args0: [
        {
          type: 'input_value',
          name: 'tgpublic',
          check: 'String',
        },
        {
          type: 'input_value',
          name: 'minutes',
          check: 'Number',
        },
        {
          type: 'input_value',
          name: 'substring',
          check: 'String',
        },
      ],
      inputsInline: true,
      output: 'Boolean',
      colour: 230,
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'sendviber',
      message0: '%{BKY_SENDVIBER}',
      args0: [
        {
          type: 'input_value',
          name: 'chatid',
          check: 'String',
        },
        {
          type: 'input_value',
          name: 'msg',
          check: 'String',
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: 'You need to joinn the channel first, open in browser: viber://pa?chatURI=iotproxy',
      helpUrl: 'viber://pa?chatURI=iotproxy',
    },
    {
      type: 'getunusedincol',
      message0: '%{BKY_GETEMPTYROWCOL}',
      args0: [
        {
          type: 'input_value',
          name: 'column',
          check: 'Number',
        },
      ],
      inputsInline: true,
      output: 'Number',
      colour: 230,
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'getunusedincol',
      message0: '%{BKY_GETEMPTYROWCOL}',
      args0: [
        {
          type: 'input_value',
          name: 'column',
          check: 'Number',
        },
      ],
      inputsInline: true,
      output: 'Number',
      colour: 230,
      tooltip: '',
      helpUrl: '',
    },
    {
      type: 'insertrow',
      message0: '%{BKY_INSERTROW}',
      args0: [
        {
          type: 'input_value',
          name: 'row',
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
      type: 'insertcol',
      message0: '%{BKY_INSERTCOL}',
      args0: [
        {
          type: 'input_value',
          name: 'col',
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
      type: 'gotmsg',
      message0: '%{BKY_GOTMSG}',
      args0: [
        {
          type: 'input_value',
          name: 'chatid',
          check: 'String',
        },
        {
          type: 'field_variable',
          name: 'msg',
          variable: 'message',
        },
        {
          type: 'input_dummy',
        },
        {
          type: 'input_statement',
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
  ];
module.exports = { customBlocks, defDevs };
