/* eslint-disable new-cap */
/* eslint-disable no-prototype-builtins */
const ewelink = require('ewelink-api');

function deviceInfo(element) {
  const object = {};
  const opt = property => {
    if (element.hasOwnProperty(property)) {
      object[property] = element[property];
    }
    if (element.hasOwnProperty('params') && element.params.hasOwnProperty(property)) {
      object[property] = element.params[property];
    }
  };
  opt('name');
  opt('online');
  opt('deviceid');
  opt('switch');
  opt('currentTemperature');
  opt('currentHumidity');
  return object;
}

class UserDevices {
  constructor(login) {
    this.user = login;
    this.user.apiKey = '334577b7-c33a-4c12-bc02-6cc26328cfa0';
    this.devices = {};
    this.currentScriptTask = '';
    this.taskEnded = true;
    this.lastQuest = Date.now();
    this.connectionError = true;
    this.connectionLost = true;
    this.connection = null;
    this.lasConnectTime = Date.now() - 100000;
    this.socket = null;
  }

  async reConnect() {
    this.connectionLost = false;
    this.connectionError = false;
    this.lasConnectTime = Date.now();
    try {
      this.connection = await new ewelink(this.user);
      // await this.connection.login();
      this.socket = await this.connection.openWebSocket(async data => {
        // data is the message from eWeLink
        try {
          console.log('openWebSocket:', data);
        } catch (error) {
          console.log('openWebSocket error:', error);
        }
      });
      process.on('SIGINT', () => {
        console.log(' - Caught SIGINT. Exiting in 3 seconds.');
        console.log('Closing WebSocket...');
        this.socket.close();
        setTimeout(() => {
          process.exit(0);
        }, 3000);
      });
    } catch (error) {
      this.connectionError = true;
      this.connectionLost = true;
      this.connection = null;
      console.log('connection error', error);
    }
    return this.connection;
  }

  async getConnection() {
    if (this.connection) return this.connection;
    if (this.connectionError && Date.now() - this.lasConnectTime > 5000) {
      this.connection = await this.reConnect();
    }
    return this.connection;
  }

  async sendGetDevices() {
    const conn = await this.getConnection();
    if (conn) {
      const devs = await conn.getDevices();
      devs.forEach(element => {
        const dev = deviceInfo(element);
        this.setDevice(dev);
      });
      return devs;
    }
    return null;
  }

  async sendGetDivice(deviceid) {
    const conn = this.getConnection();
    if (conn) {
      const dev = await conn.getDevice(deviceid);
      const mydev = deviceInfo(dev);
      this.setDevice(mydev);
      return mydev;
    }
    return null;
  }

  async sendToggleDevice(deviceid) {
    const conn = await this.getConnection();
    const dev = this.getDevice(deviceid);
    if (conn && dev && dev.online === true) {
      if (dev.switch === 'on')dev.switch = 'off';
      else dev.switch = 'on';
      return conn.toggleDevice(deviceid);
    }
    return null;
  }

  getDevice(id) {
    if (this.devices.hasOwnProperty(id)) return this.devices[id];
    return null;
  }

  setDevice(device) {
    this.devices[device.deviceid] = device;
  }
}
const usersList = {};
function getUser(login) {
  if (usersList.hasOwnProperty(login.email)) return usersList[login.email];
  const user = new UserDevices(login);
  usersList[login.email] = user;
  return user;
}
module.exports = { getUser, UserDevices, deviceInfo };
