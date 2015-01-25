var express, request, gm, fs, app;

express = require('express');
request = require('request').defaults({ encoding: null });
gm = require('gm');
fs = require('fs');

app = express();

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  fs.readFile('index.html', function(err, page) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
  });
});

app.get('/*', function(req, res) {
  var url = req.url.slice(1, req.url.length);

  if (!/^http(s?):\/\//.test(url)) {
    url = 'http://' + url;
  }

  request(url, function(e, r, buffer) {
    gm(buffer).rotate('white', 180).toBuffer(function(err, buffer) {
      res.setHeader('Cache-Control', 'public, max-age=31557600');
      res.end(buffer);
    });
  });
});

port = process.env.PORT || 5000;

app.listen(port);

console.log('Listening on port: ' + port);
