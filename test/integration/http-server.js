'use strict';

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var store = {};

app.use(bodyParser.json());
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
  let widget = createWidget(req.params.space, req.params.id, req.body);

  res.status(201);
  res.json(widget);
  res.end();
});

app.put('/spaces/:space/widgets/:id', function (req, res) {
  let widget = store[req.params.id];
  let xVersion = parseInt(req.headers['x-contentful-version'], 10);

  if (!widget) {
    let widget = createWidget(req.params.space, req.params.id, req.body);

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

function createWidget (spaceId, id, payload) {
  return _.extend(payload, {
    sys: {
      version: 1,
      id: id || _.random(1000),
      space: {
        sys: {
          id: spaceId
        }
      }
    }
  });
}

var server;
exports.start = function start () {
  server = app.listen(3000);
};

exports.stop = function stop () {
  store = {};
  server.close();
};
