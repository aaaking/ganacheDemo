var web3 = require('../web3');
var redis = require('../redis/async');

function addressOfUser(uid, callback) {
    redis.getUserInfoes(uid, ['address', 'passCode'], callback);
}

function uidOfAddress(address) {
    for(var i = 0; i < uids.length; i++) {
        if (uids[i].toLowerCase() == address) {
            return 1000 + i;
        }
    }
}

function updateUserBalance(uid) {
    addressOfUser(uid, function(err, rep) {
        if (err) {
            console.error(err + " uid:" + uid);
        } else {
            var address = rep[0];
            if (!address) {
                console.error("uid: " + uid + "dont has address");
                return;
            }
            web3.eth.getBalance(address, function(err, result) {
                if (err) {
                    console.error(err + " uid:" + uid);
                } else {
                    redis.updateUserInfoes(uid, {
                        balance: web3.fromWei(result, 'ether').toString(10)
                    })
                }
            })
        }
    });
}

module.exports = {
    addressOfUser: addressOfUser,
    uidOfAddress: uidOfAddress,
    updateUserBalance: updateUserBalance,
}