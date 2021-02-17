/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const express = require('express');
const ewelink = require('ewelink-api');
const webpack = require('webpack');
const Interpreter = require('js-interpreter');
const webpackDevMiddleware = require('webpack-dev-middleware');
const fs = require('fs');
const custom = require('./custom-blocks').customBlocks;
const { setScriptTask } = require('./execute');
const { getDevList, handle_ew, extractLoginData } = require('./ewelink');

const webpackConfig = require('../webpack.dev.js');

const app = express();

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on port ${port}`);

app.use(async (req, res, next) => {
  const send = (content, data) => {
    res.writeHead(200, { 'Content-Type': content });
    res.write(data);
    res.end();
  };
  console.log(req.path);
  if (req.path.indexOf('/eWeLink/') >= 0) {
    send('application/json', await handle_ew(req.path));
  } else
  if (req.path.indexOf('/runjscode/') >= 0) {
    const idx = req.path.indexOf('/runjscode/');
    if (idx >= 0) {
      const str = decodeURI(req.path.substring(idx + 11));
      const login = extractLoginData(req.path);
      setScriptTask(login, str);
      send('application', '{}');
    }
  } else
  if (req.path.indexOf('toolbox.xml') >= 0) {
    // eslint-disable-next-line prefer-arrow-callback
    fs.readFile('./server/toolbox.xml', 'utf8', function (err, data) {
      if (err) throw err;
      send('application/xml', data);
    });
  } else
  if (req.path.indexOf('custom-blocks') >= 0) {
    const login = extractLoginData(req.path);
    getDevList(login).then(result => {
      custom[0].args0[0].options = [];
      result.forEach(element => {
        custom[0].args0[0].options.push([
          element.name, element.deviceid,
        ]);
      });
      send('application/json', JSON.stringify(custom));
    });
  } else {
    next();
  }
});

app.use(express.static('public'));

const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler));
