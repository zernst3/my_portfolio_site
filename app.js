const express = require("express"),
app 	      = express(),
bodyParser    = require("body-parser"),
flash		  = require("connect-flash"),
nodemailer 	  = require('nodemailer'),
session		  = require("express-session");

//telling express to serve public directory where our CSS is based
app.use(express.static(__dirname + "/public"));

//telling it to look out for ejs
app.set("view engine", "ejs");

// use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

require('dotenv').config();

app.use(session ({
	secret: "Sleeping with a full-moon blanket",
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
	},
	resave: false,
	saveUninitialized: true
}));

// Use Flash
app.use(flash());

// Use Current Flashing Information
app.use(function(req, res, next){
	res.locals.success = req.flash("success");
	next();
});

// 1. Transporter
let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD
	}
});

// ========================================= Home Page =============================================

app.get("/", function(req, res){
	try {
		// 2.	
		let mailOptions = {
			from: req.body.email,
			to: 'zernst3@live.com',
			subject: 'New visit to your webpage',
			html: "<h1>New Visit</h1>"
		}
		
		// 3.		
		transporter.sendMail(mailOptions, function(err, data) {
			if (err){
				console.log(err);
			} else {
				console.log("Email Sent Successfully");
			}
		});
	}
	catch (err) {console.log(err);}	
	res.render("index");
});

app.post("/send_email", function(req, res){
	try {
		// 2.	
		let mailOptions = {
			from: req.body.email,
			to: 'zernst3@live.com',
			subject: 'New Inquery from your webpage',
			html: "<h1>Information</h1>" +
				  "<p><strong>From: </strong>" + req.body.name + ", " + req.body.email + "</p>" +
				  "<p>" + req.body.message + "</p>"
		}
		
		// 3.		
		transporter.sendMail(mailOptions, function(err, data) {
			if (err){
				console.log(err);
			} else {
				console.log("Email Sent Successfully");
			}
		});
	}
	catch (err) {console.log(err);}	

	try {
		// 2.	
		let mailOptions = {
			from: 'zernst3@live.com',
			to: req.body.email,
			subject: 'Thank You for your Email',
			html: "<p>Hello " + req.body.name + ",</p>" +
				  "<p>Thank you for contacting me on my website!  I will be in contact with you soon to discuss your inquery.  Have a great day!</p>" +
				  "<p>Sincerely,</p>" +
				  "<p>Zachary Ernst<p>"
		}
		
		// 3.		
		transporter.sendMail(mailOptions, function(err, data) {
			if (err){
				console.log(err);
			} else {
				console.log("Email Sent Successfully");
			}
		});
	}
	catch (err) {console.log(err);}	

	req.flash("success", "Email Sent");
	res.redirect("/");
});

app.get("/project_1", function(req, res){
	res.render("project_1");
});

app.get("/project_2", function(req, res){
	res.render("project_2");
});

app.get("*", function(req, res){ 
	res.send("404 Not Found!");
});

app.listen(process.env.PORT || 5000, function() { 
	console.log('Server listening on port'); 
  });