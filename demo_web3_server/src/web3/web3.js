var Web3 = require('web3')

var config = AppConfig.web3;

var _web3;

if (typeof _web3 !== 'undefined') {
  _web3 = new Web3(web3.currentProvider);
} else {
// set the provider you want from Web3.providers
  _web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
}

console.log('web3 is connected:' + _web3.isConnected());

module.exports = _web3;