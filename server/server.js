/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const { decode, isUrlSafeBase64 } = require('url-safe-base64');
global.atob = require('atob');

const express = require('express');
const webpack = require('webpack');
const cors = require('cors');
const https = require('https');
const webpackDevMiddleware = require('webpack-dev-middleware');
const fs = require('fs');
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const custom = require('../client/custom-blocks').customBlocks;
const { ewRequest } = require('./serverless');
const dev = require('../webpack.dev.js');
const prod = require('../webpack.prod.js');
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const viber_bot = new ViberBot({
  authToken: '4d09bcc23327d145-cd3e1bef9657fe6a-6279f875aff1bee1',
  name: 'iotproxy',
  avatar: 'http://viber.com/avatar.jpg', // It is recommended to be 720x720, and no more than 100kb.
});

// Perfect! Now here's the key part:
viber_bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
  // Echo's back the message to the client. Your bot logic should sit here.
  console.log(typeof response.userProfile, response.userProfile);
  const mss = `Hello, ${response.userProfile.name}! Please copy the user id into clipboard and use it in the iot-proxy.com to get notifications:\n${response.userProfile.id}`;
  console.log(mss);
  response.send(mss);
});

const https_options = {
  key: fs.readFileSync('./cert/iot-proxy.key'),
  cert: fs.readFileSync('./cert/iot-proxy_com.crt'),
  ca: fs.readFileSync('./cert/iot-proxy_com.ca-bundle'),
};

const app = express();
app.use(cors());
app.options('/products/:id', cors()); // enable pre-flight request for DELETE request
const port = process.env.PORT || 443;

const server = https.createServer(https_options, app);

server.listen(port, () => {
  console.log(`server starting on port : ${port}`);

  // viber_bot.setWebhook('https://iot-proxy.com/viber/webhook')
  //  .then(res => console.log('webhook:', res))
  //  .catch(err => console.log('ERROR!', err));
});

app.options('*', cors());
app.del('/products/:id', cors(), (req, res, next) => {
  res.json({ msg: 'This is CORS-enabled for all origins!' });
});

app.use('/viber/webhook', viber_bot.middleware());

app.use(async (req, res, next) => {
  console.log('path:', req.path);
  if (req.path.substring(0, 10) === '/viberbot/') {
    const id = req.path.substring(10);
    console.log(id);
    const e = id.indexOf('/');
    if (e > 0) {
      const chatid = id.substring(0, e);
      console.log(chatid);
      const udec = id.substring(e + 1);
      console.log(udec);
      // viber_bot.sendMessage() fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${udec}`, { method: 'get' });
      res.writeHead(200, { 'Content-Type': 'text' });
      res.write('ok');
      res.end();
      return;
    }
  } else
  if (req.path.substring(0, 13) === '/telegrambot/') {
    const id = req.path.substring(13);
    console.log(id);
    const e = id.indexOf('/');
    if (e > 0) {
      const chatid = id.substring(0, e);
      console.log(chatid);
      const udec = id.substring(e + 1);
      console.log(udec);
      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${udec}`, { method: 'get' });
      res.writeHead(200, { 'Content-Type': 'text' });
      res.write('ok');
      res.end();
      return;
    }
  } else
  if (req.path.substring(0, 9) === '/aSevT56x') {
    try {
      const str = req.path.substring(9);
      if (isUrlSafeBase64(str)) {
        const data = atob(decode(str));
        const obj = JSON.parse(data);
        if (obj.uri && obj.method) {
          const options = { headers: { Authorization: obj.auth }, method: obj.method, contentType: 'application/json', body: obj.body };
          const request = await fetch(obj.uri, options);
          const result = await request.json();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(result));
          res.end();
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  await ewRequest(req, res, next);
});

app.use(express.static('public'));

// bot - iotproxy_bot
let token = '1573795077:AAHtYYk-I22ko8EsfjGOYl4Aphf-KZH1yPs';

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(dev);
  app.use(webpackDevMiddleware(compiler));
  // bot - iotproxybot, development use
  token = '1622344385:AAHzSnBJMYx-yR96BJfxW_L4N40pXJeU9Jo';
} else
if (process.env.NODE_ENV === 'production') {
  const compiler = webpack(prod);
  app.use(webpackDevMiddleware(compiler));
} else {
  app.use(express.static('dist'));
}

/// bot code below

// replace the value below with the Telegram token you receive from @BotFather

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
const cyrillicPattern = /^[\u0400-\u04FF]+$/;
bot.on('message', msg => {
  const chatId = msg.chat.id;
  console.log('telegram-bot', chatId, msg);
  if (msg.text === 'full') {

  } else
  if (msg.text === 'help') {
    bot.sendMessage(chatId, 'Use commands:\ndevices - get list of devices\non deviceid - turn on the device\noff deviceid - turn off the device\nfull - complete info about devices as json\n');
  } else {
  // send a message to the chat acknowledging receipt of their message
    if (cyrillicPattern.test(msg)) bot.sendMessage(chatId, 'Приветствую Вас! Скопируйте это число и используйте как chat-id в iot-proxy.com:');
    else bot.sendMessage(chatId, 'Hello! Copy this number and use as chat-id in the iot-proxy.com:');
    bot.sendMessage(chatId, chatId);
  }
});
