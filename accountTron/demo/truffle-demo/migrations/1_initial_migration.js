const UPDATE_GENETIC_ONLY = false;
var Migrations = artifacts.require("./Migrations.sol");
var Utils = artifacts.require("./libs/Utils.sol");

module.exports = function (deployer, network, accounts) {
  // web3.personal.unlockAccount("0x4BaBf11D785922DDDb51076AC0030FDC41778607", "12345678", 3600)
  if (UPDATE_GENETIC_ONLY) {
    console.log("\n###################start update Genetic Algorithm only#####################\n");
    Migrations.deployed().then(async instance => {
      console.log('Jurassic.deployed() for update')
      deployer.deploy(Utils, Migrations.address).then(async function () {
        await instance.setGeneticAlgorithmAddress(Utils.address);
        let addr = await instance.utils();
        console.log("************genertic addr in jurassic: " + addr);
        return Utils.deployed();
      }).then(async instance => {
        let addr = await instance.jurassicAddr();
        console.log("************jurassic addr in genetic algorithm: " + addr);
        console.assert(addr == Migrations.address, "------jurassic addr in genetic algorithm wrong!");
      });
    })
  } else {
    // deployer.deploy(Utils);
    // deployer.link(Utils, Migrations);
    deployer.deploy(Migrations).then(async function() {
      Migrations.deployed().then(async instance => {
        console.log('--------------------start deploy GeneticAlgorithm-------------')
        // web3.personal.unlockAccount("0xc7B5F6d0245339674ae4264E44173bC606881651", "12345678", 10)
        deployer.deploy(Utils, Migrations.address).then(async function () {
          await instance.setGeneticAlgorithmAddress(Utils.address);
          let addr = await instance.utils();
          console.log("************genertic addr in jurassic: " + addr);

          console.assert(addr == Utils.address, "------genetic address wrong!");

          return Utils.deployed();
        }).then(async instance => {
          let addr = await instance.jurassicAddr();
          console.log("************jurassic addr in genetic algorithm: " + addr);

          console.assert(addr == Migrations.address, "------jurassic addr in genetic algorithm wrong!");
        });
      });
    });
  }
}