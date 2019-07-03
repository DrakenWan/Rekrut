/* 
   > jscript file to send in username and password
     into the mongodb database collection rekruter
     directly 
   > Created for testing purposes
   > Supposed to give credentials when running the executable in cmdline
*/
const crypto = require('crypto')
const key = "darwinbox"; //weak key //use something strong //if an attacker targets the system they will easily decipher the hmac with bruteforce
const mongoclient = require('mongodb').MongoClient;
const URL = "mongodb://localhost:27017/";
const DBNAME = "RekrutSandbox";
const COLLECTION = "rekruter";
var rekruter = require("./models/rekruter.js");

var uname = process.argv[2];
var pwd = process.argv[3];
var token = "";

if (uname && pwd) {
    pwd = crypto.createHmac('sha256', key).update(pwd).digest('hex');

    rekruter.username = uname;
    rekruter.password = pwd;
    rekruter.token = token;
    console.log(JSON.stringify(rekruter));

    mongoclient.connect(URL, {
        useNewUrlParser: true
    }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DBNAME);
        var query = {
            username: rekruter.username
        };
        dbo.collection(COLLECTION).find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                console.error("Username already exists! Please try a different username to signup.");
                process.exit();
            } else {
                dbo.collection(COLLECTION).insertOne(rekruter, function (err) {
                    if (err) throw err;
                    console.log("Document for " + COLLECTION + " successfully added.");
                    db.close();
                    process.exit();
                });
            } //inserting document into rekruter
        }); //dbo.collection().find ends here
    }); //mongoclient connect ends here
} // the big if condition
else {
    console.error("Shittake mushrooms! The credentials are empty!");
} // the credentials weren't filled in the first place