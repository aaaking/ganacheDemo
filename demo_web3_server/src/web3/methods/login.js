var web3 = require('../web3')
var cardWallet = require('../contracts/cardWallet');
var utils = require('../utils/utils');
var redis = require('../redis/async');
var util = require('util');

var uids = {}

function notifyLuaError(uid, code) {
    redis.notifyLuaError("login", uid, code);
}

function unlocked(uid, address) {

    var infoes = {
        loginTime: Date.now()
    };

    web3.eth.getBalance(address, (err, rep) => {
        if (err) {
            console.error("get user balance error: " + err.toString());
        } else {
            infoes.balance = web3.fromWei(rep, 'ether').toString(10);
            redis.updateUserInfoes(uid, infoes);
        }

        redis.notifyLua({
            method: "login",
            uid: uid
        })

        delete uids[uid];
    })

    redis.getUserCardsCnt(uid, (err, rep) => {
        cardWallet.balanceOf(address, (err, balance) => {
            balance = balance.toNumber();
            if (rep != balance) {
                console.log("user tokens unequal " + rep.toString() + " " + balance.toString());
                redis.removeUserAllCards(uid, (err, rep) => {
                    if (err) {
                        console.error(util.format('remove %s cards error: %s', uid.toString(), err.toString()));
                    } else {
                        cardWallet.tokensOfOwner(address, balance, (err, tokens) => {
                            console.log(util.format("reset %s cards", uid.toString()));
                            if (!err && tokens.length > 0) {
                                redis.addUserCard(uid, tokens);
                            } else if(err){
                                console.error("get user cards error: " + err.toString());
                            }
                        })
                    }
                })
            }
        })
    });
}

module.exports = function(ops) {
    var uid  = ops.uid

    if (uids[uid]) {
        return;
    }

    uids[uid] = true;

    utils.addressOfUser(uid, function(err, rep) {
        if (err) {
            notifyLuaError(uid, 1);
            console.error(err);
        } else {
            var address = rep[0];
            var passCode = rep[1];
            if (!address || !passCode) {
                notifyLuaError(uid, 2);
                return;
            }

            web3.personal.unlockAccount(address, passCode, 0, function(err, rep) {
                if (err) {
                    console.error(err);
                } else {
                    if (!rep) {
                        console.error('unlock account failed. uid: ' + uid + 'address: ' + address + 'passCode: ' + passCode);
                    } else {
                        unlocked(uid, address);
                    }
                }
            });

        }
    })

}