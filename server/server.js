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
const custom = require('../client/custom-blocks').customBlocks;
const { ewRequest } = require('./serverless');
const dev = require('../webpack.dev.js');
const prod = require('../webpack.prod.js');

const https_options = {
  key: fs.readFileSync('./cert/iot-proxy.key'),
  cert: fs.readFileSync('./cert/iot-proxy_com.crt'),
};

const app = express();
app.use(cors());
app.options('/products/:id', cors()); // enable pre-flight request for DELETE request
const port = process.env.PORT || 443;

const server = https.createServer(https_options, app);

server.listen(port, () => {
  console.log(`server starting on port : ${port}`);
});

app.options('*', cors());
app.del('/products/:id', cors(), (req, res, next) => {
  res.json({ msg: 'This is CORS-enabled for all origins!' });
});

// app.listen(port);
// console.log(`Server listening on port ${port}`);

app.use(async (req, res, next) => {
  console.log('path:', req.path);
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

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(dev);
  app.use(webpackDevMiddleware(compiler));
} else
if (process.env.NODE_ENV === 'production') {
  const compiler = webpack(prod);
  app.use(webpackDevMiddleware(compiler));
} else {
  app.use(express.static('dist'));
}
