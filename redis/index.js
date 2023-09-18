const redis = require("redis");
const url = "redis://default:iG0Cx3v3UthjNXKTWHMqdnutT2IPKhAz@redis-12503.c135.eu-central-1-1.ec2.cloud.redislabs.com:12503";
const client = redis.createClient({
    url: url
});

module.exports = client;