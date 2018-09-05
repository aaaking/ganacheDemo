pragma solidity ^0.4.18;

import "../ControlCenter.sol";


/**
 * 恐龙蛋和恐龙为一种代币(DNS)，蛋为恐龙的第一个阶段.
 */
contract DinosaurBase is ControlCenter {
    /*** EVENT ***/

    event EggBirth(address indexed owner, uint256 eggId, uint256 motherId, uint256 fatherId, uint256 genesF, uint256 genesM);
    event DinosaurHatched(address indexed owner, uint256 dinosaursId);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /*** DATA TYPES ***/

    struct DNSRToken {
        // 哪一种恐龙以及显性还是隐性，格式为 类型1(4位) + 显性隐性(1位) + 类型2(4位) + 显性隐性(1位)
        uint16 kind;

        // 初代没有父母，设置为0
        uint32 motherId;
        uint32 fatherId;

        // 表示是哪一代
        uint16 generation;

        // 代表哪一个成长阶段，1：蛋，2：恐龙
        uint8 phase;
    }

    struct DinosaurEgg {
        // 恐龙蛋的出生的时间，用区块的时间戳表示
        uint64 birthTime;

        // 恐龙蛋时有效孵化结束的时间，0表示还没有开始孵化
        uint64 hatchEndTime;
        uint16 hatchCDIndex;

        // 恐龙蛋时有效，为基因集合
        uint256 genesF;
        uint256 genesM;

    }

    struct Dinosaur {

        // 恐龙蛋或恐龙的出生的时间，用区块的时间戳表示
        uint64 birthTime;

        // 外出搜索的冷却时间，用区块的时间戳表示
        uint64 seekingCDEndTime;
        // 繁殖的冷却时间，用区块的时间戳表示
        uint64 breedingCDEndTime;

        // 搜索和繁殖的冷却时间索引，搜索和繁殖的时间各自冷却时间的两倍
        // 受蛋的时候的hatchCDIndex影响，不超过上下两阶
        uint16 seekingCDIndex;
        uint16 breedingCDIndex;

        // 怀孕时伴侣的ID，0：没有怀孕
        uint32 siringWithId;

        // 孵化为恐龙后的属性集合，每个属性占16位，暂时只有愉悦度
        uint256 attributes;
    }

    /*** CONSTANTS ***/

    // uint16[4] public DinosaurKinds = [
    //     uint16(1),          // 霸王龙
    //     uint16(2),          // 翼龙
    //     uint16(3),          // 剑龙
    //     uint16(4)          // 甲龙
    // ];

    uint16 constant COOLDOWN_TABLE_SIZE = 14;
    uint32[14] public cooldowns = [
        uint32(1 minutes),
        uint32(2 minutes),
        uint32(5 minutes),
        uint32(10 minutes),
        uint32(30 minutes),
        uint32(1 hours),
        uint32(2 hours),
        uint32(4 hours),
        uint32(8 hours),
        uint32(16 hours),
        uint32(1 days),
        uint32(2 days),
        uint32(4 days),
        uint32(7 days)
    ];

    uint16 constant HATCHING_CD_INDEX = 6;
    uint16 constant SEEKING_CD_INDEX = 7;

    uint16 constant MAX_PLEASURE = 10;
    uint256 constant PLEASURE_MASK = 0xFFFF;

    uint32 constant MAX_IDS        = 4294967295;
    uint16 constant MAX_GENERATION = 65535;

    uint8 constant EGG_PHASE      = 1;
    uint8 constant DINOSAUR_PHASE = 2;


    uint16 constant DINOSAUR_ACTION_FREE = 0;
    uint16 constant DINOSAUR_ACTION_BREEDING = 1;
    uint16 constant DINOSAUR_ACTION_AUCTION = 2;
    uint16 constant DINOSAUR_ACTION_SEEKING = 3;

    /*** STORAGE ***/

    // 以恐龙的ID为索引，存储尚未孵化为恐龙的恐龙蛋（只是用来统计）
    mapping (uint256 => DinosaurEgg) public eggs;
    // 以恐龙的ID为索引，存储已经孵化的恐龙（只是用来统计）
    mapping (uint256 => Dinosaur) public dinosaurs;

    // 以恐龙的ID为索引，存储代表所有的恐龙和恐龙蛋的恐龙代币
    DNSRToken[] dnsrToken;

    // 恐龙ID与其所有者地址的映射，包括恐龙蛋
    mapping (uint256 => address) public dinosaurIndexToOwner;

    // 转移的恐龙ID与其授权拥有者地址的映射，比如拍卖合约和购买者
    mapping (uint256 => address) public dinosaurIndexToApproved;

    // 允许进行繁衍的恐龙ID与请求者地址的映射
    mapping (uint256 => address) public sireAllowedToAddress;

    // 正在探索的恐龙与所有者的地址映射
    mapping (uint256 => address) public seekingIndexToOwner;


    // 拥有恐龙的数量
    mapping (address => uint256) ownershipDinosaurCount;


    /*** FUNCTION ***/

    function _getDinosaurPhase (uint256 _id) internal view returns (uint256) {
        DNSRToken storage _dnsrToken = dnsrToken[_id];
        return _dnsrToken.phase;
    }


    // 为恐龙(蛋)指定新的主人
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        ownershipDinosaurCount[_to]++;

        dinosaurIndexToOwner[_tokenId] = _to;

        if (_from != address(0)) {
            ownershipDinosaurCount[_from]--;

            delete dinosaurIndexToApproved[_tokenId];
            delete sireAllowedToAddress[_tokenId];
        }

        // 激发一个事件
        emit Transfer(_from, _to, _tokenId);
    }

    /// 创建一个恐龙蛋，返回恐龙蛋的ID
    /// @param _kind index (4 bits) + hideOrShow (1 bit)。 index: 1, 霸王龙; 2, 翼龙; 3, 剑龙; 4, 甲龙
    function _createEgg(uint256 _kind,
                        uint256 _motherId,
                        uint256 _fatherId,
                        uint256 _generation,
                        uint256 _genesF,
                        uint256 _genesM,
                        uint256 _hatchCDIndex,
                        address _owner) internal returns (uint256)
    {
        require(_motherId <= MAX_IDS);
        require(_fatherId <= MAX_IDS);
        require(_generation <= MAX_GENERATION);

        DNSRToken memory _dnsrToken = DNSRToken({
            kind: uint16(_kind),
            motherId: uint32(_motherId),
            fatherId: uint32(_fatherId),
            generation: uint16(_generation),
            phase: EGG_PHASE
        });

        uint256 _newTokenId = dnsrToken.push(_dnsrToken) - 1;
        require(_newTokenId <= MAX_IDS);


        DinosaurEgg memory _egg = DinosaurEgg({
            birthTime: uint64(now),
            hatchEndTime: 0,
            hatchCDIndex: unit_test ? 0 : uint16(_hatchCDIndex),
            genesF: _genesF,
            genesM: _genesM
        });

        eggs[_newTokenId] = _egg;

        // 指定主人
        _transfer(0, _owner, _newTokenId);

        // 激发恐龙蛋出生事件
        emit EggBirth(_owner, _newTokenId, uint256(_motherId), uint256(_fatherId), _egg.genesF, _egg.genesM);

        return _newTokenId;
    }

    // 创建一头恐龙，返回恐龙的ID
    /// @param _attr 恐龙的属性，现在只有愉悦度
    function _hatched(uint256 _eggId, uint256 _attr, uint256 _seekingCDIndex, uint256 _breedingCDIndex) internal {
        DNSRToken storage _dnsrToken = dnsrToken[_eggId];
        require(_dnsrToken.phase == EGG_PHASE);

        // 获得对应的恐龙蛋

        _dnsrToken.phase             = DINOSAUR_PHASE;

        // TODO: generate attributes from genes
        // DinosaurEgg storage _egg = eggs[_eggId];

        Dinosaur memory _dinosaur = Dinosaur({
            birthTime         : uint64(now),
            seekingCDEndTime  : 0,
            breedingCDEndTime : 0,
            seekingCDIndex    : unit_test ? 0 : uint16(_seekingCDIndex),
            breedingCDIndex   : unit_test ? 0 : uint16(_breedingCDIndex),
            siringWithId      : 0,
            attributes        : _attr
        });

        // 把出生的恐龙加入已孵化列表，并移除恐龙蛋
        dinosaurs[_eggId] = _dinosaur;
        // delete eggs[_eggId];

        address _owner = dinosaurIndexToOwner[_eggId];

        // 激发恐龙出生事件
        emit DinosaurHatched(_owner, _eggId);
    }

    // 如果不是在拍卖、生育、探索，则是空闲的
    function _isDinosaurInFree (uint256 _id) internal view returns(bool) {
        Dinosaur memory _dinosaur = dinosaurs[_id];

        if (_dinosaur.siringWithId > 0) {
            return false;
        }

        if (seekingIndexToOwner[_id] > 0) {
            return false;
        }

        // TODO: 检查是否在拍卖中，暂时不必要实现

        return true;
    }

    // function _getDinosaurSate (uint256 _id) returns(bool res) internal {

    // }



    // 用于unit test的时候修改CD
    function changeCooldownIndexForTesting (uint256 _index, uint256 _value) public onlyCTO {
        cooldowns[_index] = uint32(_value);
        enableUnitTest(true);
    }

}
