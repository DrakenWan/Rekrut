var http = require('http');
CONST DBNAME = "RekrutSandbox";
CONST COLLECTION = "users"
CONST MONGODB_SERVER = "mongodb://localhost:27017/";
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
			
			mongoclient.connect(MONGODB_SERVER, function(err, db)
			{
				if(err) throw err;
				var dbo = db.db(DBNAME);
				dbo.collection(COLLECTION).insertOne(object, function(err, res) {
					if(err) throw err;
					console.log("Profile data for " + object.name.trim() +" successfully received.");
					db.close();
				});
			});
		}
		
		res.writeHead(200);
	});
}).listen(3000);
