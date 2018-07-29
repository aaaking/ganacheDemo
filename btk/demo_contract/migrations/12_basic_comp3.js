var BasicComp = artifacts.require("./Package/BasicComp3.sol");

module.exports = function(deployer, network) {
    deployer.deploy(BasicComp);
};
