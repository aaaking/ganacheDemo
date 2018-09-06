// var AcientGate       = artifacts.require("AcientGate");
var Jurassic         = artifacts.require("Jurassic");
var SaleAuction      = artifacts.require("SaleDutchAuction");
var SiringAuction    = artifacts.require("SiringDutchAuction");
var GeneticAlgorithm = artifacts.require("GeneticAlgorithm");

module.exports = function (deployer, network, accounts) {
    web3.personal.unlockAccount("0xc7B5F6d0245339674ae4264E44173bC606881651", "12345678", 3600)
    // deployer.deploy(AcientGate);
    let CEO = "0xc7B5F6d0245339674ae4264E44173bC606881651"//accounts[0];
    // let TEST_NETWORK = "develop";
    let TEST_NETWORK = "rinkeby";

    if (network == "rinkeby") {
        CEO = "0x270344c85532a95Ba6A0AEE14D10ed4C126d0134";
    }

    console.log("**************CEO addr: " + CEO);

    const UPDATE_GENETIC_ONLY = false;

    if (UPDATE_GENETIC_ONLY) {
        // only update GeneticAlgorithm contract
        console.log("\n###################start update Genetic Algorithm only#####################\n");
        Jurassic.deployed().then(async instance => {
            console.log('Jurassic.deployed() for update')
            deployer.deploy(GeneticAlgorithm, Jurassic.address).then(async function() {
                await instance.setGeneticAlgorithmAddress(GeneticAlgorithm.address, {from: CEO});
                let addr = await instance.geneticAlgorithm();
                console.log("************genertic addr in jurassic: " + addr);

                console.assert(addr == GeneticAlgorithm.address, "------genetic address wrong!");

                return GeneticAlgorithm.deployed();
            }).then(async instance => {
                let addr = await instance.jurassicAddr();
                console.log("************jurassic addr in genetic algorithm: " + addr);

                console.assert(addr == Jurassic.address, "------jurassic addr in genetic algorithm wrong!");
            });
        });
    } else {
        deployer.deploy(Jurassic).then(async function() {
            Jurassic.deployed().then(async instance => {
                console.log('--------------------start deploy GeneticAlgorithm-------------')
                // web3.personal.unlockAccount("0xc7B5F6d0245339674ae4264E44173bC606881651", "12345678", 10)
                deployer.deploy(GeneticAlgorithm, Jurassic.address).then(async function() {
                    await instance.setGeneticAlgorithmAddress(GeneticAlgorithm.address, {from: CEO});
                    let addr = await instance.geneticAlgorithm();
                    console.log("************genertic addr in jurassic: " + addr);

                    console.assert(addr == GeneticAlgorithm.address, "------genetic address wrong!");

                    return GeneticAlgorithm.deployed();
                }).then(async instance => {
                    let addr = await instance.jurassicAddr();
                    console.log("************jurassic addr in genetic algorithm: " + addr);

                    console.assert(addr == Jurassic.address, "------jurassic addr in genetic algorithm wrong!");
                });
            });
        });

        // web3.personal.unlockAccount("0xc7B5F6d0245339674ae4264E44173bC606881651", "12345678", 10)
        deployer.deploy(SaleAuction).then(async function() {
            Jurassic.deployed().then(async instance => {
                await instance.setSaleAuctionAddress(SaleAuction.address, {from: CEO});

                let saleAuctionAddr = await instance.saleDutchAuction();
                console.log("************sale auction addr in jurassic: " + saleAuctionAddr);

                console.assert(saleAuctionAddr == SaleAuction.address, "------sale auction address wrong!");

                return SaleAuction.deployed();
            }).then(async instance => {
                await instance.setNFTEggContract(Jurassic.address, {from: CEO});

                let addr = await instance.nftEggContract();
                console.log("************ntf addr in sale auction: " + addr);

                console.assert(addr == Jurassic.address, "------nft addr in sale auction wrong!");
            });
        });

        // web3.personal.unlockAccount("0xc7B5F6d0245339674ae4264E44173bC606881651", "12345678", 10)
        deployer.deploy(SiringAuction).then(async function() {
            Jurassic.deployed().then(async instance => {
                await instance.setSiringAuctionAddress(SiringAuction.address, {from: CEO});

                let siringAuctionAddr = await instance.siringDutchAuction();
                console.log("************siring auction addr in jurassic: " + siringAuctionAddr);

                console.assert(siringAuctionAddr == SiringAuction.address, "------sale auction address wrong!");

                return SiringAuction.deployed();
            }).then(async instance => {
                await instance.setNFTEggContract(Jurassic.address, {from: CEO});

                let addr = await instance.nftEggContract();
                console.log("************ntf addr in siring auction: " + addr);

                console.assert(addr == Jurassic.address, "------nft addr in siring auction wrong!");
            });
        });
    }
}
