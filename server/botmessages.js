const { proxyRequest } = require('./serverless');

class BotMessages {
  constructor() {
    this.total = 0;
    this.limit = 10;
    this.userinfo = {};
  }

  async addMsg(user, message) {
    const answer = [];
    try {
      if (!message) return [];
      if (!this.userinfo[user]) this.userinfo[user] = {};
      const uinf = this.userinfo[user];
      let msg = uinf.messages;
      if (!msg) {
        uinf.messages = [];
        msg = uinf.messages;
      }
      if (msg) {
        msg.push(message);
        this.total++;
        if (msg.length > this.limit) {
          const n = msg.length - this.limit;
          this.total -= n;
          msg = msg.slice(n);
        }
      }
      const check = () => {
        if ('email' in uinf && 'password' in uinf && 'region' in uinf) {
          return true;
        } else {
          answer.push('You need to enter email, password, region first. Type "help" or "login"');
          return false;
        }
      };
      if (message.substring(0, 5) === 'login') {
        const arr = message.split(' ');
        if (arr.length === 4) {
          [uinf.email, uinf.password, uinf.region] = arr.slice(1);
          answer.push('Login info accepded.');
          answer.push(JSON.stringify(uinf));
        } else {
          answer.push('Type to login to eWeLink:\nlogin your_email your_password your_region');
        }
      } else
      if (message === 'devices') {
        if (check()) {
          const res = await proxyRequest(`/email=${uinf.email}/password=${uinf.password}/region=${uinf.region}/devices/info/`);
          answer.push(res);
        }
      } else
      if (message === 'user') {
        answer.push(JSON.stringify(this.userinfo[user]));
      } else
      if (message === 'read') {
        answer.push(this.getAll(user));
      } else
      if (message === 'story') {
        answer.push(JSON.stringify(msg));
      } else
      if (message === 'help') {
        answer.push(
          'Use commands:\n' +
          'chatid - display chat-id.\n' +
          'login email password region - set login data, this is required before any other commands.\n' +
          'devices - get list of devices\n' +
          'on deviceid - turn on the device\n' +
          'off deviceid - turn off the device\n' +
          'full - complete info about devices as json\n',
        );
      } else if (message === 'chatid' || !this.userinfo[user].asked) {
        answer.push('Hello! Please copy this number and use as chat-id in the iot-proxy.com:');
        answer.push(`${user}`);
        this.userinfo[user].asked = true;
      }
    } catch (error) {
      console.log(error);
    }
    return answer;
  }

  getAll(user) {
    const uinf = this.userinfo[user];
    if (uinf) {
      const u = uinf.messages;
      if (u) {
        const res = JSON.stringify(u);
        this.total -= u.length;
        uinf.messages = [];
        return res.length > 2 ? res : '[]';
      }
    }
    return '[]';
  }

  bulkSend(array, fn) {
    if (array.length) {
      fn(array[0]);
      setTimeout(() => {
        this.bulkSend(array.slice(1), fn);
      }, 500);
    }
  }
}

const bom = new BotMessages();

module.exports = { BotMessages, bom };
