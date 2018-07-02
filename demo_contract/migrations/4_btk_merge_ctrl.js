var BTKMergeCtrl = artifacts.require("./Merge/BTKMergeCtrl.sol");
var CardUtils = artifacts.require("./libs/CardUtils.sol")

module.exports = function(deployer, network) {
  deployer.deploy(CardUtils);
  deployer.link(CardUtils, BTKMergeCtrl);
  deployer.deploy(BTKMergeCtrl);
};
