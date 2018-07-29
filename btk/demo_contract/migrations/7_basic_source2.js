var BasicSource = artifacts.require("./Package/BasicSource2.sol");

module.exports = function(deployer, network) {
    deployer.deploy(BasicSource);
};
