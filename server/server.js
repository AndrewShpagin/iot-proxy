/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const fs = require('fs');
const custom = require('../client/custom-blocks').customBlocks;
const { ewRequest } = require('./serverless');
const dev = require('../webpack.dev.js');
const prod = require('../webpack.prod.js');

const app = express();
const port = process.env.PORT || 3002;
app.listen(port);
console.log(`Server listening on port ${port}`);

app.use(async (req, res, next) => {
  console.log('path:', req.path);
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
