var web3 = require('../web3');
var data = require('./config/SellAgent.json');
var config = AppConfig.web3;

var cardWallet = require('./cardWallet');
var EventEmitter = require('events').EventEmitter;

var EventManager = require('../utils/EventManager');

var emitter = new EventEmitter();

var unlock_t = 1000

var addr = data.networks[config.networks].address;
var contract = web3.eth.contract(data.abi).at(addr);

var sellAgent = {
    addr: addr,

    getAllOrders: function(callback) {
        cardWallet.balanceOf(addr, (err, balance) => {
            balance = balance.toNumber();
            if (err) {
                callback(err);
            } else if (balance == 0) {
                callback(null, []);
            } else {

                cardWallet.tokensOfOwner(addr, balance, (err, tokens) => {
                    let orders = [];
                    if (err) {
                        callback(err);
                    } else {
                        var cnt = tokens.length;
                        if (cnt == 0) {
                            callback(null, []);                    
                        } else {
                            let batch = web3.createBatch();
                            for(let i = 0; i < cnt; i++) {
                                let request = contract.orderByToken.request(tokens[i], (err, order) => {
                                    if (err) {
                                        callback(err);            
                                    } else {
                                        orders.push(order);
                                    }
                                    if(orders.length == cnt) {
                                        callback(null, orders);
                                    }
                                });
                                request.params.push('latest');
                            }
                            batch.execute();
                        }
                    }
                })
            }
        })
    },

    takeOrder: function(address, card, price, callback) {
        contract.takeOrder(card, {from:address, value: web3.toWei(price, 'ether'), gas:1000000}, callback);
    },

    withdraw: function(address, callback) {
        contract.withdraw({from: address, gas:1000000}, callback);
    },

    cancelOrder: function(address, card, callback) {
        contract.cancelOrder(card, {from: address, gas: 999999}, callback);
    },

    addMakeOrderListener: function(listener) {
        emitter.on(MAKE_ORDER_EVENT, listener);
    },

    addTakeOrderListener: function(listener) {
        emitter.on(TAKE_ORDER_EVENT, listener);
    },

    addCancelOrderListener: function(listener) {
        emitter.on(CANCEL_ORDER_EVENT, listener);
    },

    addWithDrawListener: function(listener) {
        emitter.on(WITH_DRAW_EVENT, listener);
    }
}

var MAKE_ORDER_EVENT = 'MAKE_ORDER_EVENT';
var TAKE_ORDER_EVENT = 'TAKE_ORDER_EVENT';
var CANCEL_ORDER_EVENT = 'CANCEL_ORDER';
var WITH_DRAW_EVENT = 'WITH_DRAW';


function onMakeOder(err, event) {
    if (err) {
        console.error(err);
        makeEvent.stopWatching();
        makeEvent = contract.MakeOrder(null, null, onMakeOder);
    } else {
        if (makeEventMgr.addEvent(event)) {
            emitter.emit(MAKE_ORDER_EVENT, event);
        }
    }
}

function onTakeOrder(err, event) {
    if (err) {
        console.error(err);
        takeEvent.stopWatching();
        takeEvent = contract.TakeOrder(null, null, onTakeOrder);
    } else {
        if (takeEventMgr.addEvent(event)) {
            emitter.emit(TAKE_ORDER_EVENT, event);
        }
    }
}

function onCancelOrder(err, event) {
    if (err) {
        console.error(err);
        cancelEvent.stopWatching();
        cancelEvent = contract.CancelOrder(null, null, onCancelOrder);
    } else {
        if (cancelEventMgr.addEvent(event)) {
            emitter.emit(CANCEL_ORDER_EVENT, event);
        }
    }
}

function onWithDraw(err, event) {
    if (err) {
        console.error(err);
        withDrawEvent.stopWatching();
        withDrawEvent = contract.WithDraw(null, null, onWithDraw);
    } else {
        if (withDrawEventMgr.addEvent(event)) {
            emitter.emit(WITH_DRAW_EVENT, event);
        }
    }
}

var makeEvent = contract.MakeOrder(null, null, onMakeOder);
var takeEvent = contract.TakeOrder(null, null, onTakeOrder);
var cancelEvent = contract.CancelOrder(null, null, onCancelOrder);
var withDrawEvent = contract.WithDraw(null, null, onWithDraw);

var makeEventMgr = new EventManager();
var takeEventMgr = new EventManager();
var cancelEventMgr = new EventManager();
var withDrawEventMgr = new EventManager();

process.on('SIGINT', function() {
    makeEvent.stopWatching();
    takeEvent.stopWatching();
    cancelEvent.stopWatching();
    withDrawEvent.stopWatching();
    console.log('sell agent stop watching all event');
})

module.exports = sellAgent;