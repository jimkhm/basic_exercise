var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'pug');
app.set('views', './views');


app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/register', function(req, res) {
  console.log(req.body);
  res.send(req.body);
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.get('/', function(req, res) {
  res.render('homepage');
});

app.listen(3000, function() {
  console.log("Conntected 3000 port!");
});
