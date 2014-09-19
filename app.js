var express = require('express');
var app = express();
var path = require('path');
var expressHbs = require('express-handlebars');

console.log("Hi Travity-trav-trav-trav-trav-trav dawg-dawgie-dawgle-dog-dang. I've brought in handlebars for a templating engine, if that works for you. So far, I've brought in angular, jquery, and shelves using bower, a package manager. I wanted to try shelves, as our software dev manager praised it's small footprint, but if you'd prefer another framework or building our own, that works for me too. Feel free to get started; I decided we should clean the slate. I'd suggest npm'ing in bower and nodemon and installing them globally.");

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'index.hbs'}));
app.set('view engine', 'hbs');

app.use('/assets', express.static( __dirname + '/assets' ));

app.get('/', function(req, res){
  res.render('main', {'title':'Hello World'});
});

app.listen(3000);