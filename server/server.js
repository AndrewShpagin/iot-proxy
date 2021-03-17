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
const TextMessage = require('viber-bot').Message.Text;
const { bom, BotMessages } = require('./botmessages');

const viber_token = '4d09bcc23327d145-cd3e1bef9657fe6a-6279f875aff1bee1';

function sendToViber(chatid, text) {
  const sendobj = {
    receiver: chatid,
    min_api_version: 1,
    sender: {
      name: 'iotproxy',
    },
    tracking_data: 'tracking data',
    type: 'text',
    text: decodeURI(text),
  };
  fetch('https://chatapi.viber.com/pa/send_message', {
    method: 'post',
    body: JSON.stringify(sendobj),
    headers: {
      'X-Viber-Auth-Token': viber_token,
    },
  }).catch(error => console.log('error', error));
}
const viber_bot = new ViberBot({
  authToken: viber_token,
  name: 'iotproxy',
  avatar: 'http://viber.com/avatar.jpg', // It is recommended to be 720x720, and no more than 100kb.
});

viber_bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
  const chatid = response.userProfile.id;
  bom.addMsg(chatid, message.text).then(
    res => bom.bulkSend(res, m => {
      console.log('viber-send', chatid, typeof m, m);
      sendToViber(chatid, m);
    }),
  ).catch(error => console.log(error));
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

function parsesimp(path, tag, res) {
  if (path.substring(0, tag.length) == tag) {
    const id = path.substring(tag.length);
    const e = id.indexOf('/');
    if (e > 0) {
      res.chatid = id.substring(0, e);
      res.text = id.substring(e + 1);
      return true;
    }
  }
}
app.use(async (req, res, next) => {
  console.log('path:', req.path);
  const r = {};
  if (parsesimp(req.path, '/story/', r)) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(bom.getAll(r.chatid));
    res.end();
    return;
  } else
  if (parsesimp(req.path, '/viberbot/', r)) {
    sendToViber(r.chatid, r.text);
    res.writeHead(200, { 'Content-Type': 'text' });
    res.write('ok');
    res.end();
    return;
  } else
  if (parsesimp(req.path, '/telegrambot/', r)) {
    fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${r.chatid}&text=${r.text}`, { method: 'get' });
    res.writeHead(200, { 'Content-Type': 'text' });
    res.write('ok');
    res.end();
    return;
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
  bom.addMsg(chatId, msg.text).then(
    res => bom.bulkSend(res, m => bot.sendMessage(chatId, m)),
  ).catch(error => console.log(error));
});
