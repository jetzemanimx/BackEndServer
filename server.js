var express = require('express');
var app = express();
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var passport       = require('passport');
var logger = require('morgan');
var port = process.env.PORT || 8080;
var db = require('./config/db');
var colors = require('./config/colores');
app.use(logger('dev'));
app.use(cors());

//Configuracion de HTML
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json );
app.use(bodyParser.json({ type: 'application/*+json' }));

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/app'))
// app.use('/uploads', serveIndex(__dirname + '/app/uploads'));

require('./app/routes/routesGlobal')(app); 
require('./app/routes/routesHospital')(app); 
require('./app/routes/routesMedico')(app); 
require('./app/routes/routesUsuario')(app); 
require('./app/routes/routesSearch')(app); 
require('./app/routes/routesUpload')(app); 
require('./app/routes/routesImages')(app);

app.listen(port);


mongoose.connect(db.url, { useNewUrlParser : true , useCreateIndex : true}, function (error, db){
  if(error){
    console.log(error);
  }
  else{
    //console.log(db);
  }
});

connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {
	console.log('Magic happens on port ' + port + " => " + colors.Succes , "Online"); 			// shoutout to the user
});

exports = module.exports = app; 