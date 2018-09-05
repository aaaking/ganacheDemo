pragma solidity ^0.4.18;

contract GeneticAlgorithmInterface {
    address public jurassicAddr;

    modifier onlyJurassic() {
        require(msg.sender == jurassicAddr);
        _;
    }

    function implementsGenetic() public pure returns (bool);

    // function buildAttributes (uint256 _genesF, uint256 _genesM) public view onlyJurassic returns (uint256 _attr, uint256 _seekingCDIndex, uint256 _breedingCDIndex);
     function calcBreedingIndex (uint256 generationF, uint256 generationM, uint256 maxIndex) public pure returns (uint256);

    // function buildKindIndex (uint256 _motherKindIndex, uint256 _fatherKindIndex) public view onlyJurassic returns (uint256);

    function buildKind (uint256 _motherKind, uint256 _fatherKind) public view /*onlyJurassic*/ returns (uint256);

    function inheritedGenes (uint256 _motherAttr,
                         uint256 _fatherAttr,
                         uint256 _motherKindIndex,
                         uint256 _fatherKindIndex) public view /*onlyJurassic*/ returns (uint256 _genesF, uint256 _genesM, uint256 _hatchCDIndex);

    function buildGen0Genes (uint256 _totalSupply) public view returns (uint256 _gensF, uint256 _genesM, uint256 _kindIndex, uint256 _hatchCDIndex);

    function min (uint256 a, uint256 b) public pure returns (uint256);

    function max (uint256 a, uint256 b) public pure returns (uint256);

    function parseStrength (uint256 _genes) public view /*onlyJurassic*/ returns (uint256);

    function parseIntelligence (uint256 _genes) public view /*onlyJurassic*/ returns (uint256);

    function parseAgile (uint256 _genes) public view /*onlyJurassic*/ returns (uint256);

    function parseLucky (uint256 _genes) public view /*onlyJurassic*/ returns (uint256);


}
