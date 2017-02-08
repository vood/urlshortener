var express = require('express');
var app     = express();
var bodyParser = require('body-parser')
var url     = require('./models/url');
var base62  = require('./lib/base62');


var hashValidator = /^\w+$/;
var urlValidator = /^https?:\/\/.+$/;
var baseUrl = 'http://localhost:3000/';

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/templates/index.html');
});

app.post('/', function (req, res) {
  if (!urlValidator.test(req.body.url)) {
    return res.send(400, 'Invalid URL: ' + req.body.url);
  }

  url.create(req.body.url, function (err, id) {
    if (err) {
      return res.send(500, 'Unexpected error occurred ' + JSON.stringify(err));
    }

    return res.send(200, baseUrl + base62.encode(id));
  })

});

app.get('/:hash', function (req, res) {

  if (!hashValidator.test(req.params.hash)) {
    return res.send(404, 'Can\t find url');
  }

  var id = base62.decode(req.params.hash);

  url.getById(id, function (err, url) {
    if (err) {
      return res.send(500, 'Unexpected error occurred ' + JSON.stringify(err));
    }

    if (!url) {
      return res.send(404, 'Can\t find url');
    }

    return res.redirect(url);
  });
});

app.listen(3000, function (err) {
  if (err) {
    throw err;
  }
  console.log('Listening on port 3000');
});