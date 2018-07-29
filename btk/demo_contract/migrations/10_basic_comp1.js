var BasicComp = artifacts.require("./Package/BasicComp1.sol");

module.exports = function(deployer, network) {
    deployer.deploy(BasicComp);
};
