'use strict';

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');
var app = express();

var store = {};

app.use(bodyParser.json());
app.use(function (req, res, next) {
  console.log('>>>>>>>>>>>>>>>>>> HTTP <<<<<<<<<<<<<<<<<<<<<');
  console.log(req.method);
  console.log(req.headers);
  console.log(util.inspect(req.body, {showHidden: false, depth: null}));
  next();
});
app.use(function (req, res, next) {
  let authHeader = req.headers.authorization;

  if (authHeader !== 'Bearer lol-token') {
    res.status(404);
    res.end();
  } else {
    next();
  }
});

app.all('/spaces/:space/widgets/:id', function (req, res, next) {
  if (req.params.id === 'fail') {
    res.status(500);
    res.end();
    return;
  }

  next();
});

app.post('/spaces/:space/widgets', function (req, res) {
  let widget = _.extend(req.body, {
    sys: {
      version: 1,
      id: _.random(1000)
    }
  });

  res.status(201);
  res.json(widget);
  res.end();
});

app.put('/spaces/:space/widgets/:id', function (req, res) {
  var util = require('util');
  console.log(util.inspect(store, {showHidden: false, depth: null}));
  let widget = store[req.params.id];
  let xVersion = parseInt(req.headers['x-contentful-version'], 10);

  if (!widget) {
    console.log(req.params.id);
    let widget = _.extend(req.body, {
      sys: {
        version: 1,
        id: req.params.id
      }
    });

    store[req.params.id] = widget;
    res.status(201);
    res.json(widget);
    res.end();
  } else {
    if (req.params.id === 'fail-update') {
      res.status(500);
      res.end();
      return;
    }

    if (xVersion !== widget.sys.version) {
      res.status(409);
      res.end();
    } else {
      widget = _.extend(widget, req.body);
      widget.sys.version = widget.sys.version + 1;
      res.json(widget);
      res.status(200);
      res.end();
    }
  }
});

app.get('/spaces/:space/widgets/:id', function (req, res) {
  let widget = store[req.params.id];

  var util = require('util');
  console.log(util.inspect(widget, {showHidden: false, depth: null}));
  res.status(200);
  res.json(widget);
  res.end();
});

app.delete('/spaces/:space/widgets/:id', function (req, res) {
  let widget = store[req.params.id];
  let xVersion = parseInt(req.headers['x-contentful-version'], 10);

  if (req.params.id === 'fail-delete') {
    res.status(500);
    res.end();
    return;
  }

  if (xVersion !== widget.sys.version) {
    res.status(409);
    res.end();
  } else {
    delete store[req.params.id];
    res.status(204);
    res.end();
  }

});

var server;
exports.start = function start() {
  server = app.listen(3000);
};

exports.stop = function stop() {
  store = {};
  server.close();
};
