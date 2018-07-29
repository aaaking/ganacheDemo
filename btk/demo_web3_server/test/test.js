var stopRedis = require('./redis').stop;
var name = process.argv[2];
var method = require('./' + name)
method();


// stopRedis();