var web3 = require('../web3');

function cardToToken(id, code) {
    var cardId = '0x' + id.toString(16) + '00000000';
    cardId = web3.toBigNumber(cardId);
    return token = cardId.plus(code).toString();
}

function tokenToCard(token) {
    token = web3.toBigNumber(token).toString(2);
    var cardId = parseInt(token.substr(0, token.length - 32), 2);
    var cardCode = parseInt(token.slice(-32), 2);
    return {
        cardId: cardId,
        cardCode: cardCode
    }
}

function starOfCard(cardId) {
    return Math.floor(cardId / 10000) % 100
}

function campOfCard(cardId) {
    return Math.floor(cardId % 10000 / 100) - 1;
}

function packageNum(cardId) {
    return Math.floor(cardId / 1000000);
}

module.exports = {
    cardToToken: cardToToken,
    tokenToCard: tokenToCard,
    starOfCard: starOfCard,
    campOfCard: campOfCard,
    packageNum: packageNum
}