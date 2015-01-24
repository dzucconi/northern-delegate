var express, request, gm, app;

express = require('express');
request = require('request').defaults({ encoding: null });
gm = require('gm');

app = express();

app.get('/:url', function(req, res) {
  var url = decodeURIComponent(req.params.url);

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
