var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var conn = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1121ujung',
  database:'checkList'
});
conn.connect();

app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'pug');
app.set('views', './views');

app.post('/login', function(req, res) {
  res.send(req.body);
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/register', function(req, res) {
  console.log('/register');
  console.log(req.body);

  const email= req.body.email;
  const password= req.body.password;
  const date = new Date();

  const sql= 'SELECT * FROM user WHERE email=?';
  conn.query(sql, [email], function(err, results, fields) {
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else if(results.length > 0) {
      res.status(200).send("이미 등록된 이메일입니다");
    } else {
      const sql= 'INSERT INTO user (email, password, created_at) VALUES (?, ?, ?)';
      conn.query(sql, [email, password, date], function(err, results, feilds) {
        if(err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.status(200).redirect('/login');
      });
    }
  });
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
