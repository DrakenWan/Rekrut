const crypto = require("crypto");
const key = "drakenwan";
const passwordkey = "darwinbox";

var token = function(input)
{
    //generating a stupid token
    //hmac on username + hmac on date ==> x
    //hmac md5 on x
    
    var x = crypto.createHmac('sha256', key).update(input.username).digest('hex') + crypto.createHmac('sha256', key).update(Date.now().toString()).digest('hex');
    var genValue = crypto.createHmac('md5', key).update(x).digest('hex');
    input.token = genValue;

    //hmac on password
    x = crypto.createHmac('sha256', passwordkey).update(input.password).digest('hex');
    input.password = x;
    return input;
}

module.exports = token;