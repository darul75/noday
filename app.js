var express = require('express');
var app = express();
var fecther = require('./src/fetcher');

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);