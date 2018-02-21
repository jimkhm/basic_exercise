var express = require('express');
var path= require('path');
var session = require('express-session');
var MySQLStore= require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_DATABASE
});
conn.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  })
}));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/checklist', function(req, res) {

  res.render('checkList');
  // res.send(`
  //     <h1>welcome ${req.session.userid}</h1>
  //   `)
});

app.post('/login', function(req, res) {
  console.log('/login');
  console.log(req.body);

  const email= req.body.email;
  const password= req.body.password;
  const sql= 'SELECT * FROM user WHERE email= ?';

  conn.query(sql, [email], function(err, results, fields) {
    if(err) {
      res.status(500).send('Internal Server Error');
      console.log(err);
    } else if(results.length <= 0){
      res.status(200).send('등록되지 않은 이메일입니다');
    } else if(password !== results[0].password) {
      res.status(200).send('틀린 비밀번호입니다. 확인해 주세요');
    } else {
      req.session.userid = results[0].id;
      console.log(results[0].id);
      console.log(req.session.userid);
      req.session.save(function() {
        res.redirect('/checklist');
      })
      //res.redirect("/welcome");
    }
  });
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

app.listen(process.env.PORT, function() {
  console.log("Conntected"+process.env.PORT+"port!");
});
