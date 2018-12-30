const express = require('express');
const request = require('request').defaults({ encoding: null });
const sharp = require('sharp');

const SUBSCRIPTION_KEY = process.env.AZURE_BING_API_KEY_1;
const HOST = 'api.cognitive.microsoft.com';
const PATH = '/bing/v7.0/images/search';

const app = express();

app
  .use('/static', express.static(__dirname + '/public'))

  .get('/', (_req, res) => {
    res.sendFile(__dirname + '/index.html');
  })

  .get('/q', (req, res, next) => {
    const query = req.query.query || 'void';
    const params = {
      method: 'GET',
      json: true,
      uri: `https://${HOST}/${PATH}?q=${encodeURIComponent(query)}`,
      headers: {
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      },
    };

    request(params, (error, _response, body) => {
      if (error) return next(error);

      const images = body.value.map(result => ({
        thumb: result.thumbnailUrl,
        full: result.contentUrl,
        ...result.thumbnail,
      }));

      res.json(images);
    });
  })

  .get('/favicon.ico', (_req, res) => {
    res.status(200).end();
  })

  .get('/*', (req, res, next) => {
    let url = req.url.slice(1, req.url.length);

    if (!/^http(s?):\/\//.test(url)) {
      url = 'http://' + url;
    }

    const image = request(url);
    const pipeline = sharp().rotate(180);

    image.on('error', next);
    pipeline.on('error', next);

    image.pipe(pipeline).pipe(res);
  });

const port = process.env.PORT || 5000;

app.listen(port);

console.log('Listening on port: ' + port);
