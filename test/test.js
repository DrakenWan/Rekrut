var express = require("express");
var user = require("./models/user");
var rekrut = require("./models/rekruter");
var sendDB = require("./controller/sendToDB");
const createToken = require("./createToken");
var validateToken = require("./controller/tokenValidate");
var authorize = require("./controller/authorize");
const DBNAME = "RekrutSandbox";

var app = express();

app.get('/',function(req, res) {
	var URL = req.url;
	res.end("You are on the RekrutServer.");
	console.log(URL + ". Root triggered at " + Date());
});

app.get('/karry', function(req, res)
{
	var URL = req.url;
	res.end(URL.slice(1) + " loves it");
	console.log(URL + " was triggered at " + Date());
});

app.use('/recruitUser', function(req, res)
{
	var data = "";
	if(req.method == 'POST')
	{
		 req.on('data', function(chunk)
		 {
			data += chunk; 
		 });
		 req.on('end', function(err)
		 {
			 if(err) console.log(err);
			 user = JSON.parse(data);
			 //console.log(user);
			 sendDB(DBNAME,"users", user);
		 });
	}
	else
	{
		console.log("User data not received. Error sent: 300");
		res.status(300).send("<html><body>"+
					"<p> Error: Did not receive the body of it </p>"+
					"<p> Timestamp: " + Date() + "</p>"+
					"</body></html>");
		res.end();
	}
});

app.use('/tokenCheck', function(req, res)
{
	var data = "";
	if(req.method == 'POST')
	{
		req.on('data', function(chunk)
		{
			data+=chunk;
		});
		req.on('end', function(err)
		{
		   if(err) console.log(err);
		   console.log("Client's Token: " + data);
		   validateToken(data, function(result)
		   {
			 if(result[0])
			 {
				if(result[0].token == data && result[0].token != "")
					{
						console.log("Successful token match with database.");
						res.status(200).send("tokenexists");
					}
			 }
			 else {
				  console.log("Client token did not match with database.");
				  res.status(200).send("tokennotexists");
			 }
		   });
		});
	}
	else
	{
		console.log("Request not post method. Error sent: 300");
		res.end("<p>Error status: 300. No post request received.</p>");
	}

});

app.use('/authenticateRekruter', function(req, res)
{
 var data = "";
 if(req.method == 'POST')
 {
	 req.on('data', function(chunk)
	 {
		data+=chunk;
	 });
	 req.on('end', function(err)
	 {
		if(err) console.log(err);
		rekrut = JSON.parse(data);
		rekrut = createToken(rekrut);
		authorize(DBNAME, "rekruter", rekrut, function(obj, val)
		{
			if(val == -1)
			{
				console.log("Username does not exist in db.");
				res.status(200).send("-1");
			}
			if(val == 0)
			{
				console.log("Passwords do not match!");
				res.status(200).send("0");
			}
			if(val == 1)
			{
				console.log("Successfully updated the details!");
				res.status(200).send(obj.token);
			}
		});
	 });
 }
 else
 {
	res.status(300).send("<html><body>"+
						"<p> Error: Get request instead of Post.</p>"+
						"<p> Timestamp: " + Date() + "</p>"+
						"</body></html>");
	res.end();
 }
});

const server = app.listen(3000);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown()
{
	console.log("Received the kill signal, shutting down the server with a royal grace.");
	server.close(() =>
	{
		console.log("Closing remaining connections");
		process.exit(0);
	});
	
	setTimeout( () =>
	{
		console.error('Could not close connections in time, forcefully shutting down.');
		process.exit(1);
	}, 10000);;
}