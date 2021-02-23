/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const fs = require('fs');
const custom = require('../client/custom-blocks').customBlocks;
const { handle_ew } = require('./serverless');

const webpackConfig = require('../webpack.dev.js');

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on port ${port}`);

app.use(async (req, res, next) => {
  console.log('path:', req.path);
  console.log('options:', req.params);
  await handle_ew(req, res, next);
});

app.use(express.static('public'));

const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler));
