var mineCard = require('./methods/mineCard');
var makeBuyOrder = require('./methods/makeBuyOrder');
var makeSellOrder = require('./methods/makeSellOrder');
var takeBuyOrder = require('./methods/takeBuyOrder');
var takeSellOrder = require('./methods/takeSellOrder');
var cancelSellOrder = require('./methods/cancelSellOrder');
var cancelBuyOrder = require('./methods/cancelBuyOrder');
var login = require('./methods/login');
var doCompound = require('./methods/doCompound');

module.exports = {
    LOGIN : login,

    MINECARD : mineCard, 
    MAKEBUYORDER: makeBuyOrder,

    TAKEBUYORDER: takeBuyOrder,
    
    MAKESELLORDER: makeSellOrder,

    TAKESELLORDER: takeSellOrder,

    CANCELSELLORDER: cancelSellOrder,

    CANCELBUYORDER: cancelBuyOrder,
    DOCOMPOUNDREP: doCompound
};