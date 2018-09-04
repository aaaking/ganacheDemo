pragma solidity ^0.4.18;

import "../Jurassic/EggNFT.sol";
import "../Genetic/GeneticAlgorithmInterface.sol";

// 用于运营活动时产生恐龙蛋

contract Minting is EggNFT {
    uint256 public promoCreationLimit = 10000;
    uint256 public gen0CreationLimit = 20000;

    uint256 public promoCreatedCount;
    uint256 public gen0CreatedCount;

    GeneticAlgorithmInterface public geneticAlgorithm;

    function setGeneticAlgorithmAddress(address _addr) public onlyCTO {
        GeneticAlgorithmInterface candidateContract = GeneticAlgorithmInterface(_addr);
        require(candidateContract.implementsGenetic());
        geneticAlgorithm = candidateContract;
    }

    function createPromoEgg(uint256 _kind, uint256 _genesF, uint256 _genesM, uint256 _hatchCDIndex, address _owner) public onlyCOO {

        if (_owner == address(0)) {
            _owner = cooAddress;
        }

        require(promoCreatedCount < promoCreationLimit);

        promoCreatedCount++;

        // (_kind << 1) << 5 | _kind << 1
        uint256 kind = _kind << 6 | _kind << 1;

        _createEgg(kind, 0, 0, 0, _genesF, _genesM, _hatchCDIndex, _owner);
    }


    function _createGen0Egg (address _owner) internal returns (uint256) {

        require(gen0CreatedCount < gen0CreationLimit);

        var (_genesF, _genesM, _kind, _hatchCDIndex) = geneticAlgorithm.buildGen0Genes(gen0CreatedCount);

        uint256 _newId = _createEgg(_kind, 0, 0, 0, _genesF, _genesM, _hatchCDIndex, _owner);

        gen0CreatedCount++;

        return _newId;
    }

}
