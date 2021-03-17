class BotMessages {
  constructor() {
    this.total = 0;
    this.limit = 10;
    this.userinfo = {};
  }

  addMsg(user, message) {
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
    const answer = [];
    if (message.substring(0, 5) === 'login') {
      const arr = message.split(' ');
      if (arr.length === 4) {
        [uinf.email, uinf.password, uinf.region] = arr.slice(1);
        answer.push('Login info accepded.');
        answer.push(JSON.stringify(uinf));
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
      answer.push('Use commands:\nchatid - display chat-id.\nlogin email password region - set login data, this is required before any other commands.\ndevices - get list of devices\non deviceid - turn on the device\noff deviceid - turn off the device\nfull - complete info about devices as json\n');
    } else if (message === 'chatid' || !this.userinfo[user].asked) {
      answer.push('Hello! Please copy this number and use as chat-id in the iot-proxy.com:');
      answer.push(`${user}`);
      this.userinfo[user].asked = true;
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
