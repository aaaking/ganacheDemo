var BasicComp = artifacts.require("./Package/BasicComp2.sol");

module.exports = function(deployer, network) {
    deployer.deploy(BasicComp);
};
