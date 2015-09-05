var express = require('express');

var net = require('net');

var webappDir = "../webapp";

var app = express();

app.use(express.static(__dirname + '/' + webappDir));

app.listen(3000, function () {
  console.log('Server listening on', 3000)
});
