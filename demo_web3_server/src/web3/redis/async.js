var utils = require('../utils/card');

var orderLength = 5

var keyConf = {
    "UserInfo": "users:",
    "Web3ReqKey" : "web3_req_list",
    "UserTokens" : "user_tokens:",
    "BuyOrders" : "buy_orders",
    "SellOrders" : "sell_orders",
    "Web3RepKey": "web3_rep_list",
    "Compound" : "compound:"
}

var rediz = require('redis');
var client

function init() {
    if (AppConfig.redis == null) {
        throw new Error("redis options is null!");
        return;
    }

    let config = AppConfig.redis;

    client = rediz.createClient(config.port, config.host, {
        password: config.password,
        db:config.db || 0
    });

}

process.on('SIGINT', function() {
    client.quit();
    console.log('async redis quit ');
})

init();

function logError(err, rep) {
    if (err) {
        console.error(err);
    }
}

function userInfoKey(uid) {
    return keyConf.UserInfo + uid;
}

function getUserInfoes(uid, keys, callback) {
    var key = userInfoKey(uid);
    client.hmget(key, keys, callback);
}

function updateUserInfoes(uid, infoes) {
    var key = userInfoKey(uid);
    client.hmset(key, infoes, logError);
}

function userTokensKey(uid) {
    return keyConf.UserTokens + uid;
}

function addUserCard(uid, card) {
    var key = userTokensKey(uid);
    client.sadd(key, card, logError);
}

function getUserCardsCnt(uid, callback) {
    var key = userTokensKey(uid);
    client.scard(key, callback);
}

function removeUserCard(uid, card) {
    var key = userTokensKey(uid);
    client.srem(key, card, logError);
}

function removeUserAllCards(uid, callback) {
    var key = userTokensKey(uid);
    client.del(key, callback);
}

function addBuyOrder(uid, orderId, card, price, blockNumber) {
    if (orderId) {
        client.hset(keyConf.BuyOrders, orderId.toString(), JSON.stringify({
            uid: uid,
            orderId: orderId,
            card: card,
            price: price,
            blockNumber: blockNumber
        }), logError);
    } else {
        console.log("add sell order error" + ops.token);
    }
}

function removeBuyOrder(orderId) {
    if (orderId) {
        client.hdel(keyConf.BuyOrders, orderId.toString(), logError);
    } else {
        console.log("remove buy order error: no id");
    }
}

function getBuyOrder(orderId, callback) {
    client.hget(keyConf.BuyOrders, orderId.toString(), callback);
}

function addSellOrder(uid, token, price, blockNumber) {
    if (token) {
        client.hset(keyConf.SellOrders, token.toString(), JSON.stringify({
            uid: uid,
            token: token,
            price: price,
            blockNumber: blockNumber
        }), logError);
    } else {
        console.log("add sell order error" + ops.token);
    }
}

function removeSellOrder(token) {
    if (token) {
        client.hdel(keyConf.SellOrders, token.toString(), logError);
    } else {
        console.log("remove sell order error: no token");
    }
}

function getSellOrder(token, callback) {
    client.hget(keyConf.SellOrders, token.toString(), callback);
}

function packageKey(type, n, camp) {
    return 'packages:' + type + ':' + n + ':' + camp;
}

function setPackageCards(type, n, camp, cards) {
    key = packageKey(type, n, camp);
    client.hmset(key, cards, logError);
}

function decrPackageCard(type, n, camp, cate) {
    var key = packageKey(type, n, camp);
    client.hincrby(key, cate, -1, (err, rep) => {
        if (err) {
            console.error(err);
        } else {
            console.log("token remian num: " + cate + " " + rep);
        }
    })
}

function getUserLoginTime(uid, callback) {
    var key = userInfoKey(uid);
    client.hget(key, "loginTime", callback);
}

function setUserLoginTime(uid) {
    var key = userInfoKey(uid);
    client.hset(key, "loginTime", Date.now(), logError);
}

function cardPriceKey(cardId) {
    return 'card_deals:' + cardId;
}

function starPriceKey(star) {
    return 'star_deals:' + star
}

