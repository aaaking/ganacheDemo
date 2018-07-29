var BTKSourceCtrl = artifacts.require("./BTKSourceCtrl.sol");
var CardUtils = artifacts.require("./libs/CardUtils.sol")

module.exports = function(deployer, network) {
  deployer.deploy(CardUtils);
  deployer.link(CardUtils, BTKSourceCtrl);
  deployer.deploy(BTKSourceCtrl);
};
