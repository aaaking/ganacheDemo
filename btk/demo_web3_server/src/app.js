require('./preload');

var web3 = require('./web3/main')
var request = require('./requests/main')


function onRedisRequest(ops) {
    try {
        web3.onRequest(ops.method, ops);
    } catch (error) {
        console.error(error);        
    }
}

request.on('mineCard', onRedisRequest)
request.on('makeSellOrder', onRedisRequest)
request.on('takeSellOrder', onRedisRequest)
request.on('makeBuyOrder', onRedisRequest)
request.on('takeBuyOrder', onRedisRequest)
request.on('cancelSellOrder', onRedisRequest)
request.on('cancelBuyOrder', onRedisRequest)
request.on('login', onRedisRequest)
request.on('doCompoundRep', onRedisRequest)