function takeBuyOrder(transaction) {
    var star = utils.starOfCard(transaction.cardId);

    var userKey = userInfoKey(transaction.uid);
    var cardKey = cardPriceKey(transaction.cardId);
    var starKey = starPriceKey(star);
    var tokenKey = userTokensKey(transaction.uid);

    var detail = JSON.stringify({
        type: 1,
        maker: transaction.maker,
        taker: transaction.taker,
        price: transaction.price.toString(),
        cardId: transaction.cardId,
        cardCode: transaction.cardCode,
        time: Date.now()
    })

    client.multi()
        .hdel(keyConf.BuyOrders, transaction.orderId.toString())
        .srem(tokenKey, transaction.token.toString())
        .lpush(cardKey, detail)
        .ltrim(cardKey, 0, orderLength)
        .lpush(starKey, detail)
        .ltrim(starKey, 0, orderLength)
        .hset(userKey, "balance", transaction.takerBalance.toString())
        .exec(logError);
}

function takeSellOrder(transaction) {
    var star = utils.starOfCard(transaction.cardId);

    var userKey = userTokensKey(transaction.uid);
    var cardKey = cardPriceKey(transaction.cardId);
    var starKey = starPriceKey(star);
    var tokenKey = userTokensKey(transaction.uid);

    var detail = JSON.stringify({
        type: 0,
        maker: transaction.maker,
        taker: transaction.taker,
        price: transaction.price.toString(),
        cardId: transaction.cardId,
        cardCode: transaction.cardCode,
        orderId: transaction.orderId,
        time: Date.now()
    })

    client.multi()
        .hdel(keyConf.SellOrders, transaction.token.toString())
        .sadd(tokenKey, transaction.token.toString())
        .lpush(cardKey, detail)
        .ltrim(cardKey, 0, orderLength)
        .lpush(starKey, detail)
        .ltrim(starKey, 0, orderLength)
        .hset(userKey, "balance", transaction.takerBalance.toString())
        .exec(logError);
}

function compoundedKey(token) {
    return keyConf.Compound + token.toString();
}

function addCompound(token, tokens) {
    var cKey = compoundedKey(token);
    client.rpush(cKey, tokens, logError);
}

function compounded(uid, token, tokens, balance) {
    var userKey = userInfoKey(uid);
    var tokenKey = userTokensKey(uid);
    var cKey = compoundedKey(token);

    var cardId = utils.tokenToCard(token).cardId;
    var packageK = packageKey(1, utils.packageNum(cardId), utils.campOfCard(cardId));

    client.multi()
        .sadd(tokenKey, token)
        .srem(tokenKey, tokens)
        .rpush(cKey, tokens)
        .hincrby(packageK, cardId, -1)
        .hset(userKey, 'balance', balance.toString())
        .exec(logError);
}

function removeAllCompound(callback) {
    client.keys(keyConf.Compound + '*', function(err, rep) {
        if (err) {
            callback(err);
        } else {
            console.log(rep);
            if (rep.length == 0) {
                callback(null);
            } else {
                client.del(rep, callback); 
            }
        }
    })
}

function notifyLua(msg) {
    var key = keyConf.Web3RepKey
    client.publish(key, JSON.stringify(msg), logError);

    console.log(JSON.stringify(msg));
}

function notifyLuaError(method, uid, code) {
    notifyLua({
        method: method,
        uid: uid,
        errorCode: code
    })
}

module.exports = {
    getUserInfoes: getUserInfoes,
    updateUserInfoes: updateUserInfoes,
    getUserCardsCnt: getUserCardsCnt,
    addUserCard: addUserCard,
    removeUserCard: removeUserCard,
    getBuyOrder: getBuyOrder,
    addBuyOrder: addBuyOrder,
    removeBuyOrder: removeBuyOrder,
    getSellOrder: getSellOrder,
    addSellOrder: addSellOrder,
    removeSellOrder: removeSellOrder,
    setPackageCards: setPackageCards,
    decrPackageCard: decrPackageCard,
    getUserLoginTime: getUserLoginTime,
    setUserLoginTime: setUserLoginTime,
    notifyLua: notifyLua,
    notifyLuaError: notifyLuaError,
    takeBuyOrder: takeBuyOrder,
    takeSellOrder: takeSellOrder,
    removeUserAllCards: removeUserAllCards,
    addCompound: addCompound,
    compounded: compounded,
    removeAllCompound: removeAllCompound
};