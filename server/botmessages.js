class BotMessages {
  constructor() {
    this.users = {};
    this.total = 0;
    this.limit = 10;
    this.userinfo = {};
  }

  addMsg(user, message) {
    let msg = this.users[user];
    if (!msg) {
      this.users[user] = [];
      msg = this.users[user];
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
    if (!this.userinfo[user]) this.userinfo[user] = {};
    const answer = [];
    if (message === 'read') {
      answer.push(this.getAll(user));
    } else
    if (message === 'story') {
      answer.push(JSON.stringify(msg));
    } else
    if (message === 'help') {
      answer.push('Use commands:\ndevices - get list of devices\non deviceid - turn on the device\noff deviceid - turn off the device\nfull - complete info about devices as json\n');
    } else if (message === 'chatid' || !this.userinfo[user].asked) {
      answer.push('Hello! Please copy this number and use as chat-id in the iot-proxy.com:');
      answer.push(`${user}`);
      this.userinfo[user].asked = true;
    }
    return answer;
  }

  getAll(user) {
    const u = this.users[user];
    if (u) {
      const res = JSON.stringify(u);
      this.total -= u.length;
      delete (this.users[user]);
      return res.length > 2 ? res : '[]';
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
