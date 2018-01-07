var express = require('express');
var app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/register', function(req, res) {
  res.render('register');
});

app.get('/', function(req, res) {
  res.render('homepage');
});

app.listen(3000, function() {
  console.log("Conntected 3000 port!");
});
