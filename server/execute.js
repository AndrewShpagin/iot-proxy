/* eslint-disable camelcase */
const Interpreter = require('js-interpreter');
const { get_device_state, device_command } = require('./ewelink');
const { getUser, UserDevices } = require('./user');

const initFunc = function (interpreter, globalObject) {
  const device_state = function (devid, field) {
    const dev = devid.replace(new RegExp(/\(\)'/, 'g'), '');
    return get_device_state(interpreter.login, dev, field);
  };
  interpreter.setProperty(globalObject, 'device_state',
    interpreter.createNativeFunction(device_state));

  const dev_command = function (text) {
    return device_command(interpreter.login, text);
  };
  interpreter.setProperty(globalObject, 'device_command',
    interpreter.createNativeFunction(dev_command));

  const console_command = function (text) {
    return console.log(text);
  };
  interpreter.setProperty(globalObject, 'console',
    interpreter.createNativeFunction(console_command));
};

async function doScriptCommand(comm, login) {
  try {
    console.log('execute:', comm);
    const myInterpreter = new Interpreter(comm, initFunc);
    myInterpreter.login = login;
    myInterpreter.run();
  } catch (error) {
    console.log('Execution failed.');
  }
}

function setScriptTask(login, comm) {
  const user = getUser(login);
  user.currentScriptTask = comm;
  execCycle(login);
}

function execCycle(login) {
  const user = getUser(login);
  if (user.taskEnded && user.currentScriptTask.length) {
    user.taskEnded = false;
    doScriptCommand(user.currentScriptTask, login).then(() => {
      console.log('Task finished.');
      user.taskEnded = true;
    });
  }
}
module.exports = { doScriptCommand, setScriptTask };
