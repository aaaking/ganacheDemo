var BasicSource = artifacts.require("./Package/BasicSource3.sol");

module.exports = function(deployer, network) {
    deployer.deploy(BasicSource);
};
