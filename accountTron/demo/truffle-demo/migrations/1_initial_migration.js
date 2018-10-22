const UPDATE_GENETIC_ONLY = false;
var Migrations = artifacts.require("./Migrations.sol");
var Utils = artifacts.require("./libs/Utils.sol");

module.exports = function (deployer, network, accounts) {

  if (UPDATE_GENETIC_ONLY) {
    console.log("\n###################start update Genetic Algorithm only#####################\n");
    Jurassic.deployed().then(async instance => {
      console.log('Jurassic.deployed() for update')
      deployer.deploy(Utils).then(async function () {
        // await instance.setGeneticAlgorithmAddress(GeneticAlgorithm.address, { from: CEO });
        // let addr = await instance.geneticAlgorithm();
        console.log("************genertic addr in jurassic: " + "addr");
        return Utils.deployed();
      }).then(async instance => {
        let addr = "addr"//await instance.jurassicAddr();
        console.log("************jurassic addr in genetic algorithm: " + addr);
        // console.assert(addr == Jurassic.address, "------jurassic addr in genetic algorithm wrong!");
      });
    })
  } else {
    deployer.deploy(Utils);
    deployer.link(Utils, Migrations);
    deployer.deploy(Migrations);
  }
}