const devmode = false;
const mongoclient = require('../node_modules/mongodb').MongoClient;
const URL = "mongodb://localhost:27017/";
const DBNAME = "RekrutSandbox";
const COLLECTION = "rekruter";

var validate = function (tokenValue, callback) {
    var flag = 0;
    var checker = "";
    if(devmode) console.log(tokenValue);
    mongoclient.connect(URL, {
        useNewUrlParser: true
    }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DBNAME);
        var query = {
            token: tokenValue
        };
        dbo.collection(COLLECTION).find(query).toArray(function (err, result) {
            if (err) throw err;
            return callback(result);
        });
    });
}

module.exports = validate;