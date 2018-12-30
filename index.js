const express = require('express');
const request = require('request').defaults({ encoding: null });
const https = require('https');
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
      hostname: HOST,
      path: `${PATH}?q=${encodeURIComponent(query)}`,
      headers: {
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      },
    };

    https.request(params, (response) => {
      let body = '';
      response.on('error', next);
      response.on('data', (data) => body += data);
      response.on('end', () => {
        const results = JSON.parse(body).value;
        const images = results.map(result => ({
          thumb: result.thumbnailUrl,
          full: result.contentUrl,
        }));

        res.json(images);
     });
    }).end();
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
