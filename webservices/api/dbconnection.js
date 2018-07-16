var http = require('http');
var sql = require('mssql');
var mysql=require('mysql');
const nodemailer = require('nodemailer');


var env = process.env.NODE_ENV || 'prod';
var environment = {}


	console.log('Environment is'+env);

	if(env=='local'){
		environment.connection = new sql.ConnectionPool({
			server : 'localhost',
			user : 'sa',
			password : 'sqlserver',
			database : 'GetCash'
		});
		// E:/xampp/htdocs/cashapp/webservices/uploads/
		// environment.uploadPath = 'C:/Users/Rutuja/cashapp/webservices/uploads/';	
		environment.uploadPath = 'E:/xampp/htdocs/cashapp/webservices/uploads/';	
	}else if(env=='sachin'){
		environment.connection = new sql.ConnectionPool({
			server : '115.124.97.41',
			user : 'sa',
			password : 'howY2NlBUdEQQ',
			database : 'GetCash'
		});
		environment.uploadPath = 'D:/Ionic App/cashapp/webservices/uploads/';	

	}else{
		environment.connection = new sql.ConnectionPool({
			server : '115.124.97.41',
			user : 'sa',
			password : 'howY2NlBUdEQQ',
			database : 'GetCash'
			
			//server : 'WIN-J9PS8GJSLRT',
			//user : 'sa',
			//password : 'howY2NlBUdEQQ',
			//database : 'GetCash'

		});
		environment.uploadPath = 'C:/cashapp/webservices/uploads/';

	}
	

environment.connection.connect(function(err, connection) {
  console.log( 'db conection err', err );
 });

environment.transporter= nodemailer.createTransport({
   	host: 'smtp.gmail.com',
    port: 465,
   // service: 'gmail',
    secure: true, // use SSL
 	auth:{
 		user:'initsolutions.services@gmail.com',
     	pass:'init#123F'

 	}
 }, {from: '"GetCash 👥" <noreply@getcash.com>'} );

 
module.exports= environment;