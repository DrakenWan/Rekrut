//sendTodb.js
const mongoclient = require('mongodb').MongoClient;
const URL = "mongodb://localhost:27017/"
/*
 @params {string} dbName - database name
 @params {string} collectionName - name of collection to be accessed
 @params {string} object - document to be added to the given collection
 @params {object} credentials - credentials to be received | default is null
*/

var sendTodb = function(dbName, collectionName, object, credentials=undefined)
{
	mongoclient.connect(URL, { useNewUrlParser: true },function(err, db)
	{
		if(err) throw err;
		var dbo = db.db(dbName);
		var query = {url: object.url};
		dbo.collection(collectionName).find(query).toArray(function(err, result)
        {
         if(err) throw err;
         if(result.length <= 0)
         {
			dbo.collection(collectionName).insertOne(object, function(err)
			{
				if(err) throw err;
				console.log("Document for " + collectionName + " successfully added.");
				db.close();
			});
		}
		else
		{
			dbo.collection(collectionName).updateOne(query, {$set: object}, function(err, res)
			{
				if(err) throw err;
				console.log("Document for " + collectionName + " successfully updated.");
			});
		}
	   });
	});
}

module.exports = sendTodb;