var buyAgent = require('../contracts/buyAgent');
var redis = require('../redis/async');
var web3 = require('../web3')
var utils = require('../utils/utils')

function onMakeOrder(err, event) {
    console.log(event);
}

function onTakeOrder(err, event) {
    console.log(event);
}

function onCancelOrder(err, event) {
    console.log(event);
}

function init_buyAgent() {
  buyAgent.getAllOrders((err, orders) => {
    if (err) {
        console.log(err);
    } else {
        for(var i = 0; i < orders.length; i++) {
            var order = orders[i];
            var orderId = order[0];
            var token = order[1].toNumber();
            var price = web3.fromWei(order[2], 'ether').toNumber();
            var uid = utils.uidOfAddress(order[3]);

            redis.addBuyOrder(uid, orderId, token, price);
        }
    }
  })
}

buyAgent.addMakeOrderListener(onMakeOrder);
buyAgent.addTakeOrderListener(onTakeOrder);
buyAgent.addCancelOrderListener(onCancelOrder);

init_buyAgent();