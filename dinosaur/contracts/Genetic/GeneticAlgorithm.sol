pragma solidity ^0.4.18;

import "./GeneticAlgorithmInterface.sol";
import "../ControlCenter.sol";

/**
 * The GeneticAlgorithm contract
 */
contract GeneticAlgorithm is GeneticAlgorithmInterface, ControlCenter {

    // 属性和其附属基因
    uint256 STRENGTH_MASK     = 0x000000000000000000000000000000000000000000000001FFFFFFFFFFFFFFFF;
    uint256 INTELLIGENCE_MASK = 0x00000000000000000000000000000003FFFFFFFFFFFFFFFE0000000000000000;
    uint256 AGILE_MASK        = 0x0000000000000007FFFFFFFFFFFFFFFC00000000000000000000000000000000;
    uint256 LUCKY_MASK        = 0x00000007FFFFFFF8000000000000000000000000000000000000000000000000;

    uint256 MULTIPLE_RAND_MASK = 0x0000000000000000000000000000FFFF;

    uint256 KIND1_MASK = 0x3E0;
    uint256 KIND2_MASK = 0x01F;

    uint16 constant HATCHING_CD_INDEX = 6;
    uint16 constant SEEKING_CD_INDEX = 7;

    // 4种恐龙
    uint256 constant KIND_COUNT = 4;

    constructor(address _jurassic) public {
        jurassicAddr = _jurassic;
    }

    function implementsGenetic() public pure returns (bool) {
        return true;
    }

    // function buildAttributes (uint256 _genesF, uint256 _genesM) public view onlyJurassic returns (uint256 _attr, uint256 _seekingCDIndex, uint256 _breedingCDIndex) {
    //     _attr = _genesF;
    //     _attr = _genesM;

    //     // 默认愉悦度
    //     _attr = 10;

    //     _seekingCDIndex = unit_test ? 0 : 4 hours;
    //     _breedingCDIndex = unit_test ? 0 : 2 hours;
    // }

    /**
     *  生殖遗传
     */
    function buildKind (uint256 _motherKind, uint256 _fatherKind)
        public view onlyJurassic
        returns (uint256)
    {
        uint256 rand1 = _randBetween(0, 100, 1);
        uint256 rand2 = _randBetween(0, 100, 2);

        // 父母共四种类型，凭概率各取一种组成新的基因。显性隐性值不变。
        uint256 kind1 = rand1 > 50 ? (_motherKind & KIND1_MASK) >> 5 : (_motherKind & KIND2_MASK);
        uint256 kind2 = rand2 > 50 ? (_fatherKind & KIND1_MASK) >> 5 : (_fatherKind & KIND2_MASK);

        return (kind1 << 5 | kind2);
    }

    function inheritedGenes (uint256 _motherGenesF,
                             uint256 _motherGenesM,
                             uint256 _fatherGenesF,
                             uint256 _fatherGenesM)
        public view onlyJurassic
        returns (uint256 _genesF, uint256 _genesM, uint256 _hatchCDIndex)
    {
        uint256 rand1 = _randBetween(0, 100, 1);
        uint256 rand2 = _randBetween(0, 100, 2);

        uint256 usedGenes1 = rand1 > 50 ? _motherGenesF : _motherGenesM;
        uint256 usedGenes2 = rand2 > 50 ? _fatherGenesF : _fatherGenesM;

        _genesF = _inheritedOneGenes(usedGenes1, rand1);
        _genesM = _inheritedOneGenes(usedGenes2, rand2);

        _hatchCDIndex = HATCHING_CD_INDEX;//_randBetween(0, 14, 3);
    }


    function _inheritedOneGenes (uint256 _genes, uint256 _seed) private view returns (uint256) {
        uint256 heredityValue = _randBetween(100, 131, _seed);

        uint256 s = parseStrength(_genes);
        uint256 i = parseIntelligence(_genes);
        uint256 a = parseAgile(_genes);
        uint256 l = parseLucky(_genes);

        uint256 _strength     = _inheritedSingleAttribute(s, heredityValue, false);
        uint256 _intelligence = _inheritedSingleAttribute(i, heredityValue, false);
        uint256 _agile        = _inheritedSingleAttribute(a, heredityValue, false);
        uint256 _lucky        = _inheritedSingleAttribute(l, heredityValue, true);

        return _packGenes(_strength, _intelligence, _agile, _lucky);

    }

    function _inheritedSingleAttribute (uint256 _genes, uint256 _randValue, bool _isLucky) private pure returns (uint256) {
        uint256 gene0;
        uint256 gene1;
        uint256 gene2;
        uint256 gene3;
        uint256 gene4;
        uint256 gene5;
        (gene0, gene1, gene2, gene3, gene4, gene5) = _parseOneGene(_genes, _isLucky);

        uint256 genes = gene0;
        if (!_isLucky) {
            genes = _inheritedSignleGene(genes, gene1, _randValue);
            genes = _inheritedSignleGene(genes, gene2, _randValue);
            genes = _inheritedSignleGene(genes, gene3, _randValue);
        }
        genes = _inheritedSignleGene(genes, gene4, _randValue);
        genes = _inheritedSignleGene(genes, gene5, _randValue);

        return genes;
    }

    function _inheritedSignleGene (uint256 genes, uint256 _gene, uint256 _randValue) private pure returns (uint256) {
        uint256 gene = max((_gene >> 1) * _randValue / 100, 1);
        gene = min(gene, 999);
        genes = (genes << 11) | gene << 1 | _gene & 0x01;

        return genes;
    }

    // gene0 为属性，其他为附属基因
    function _parseOneGene (uint256 _gene, bool _isLucky) private pure
        returns (uint256 gene0, uint256 gene1, uint256 gene2, uint256 gene3, uint256 gene4, uint256 gene5)
    {
        if (_isLucky) {
            gene5 = (_gene) & 0x7FF;
            gene4 = (_gene >> 11) & 0x7FF;
            gene0 = (_gene >> 22) & 0x3FF;
        } else {
            gene5 = (_gene) & 0x7FF;
            gene4 = (_gene >> 11) & 0x7FF;
            gene3 = (_gene >> 22) & 0x7FF;
            gene2 = (_gene >> 33) & 0x7FF;
            gene1 = (_gene >> 44) & 0x7FF;
            gene0 = (_gene >> 55) & 0x3FF;
        }
    }

    function parseStrength (uint256 _genes) public view onlyJurassic returns (uint256) {
        return (_genes & STRENGTH_MASK);
    }

    function parseIntelligence (uint256 _genes) public view onlyJurassic returns (uint256) {
        return ((_genes & INTELLIGENCE_MASK) >> 65);
    }

    function parseAgile (uint256 _genes) public view onlyJurassic returns (uint256) {
        return ((_genes & AGILE_MASK) >> 130);
    }

    function parseLucky (uint256 _genes) public view onlyJurassic returns (uint256) {
        return ((_genes & LUCKY_MASK) >> 195);
    }

    /**
     * 孵化
     */

    function calcBreedingIndex (uint256 generationF, uint256 generationM, uint256 maxIndex) public pure returns (uint256) {
         return min((generationF + generationM) / 2, maxIndex);
    }


    /**
     *  0代蛋
     */
    function buildGen0Genes (uint256 _randSeed) public view
            returns (uint256 _genesF, uint256 _genesM, uint256 _kind, uint256 _hatchCDIndex)
    {
        _genesF = _buildOneGenes(_randSeed + 100);
        _genesM = _buildOneGenes(_randSeed + 200);

        uint256 kind1 = _randBetween(1, 5, _randSeed + 10) << 1 | _randBetween(0, 2, _randSeed + 10);
        uint256 kind2 = _randBetween(1, 5, _randSeed + 20) << 1 | _randBetween(0, 2, _randSeed + 20);
        _kind = kind1 << 5 | kind2;

        _hatchCDIndex = HATCHING_CD_INDEX;
    }

    function _buildOneGenes (uint256 _seed) private view returns (uint256) {
        uint256 _strength     = _buildSingleAttribute(_seed + 10, false);
        uint256 _intelligence = _buildSingleAttribute(_seed + 20, false);
        uint256 _agile        = _buildSingleAttribute(_seed + 30, false);
        uint256 _lucky        = _buildSingleAttribute(_seed + 40, true);

        return _packGenes(_strength, _intelligence, _agile, _lucky);
    }

    // 生成一个单个的属性，格式为：
    // 属性类型(10位) + 附属基因1(10位) + 1的显性隐性标志(1位) + ...
    // 每个属性共占 65 位（幸运只有两个附属基因，共占32位）,是个属性共需要 65 * 3 + 32 = 227位
    function _buildSingleAttribute (uint256 _seed, bool _isLucky) private view returns (uint256) {
        uint256 seedP = _seed + 1;
        uint256 gene0;
        uint256 rand1;
        uint256 rand2;
        uint256 rand3;
        uint256 rand4;
        uint256 rand5;
        (gene0, rand1, rand2, rand3, rand4, rand5) = _multipleRand2E14(1, 1000, seedP);

        // 显性还是隐性的边界大小，超过为显性，否则为隐性
        uint256 hideOrShowBounds = _randBetween(1, 1000, seedP);

        uint256 ratioStart = 0;
        uint256 ratioEnd = 1;
        if (gene0 <= 50) {
            ratioStart = 1;
            ratioEnd = 21;
        } else if (gene0 <= 150) {
            ratioStart = 2;
            ratioEnd = 27;
        } else if (gene0 <= 300) {
            ratioStart = 3;
            ratioEnd = 33;
        } else if (gene0 <= 600) {
            ratioStart = 4;
            ratioEnd = 39;
        } else if (gene0 <= 1000) {
            ratioStart = 5;
            ratioEnd = 45;
        }

        uint256 genes = gene0;

        genes = _packSingleGene(genes, ratioStart, ratioEnd, rand1, hideOrShowBounds);
        genes = _packSingleGene(genes, ratioStart, ratioEnd, rand2, hideOrShowBounds);
        if (!_isLucky) {
            genes = _packSingleGene(genes, ratioStart, ratioEnd, rand3, hideOrShowBounds);
            genes = _packSingleGene(genes, ratioStart, ratioEnd, rand4, hideOrShowBounds);
            genes = _packSingleGene(genes, ratioStart, ratioEnd, rand5, hideOrShowBounds);
        }

        return genes;
    }

    // 打包单个附属基因
    function _packSingleGene (uint256 genes,
                              uint256 ratioStart,
                              uint256 ratioEnd,
                              uint256 randValue,
                              uint256 hideOrShowBounds)
        private pure returns (uint256)
    {
        uint256 gene = _calcGeneValueByRatio(ratioStart, ratioEnd, randValue);
        genes = (genes << 11) | gene << 1 | (randValue > hideOrShowBounds ? 1 : 0);

        return genes;
    }

    // 计算附属基因的区间值
    // _randValue: in 1000 unit
    function _calcGeneValueByRatio (uint256 _start, uint256 _end, uint256 _randValue) private pure returns(uint256) {
        uint256 id = _start;
        uint256 ratio = _start;
        while (ratio <= _end) {

            if (_randValue <= 1000 * ratio / _end) {
                break;
            }

            id++;

            ratio += id;
        }

        uint256 value = (id - 1) * 100 + (_randValue % 100) + 1;
        return value;
    }

    /**
     * 辅助函数
     */


    // 随机一个包含_lower但不包含_upper的整数
    function _randBetween (uint256 _lower, uint256 _upper, uint256 _seed) private view returns (uint256) {
        uint256 rand = uint256(keccak256(abi.encodePacked(block.number + 1024, now))) + uint256(keccak256(abi.encodePacked(block.number % _seed, _seed)));

        return (rand % (_upper - _lower)) + _lower;
    }

    // 一次随机返回多个（最多为16个）随机值。每个随机值的上限为2的16次方，即_upper不超过65536
    function _multipleRand2E14(uint256 _lower, uint256 _upper, uint256 _seed) private view
            returns (uint256 rand1, uint256 rand2, uint256 rand3, uint256 rand4, uint256 rand5, uint256 rand6)
    {
        require(_upper < 65536);

        uint256 rand = uint256(keccak256(abi.encodePacked(block.number + 1024, now))) + uint256(keccak256(abi.encodePacked(block.number % _seed, _seed)));

        rand1 = ((rand & MULTIPLE_RAND_MASK) % (_upper - _lower)) + _lower;
        rand2 = (((rand >> 16) & MULTIPLE_RAND_MASK) % (_upper - _lower)) + _lower;
        rand3 = (((rand >> 32) & MULTIPLE_RAND_MASK) % (_upper - _lower)) + _lower;
        rand4 = (((rand >> 48) & MULTIPLE_RAND_MASK) % (_upper - _lower)) + _lower;
        rand5 = (((rand >> 64) & MULTIPLE_RAND_MASK) % (_upper - _lower)) + _lower;
        rand6 = (((rand >> 80) & MULTIPLE_RAND_MASK) % (_upper - _lower)) + _lower;
    }

    function _packGenes (uint256 _strength,
                         uint256 _intelligence,
                         uint256 _agile,
                         uint256 _lucky) private pure returns (uint256)
    {
        uint256 genes = (_lucky << 195) | (_agile << 130) | (_intelligence << 65) | _strength;

        return genes;
    }


}
