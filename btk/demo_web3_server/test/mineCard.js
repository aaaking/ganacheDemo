var redis = require('./redis');

var cnt = 0
function mineCard() {
    if (cnt == 0) {
        console.log('done');
        return;
    }
    redis.pushMethod({
        method: "mineCard",
        uid: '1001'
    })

    cnt--;
    setTimeout(mineCard, 500);
}

module.exports = function() {
    cnt = 1;
    mineCard();
}