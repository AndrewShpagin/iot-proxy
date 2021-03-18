/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
const path = require('path');
const fs = require('fs');
const { proxyRequest } = require('./serverless');

class BotMessages {
  constructor() {
    this.directoryPath = path.join(__dirname, 'users');
    fs.mkdirSync(this.directoryPath, { recursive: true });
    this.total = 0;
    this.limit = 10;
    this.userinfo = {};
    this.loadDone = false;
    fs.readdir(this.directoryPath, (err, files) => {
      if (err) {
        return console.log(`Unable to scan directory: ${err}`);
      }
      const promises = [];
      files.forEach(file => {
        promises.push(fs.readFile(path.join(__dirname, `users/${file}`), { encoding: 'utf8' }, (err1, content) => {
          if (err1) {
            console.error(err1);
          } else {
            try {
              const user = file;
              console.log(`read user ${user}`);
              this.userinfo[user] = JSON.parse(content);
            } catch (error) {
              console.log(error);
              try {
                fs.unlink(path);
              } catch (e) {
                console.log(e);
              }
            }
          }
        }));
      });
      Promise.all(promises).then(() => {
        console.log('Loading finished');
        this.loadDone = true;
      });
    });
  }

  saveUser(user) {
    const fn = path.join(__dirname, `users/${user}`);
    fs.writeFile(fn, JSON.stringify(this.userinfo[user]), () => {
      // console.log(`saved user ${user} to ${fn}`);
    });
  }

  extractDevice(str) {
    return str.trim();
  }

  async addMsg(user, message) {
    const answer = [];
    try {
      console.log('msg', user, message);
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
        this.saveUser(user);
      }
      const check = () => {
        if ('email' in uinf && 'password' in uinf && 'region' in uinf) {
          return true;
        } else {
          answer.push('You need to enter email, password, region first. Type "help" or "login"');
          return false;
        }
      };
      if (message.substring(0, 6) === '/login') {
        const arr = message.split(' ');
        if (arr.length === 4) {
          [uinf.email, uinf.password, uinf.region] = arr.slice(1);
          answer.push('Login info accepded.');
          answer.push(JSON.stringify(uinf));
          this.saveUser(user);
        } else {
          answer.push('Type to login to eWeLink:\nlogin your_email your_password your_region');
        }
      } else
      if (message.substring(0, 3) === '/on') {
        if (check()) {
          const dev = this.extractDevice(message.substring(3));
          const res = await proxyRequest(`/email=${uinf.email}/password=${uinf.password}/region=${uinf.region}/device=${dev}/on`);
          answer.push(res);
        }
      } else
      if (message.substring(0, 4) === '/off') {
        if (check()) {
          const dev = this.extractDevice(message.substring(3));
          const res = await proxyRequest(`/email=${uinf.email}/password=${uinf.password}/region=${uinf.region}/device=${dev}/off`);
          answer.push(res);
        }
      } else
      if (message === '/full') {
        if (check()) {
          const res = await proxyRequest(`/email=${uinf.email}/password=${uinf.password}/region=${uinf.region}/raw`);
          answer.push(res);
        }
      } else
      if (message === '/devices') {
        if (check()) {
          const res = await proxyRequest(`/email=${uinf.email}/password=${uinf.password}/region=${uinf.region}/devices`);
          let answ = '';
          for (const [key, value] of Object.entries(res)) {
              console.log(key, value);
            const nm = `${value.name }                         `;
            answ += `**${key}**: ${nm.slice(20)} : ${value.online ? '**ONLINE**' : '~~OFFLINE~~'}, ${value.switch === 'on' ? '**ON**' : '~~OFF~~'}`;
            if ('currentTemperature' in value) answ += `, Temperature = ${value.currentTemperature}`;
            if ('currentHumidity' in value) answ += `, Temperature = ${value.currentHumidity}`;
            answ = `${answ}\n`;
          }
          answer.push(answ);
        }
      } else
      if (message === '/user') {
        answer.push(JSON.stringify(this.userinfo[user]));
      } else
      if (message === '/read') {
        answer.push(this.getAll(user));
      } else
      if (message === '/story') {
        answer.push(JSON.stringify(msg));
      } else
      if (message === 'errors' && user === 505585494) {
        try {
          const text = await fs.promises.readFile('/root/.pm2/logs/iot-error.log');
          const idx = text.lastIndexOf('Errors logging started.');
          if (idx > 0) {
            answer.push(text.slice(idx));
          }
        } catch (err) {
          console.log(err);
        }
      } else
      if (message === 'logs' && user === 505585494) {
        try {
          const text = await fs.promises.readFile('/root/.pm2/logs/iot-out.log');
          const idx = text.lastIndexOf('node server/server.js');
          if (idx > 0) {
            answer.push(text.slice(idx));
          }
        } catch (err) {
          console.log(err);
        }
      } else
      if (message === '/help') {
        answer.push(
          'Use commands:\n' +
          '/chatid - display chat-id.\n' +
          '/login email password region - set login data, this is required before any other commands.\n' +
          '/devices - get list of devices\n' +
          '/on deviceid - turn on the device\n' +
          '/off deviceid - turn off the device\n' +
          '/full - complete info about devices as json\n',
        );
      } else if (message === '/chatid' || !this.userinfo[user].asked) {
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
        const L0 = u.length;
        uinf.messages = [];
        if (L0 > 0) this.saveUser(user);
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
