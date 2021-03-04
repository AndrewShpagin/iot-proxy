/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const express = require('express');
const webpack = require('webpack');
const cors = require('cors');
const https = require('https');
const webpackDevMiddleware = require('webpack-dev-middleware');
const fs = require('fs');
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

// app.listen(port);
// console.log(`Server listening on port ${port}`);

app.use(async (req, res, next) => {
  console.log('path:', req.path);
  await ewRequest(req, res, next);
});

app.del('/products/:id', cors(), (req, res, next) => {
  res.json({ msg: 'This is CORS-enabled for all origins!' });
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
