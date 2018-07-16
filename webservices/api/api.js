const express = require('express');
const app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json({
	limit: '1gb'
}));
app.use(bodyParser.urlencoded({
	limit: '1gb',
	extended: true
}));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Credentials', false);
	if ('OPTIONS' == req.method) {
	  res.send(200);
	}
	else {
	  next();
	}

});

// api calls
app.use('/uploads',express.static('uploads'));
var users = require('./users');
app.use('/api/users', users );


module.exports= app;