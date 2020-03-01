
const express = require('express');
const Websocket = require('ws').Server;
const path = require('path');
const { bold } = require('chalk');
const opener = require('opener');
const config = require('../webpack.config.js');
const { getNodes, getEdges } = require('./data.js');


const ROOT_DIR = '../public';

const app = express();

app.use(express.static(path.join(__dirname, ROOT_DIR)))

module.exports = (opt) => {
  const { host, port } = opt;


  const ws = new Websocket({ port: 12300, host: '0.0.0.0' });

  app.set('views', (__dirname + ROOT_DIR));
  app.set('view engine', 'html');

  // 运行ejs模块
  app.engine('.html', require( 'ejs' ).__express );

  app.get("/", function(req, res) {
    res.render('index');
  });

  const server = app.listen(port, host, function() {

    const _host = server.address().address;
    const _port = server.address().port;

    const url = `http://${_host}:${_port}`;

    console.log(
      `${bold('Webpack Bundle Analyzer')} is started at ${bold(url)}\n` +
      `Use ${bold('Ctrl+C')} to close it`
      )

      ws.on('connection', conn => {
        conn.on('message', msg => {
          const data = {
            nodes: getNodes(),
            edges: getEdges(),
          }
          conn.send(JSON.stringify(data));
        })
      })

      opener(url);
  })

}
