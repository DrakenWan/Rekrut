const mongoclient = require('mongodb').MongoClient;
const URL = "mongodb://localhost:27017/"

//authorize your rekruter user
var authorize = function(dbName, collectionName, object, callback)
{
	mongoclient.connect(URL, { useNewUrlParser: true },function(err, db)
	{
        if(err) throw err;
        var dbo = db.db(dbName);
        var query = {username: object.username}
        dbo.collection(collectionName).find(query).toArray(function(err, result)
        {
         if(err) throw err;
         if(result.length > 0)
         {
           if(result[0].password == object.password)
           {
             var newval = {$set: object};
             dbo.collection(collectionName).updateOne(query, newval, function(err, res)
             {
                if(err) throw err;
                //console.log("Document updated.");
                return callback(object, 1);
             });
           }
           else
           {
               //console.error("Passwords do not match.");
               return callback(object, 0);
           }
         }
         else
         {
            //console.error("Username does not exist.")
            return callback(object, -1);
         }
        });
    });
}
module.exports = authorize;