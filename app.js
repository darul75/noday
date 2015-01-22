var express = require('express');
var app = express();
var fetcher = require('./src/fetcher');

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
})

app.get('/today', function (req, res) {
  res.json(fetcher.TodayRepos());
})

app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT);
console.log('Express server started on port %s', process.env.PORT);

fetcher.scheduleStart();