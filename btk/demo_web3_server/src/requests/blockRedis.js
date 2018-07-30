var rediz = require('redis');

var blockClient

function init () {
}

var BlockRedis = function(key) {
    this.key = key;

    let config = AppConfig.redis;

    if (config == null) {
        throw new Error("redis options is null!");
        return;
    }
    this.blockClient = rediz.createClient(config.port, config.host, {
            password: config.password,
            db:config.db || 0
        });

    this.blockClient.on('error', function(err) {
        console.log('error event - ' + redis.host + ':' + redis.port + ' - ' + err);
    });

}

BlockRedis.prototype.poll = function() {
    this.blockClient.subscribe(this.key, function(err, rep) {
        if (err) {
            console.log(err);
        } else {
            console.log("start subscribe channel: " + this.key);
        }
    }.bind(this));

    this.blockClient.on("message", function(channel, message) {
        console.log("recieve message " + message);

        if (this.listener) {
            this.listener(channel, message);
        }
    }.bind(this));
}


module.exports = BlockRedis;
