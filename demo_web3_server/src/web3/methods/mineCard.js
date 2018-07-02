var btkSourceCtrl = require('../contracts/btkSourceCtrl');
var redis = require('../redis/async');
var utils = require('../utils/utils');
var cardUtils = require('../utils/card');

var transactions = {}

function notifyLuaError(uid, code) {
    redis.notifyLuaError('mineCard', uid, code);
}

function mintDone(uid, tokens) {
    var cards = [];
    tokens.forEach(t => {
        cards.push(cardUtils.tokenToCard(t));
    });

    redis.notifyLua({
        uid : uid,
        method: "mineCard",
        cards: cards
    })

    redis.addUserCard(uid, tokens);

    cards.forEach(c => {
        var n = cardUtils.packageNum(c.cardId);
        var camp = cardUtils.campOfCard(c.cardId);
        redis.decrPackageCard(0, n, camp, c.cardId);
    });

    utils.updateUserBalance(uid);
}

function onBuyPackage(event) {
    var args = event.args;
    var from = args.from;
    var userTrans = transactions[from];
    if (userTrans) {
        var hash = event.transactionHash;
        for(let i = 0; i < userTrans.detail.length; i++) {
            if (userTrans.detail[i] == hash) {
                userTrans.detail.splice(i, 1);

                var token = args.card.toString();
                userTrans.tokens.push(token);
                console.log("user mint card:" + userTrans.uid + token);

                if (userTrans.detail.length == 0) {
                    mintDone(userTrans.uid, userTrans.tokens);
                    delete transactions[from];
                }
                break;
            }
        }
    }
}

function mineCard(ops) {
    var uid = ops.uid;
    var num = ops.num || 1;

    utils.addressOfUser(uid, function(err, rep) {
        if (err) {
            console.error("get user address error:" + uid);
            console.error(err);
            notifyLuaError(uid, 1);
            return;
        }

        var address = rep[0];
        if (!address) {
            console.error("user has no address:" + uid);
            notifyLuaError(uid, 1);            
            return;
        }

        if (transactions[address]) {
            console.error("user is minting card:" + uid);
            notifyLuaError(uid, 1);
            return;
        }

        for(let i = 0; i < num; i++) {
            btkSourceCtrl.buyPackage(address, function(err, transactionHash) {
                if (err) {
                    console.error("user mint card error: " + uid);
                    console.error(err);
                    console.error(transactionHash);
                } else {
                    console.log(transactionHash);
                    if(!transactions[address]) {
                        transactions[address] = {
                            uid : uid,
                            detail : [],
                            tokens : []
                        }
                    }
                    transactions[address].detail.push(transactionHash);
                }
            });
        }
    })
}

btkSourceCtrl.addBuyPackageListener(onBuyPackage);

module.exports = mineCard;