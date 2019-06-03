var http = require('http');

http.createServer(function (req, res) {
	var data = "";
	req.on('data', function(chunk)
	{
		data += chunk;
	});
	
	req.on('end', function(err) {
		if(err) console.log("There is an error!\n" + err);
		var object = JSON.parse(data);
		if(object)
		{
			var mongoclient = require('mongodb').MongoClient;
			
			var url ="mongodb://localhost:27017/";
			mongoclient.connect(url, function(err, db)
			{
				if(err) throw err;
				var dbo = db.db("RekrutSandbox");
				dbo.collection("users").insertOne(object, function(err, res) {
					if(err) throw err;
					console.log("Profile data for " + object.name.trim() +" successfully received.");
					db.close();
				});
			});
		}
		
		res.writeHead(200);
	});
}).listen(3000);