var express = require('express');
var app = express();

app.set('view engine', 'pug');
app.set('views', '/views');



app.listen(3000, function() {
  console.log("Conntected 3000 port!");
})
