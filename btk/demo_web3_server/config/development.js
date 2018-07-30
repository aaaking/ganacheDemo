var redis_keys = require('./redis_keys');

module.exports = {
    web3 : {
        "provider" : "http://10.225.136.163:18545",
        "packagePrice" : 10,
        "networks": "1528706883921"
    },

    redis : {
        "host" : "127.0.0.1",
        "port" : "6379",
        "password" : "123456",
        "db": "0"
    },

    redis_keys: redis_keys
}