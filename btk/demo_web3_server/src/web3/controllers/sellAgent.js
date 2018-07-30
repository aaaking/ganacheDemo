var web3 = require('../web3');
var sellAgent = require('../contracts/sellAgent');
var redis = require('../redis/async');
var utils = require('../utils/utils');

function init_sellAgent() {
  sellAgent.getAllOrders((err, orders) => {
    if (err) {
        console.log(err);
    } else {
        for(var i = 0; i < orders.length; i++) {
            var order = orders[i];
            var uid = utils.uidOfAddress(order[0]);
            var token = order[1].toNumber();
            var price = web3.fromWei(order[2], 'ether').toNumber();

            redis.addSellOrder(uid, token, price);
        }
    }
  })
}


init_sellAgent();