var express = require('express');
var app = express();
var path = require('path');

app.use('/assets', express.static( __dirname + '/assets' ));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(80);
