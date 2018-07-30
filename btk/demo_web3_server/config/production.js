var redis_keys = require('./redis_keys');

module.exports = {
    web3 : {
        "provider" : "http://61.147.167.163:18545",
        "packagePrice" : 10,
        "networks": "8888"
    },

    redis : {
        "host" : "127.0.0.1",
        "port" : "6379",
        "password" : "YK9ZM279",
        "db": "0"
    },

    redis_keys: redis_keys
}