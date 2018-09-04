pragma solidity ^0.4.18;

import "./Auction.sol";
import "./DinosaurSeeking.sol";
import "./EggNFT.sol";


// 游戏主合约

contract Jurassic is Auction, DinosaurSeeking {
    // 用于确保是正确的合约被设置了
    bool public constant IS_JURASSIC = true;

    function Jurassic() public {

        // 每次部署合约，创造一个0代恐龙蛋
        if (dnsrToken.length == 0) {
            _createEgg(0, 0, 0, 0, uint256(-1), uint256(-1), 0, address(0));
        }
    }

    function () external payable {
        require(msg.sender == address(saleDutchAuction) ||
                msg.sender == address(siringDutchAuction));
    }


    /** 获得信息 **/

    function getDNSRToken (uint256 _id) public view returns(
        uint256 kind,
        uint256 motherId,
        uint256 fatherId,
        uint256 generation,
        uint256 phase
    ) {
        DNSRToken storage _dnsrToken = dnsrToken[_id];

        kind         = _dnsrToken.kind;

        motherId          = _dnsrToken.motherId;
        fatherId          = _dnsrToken.fatherId;

        generation        = _dnsrToken.generation;
        phase             = _dnsrToken.phase;
    }

    function getEgg (uint256 _id) public view returns(
        uint256 birthTime,
        uint256 hatchEndTime,
        uint256 hatchCDIndex,
        uint256 genesF,
        uint256 genesM
    ) {
        DinosaurEgg storage _egg = eggs[_id];

        birthTime    = _egg.birthTime;

        hatchEndTime = _egg.hatchEndTime;
        hatchCDIndex = _egg.hatchCDIndex;

        genesF       = _egg.genesF;
        genesM       = _egg.genesM;
    }



    function getDinosaur(uint256 _id) public view returns(
        uint256 birthTime,
        uint256 seekingCDEndTime,
        uint256 breedingCDEndTime,
        uint256 seekingCDIndex,
        uint256 breedingCDIndex,
        uint256 siringWithId,
        uint256 attributes
    ) {
        Dinosaur storage _dinosaur = dinosaurs[_id];
        // require(_dinosaur != 0);
        birthTime         = _dinosaur.birthTime;
        seekingCDEndTime  = _dinosaur.seekingCDEndTime;
        breedingCDEndTime = _dinosaur.breedingCDEndTime;
        seekingCDIndex    = _dinosaur.seekingCDIndex;
        breedingCDIndex   = _dinosaur.breedingCDIndex;

        siringWithId      = _dinosaur.siringWithId;

        attributes        = _dinosaur.attributes;
    }

    /** 控制繁衍 **/

    function startHatchingEgg(uint256 _id) public whenNotPaused {
        require(dinosaurIndexToOwner[_id] == msg.sender);

        DNSRToken storage _dnsrToken = dnsrToken[_id];
        require(_dnsrToken.phase == EGG_PHASE);

        address _own = msg.sender;

        uint64 hatchEndTime = _startHatchingEgg(_id);

        // 发送一个事件
        HatchingEgg(_own, _id, hatchEndTime);
    }

    // // 允许 _addr 地址的恐龙对你的 _fatherId 的恐龙进行繁殖
    // function approveSiring (address _addr, uint256 _fatherId) public whenNotPaused {
    //     require(_owns(msg.sender, _fatherId));

    //     _approveSiring(_addr, _fatherId);
    // }

    function canBreedWith (uint256 _motherId, uint256 _fatherId) public view returns(bool) {
        require(_motherId > 0);
        require(_fatherId > 0);

        return _canBreedWith(_motherId, _fatherId);
    }

    function breedWith(uint256 _motherId, uint256 _fatherId) public whenNotPaused {
        require(_owns(msg.sender, _motherId));

        if (canBreedWith(_motherId, _fatherId)) {
            _breedWith(_motherId, _fatherId);
        }
    }

    // 恐龙准备下蛋了
    // 只要愿意支付gas，任何人都可以调用这个接口
    function tryToLayTheEgg(uint256 _motherId) public whenNotPaused {
        DNSRToken storage _motherToken = dnsrToken[_motherId];

        // 检查确定是否可以下蛋
        if (isEggReadyToLay(_motherId)) {

            Dinosaur storage _motherDinosaur = dinosaurs[_motherId];

            uint256 _fatherId = _motherDinosaur.siringWithId;
            require(_fatherId != 0);

            DNSRToken storage _fatherToken = dnsrToken[_fatherId];

            uint16 generation = uint16(max(_motherToken.generation, _fatherToken.generation));
            generation++;

            // TODO: packing the genes

            DinosaurEgg storage _eggM = eggs[_motherId];
            DinosaurEgg storage _eggF = eggs[_fatherId];

            var (_genesF, _genesM, _hatchCDIndex) = geneticAlgorithm.inheritedGenes(_eggM.genesF, _eggM.genesM, _eggF.genesF, _eggF.genesM);

            address _owner = dinosaurIndexToOwner[_motherId];

            uint256 kind = geneticAlgorithm.buildKind(_motherToken.kind, _fatherToken.kind);
            _createEgg(kind, _motherId, _fatherId, generation, _genesF, _genesM, _hatchCDIndex, _owner);

            _motherDinosaur.siringWithId = 0;
            // _motherDinosaur.breedingCDEndTime = 0;
//
            // Dinosaur storage _fatherDinosaur = dinosaurs[_fatherId];
            // _fatherDinosaur.breedingCDEndTime = 0;
        }
    }

    function tryToBirthFromEgg (uint256 _eggId) public whenNotPaused {
        if (isDinosaurReadyToHatched(_eggId)) {
            DNSRToken storage _dnsrToken = dnsrToken[_eggId];

            DNSRToken storage _dnsrTokenF = dnsrToken[_dnsrToken.fatherId];
            DNSRToken storage _dnsrTokenM = dnsrToken[_dnsrToken.motherId];

            uint256 _breedingCDIndex = geneticAlgorithm.calcBreedingIndex(_dnsrTokenF.generation, _dnsrTokenM.generation, COOLDOWN_TABLE_SIZE - 1);
            _hatched(_eggId, MAX_PLEASURE, SEEKING_CD_INDEX, _breedingCDIndex);
        }
    }

    // 检查是否要孵出来了
    function isDinosaurReadyToHatched(uint256 _id) public view returns (bool) {
        if (_getDinosaurPhase(_id) != EGG_PHASE) {
            return false;
        }


        DinosaurEgg storage _egg = eggs[_id];

        return (_egg.hatchEndTime <= now);
    }

    // 检查是否要下蛋了
    // @_id 恐龙的ID
    function isEggReadyToLay(uint256 _id) public view returns (bool) {
        if (_getDinosaurPhase(_id) != DINOSAUR_PHASE) {
            return false;
        }

        Dinosaur storage _dinosaur = dinosaurs[_id];

        var layTime = cooldowns[_dinosaur.breedingCDIndex] * 2;
        return (layTime <= now);
    }

    /*** 外出探索 ***/
    // 检查函数不需要gas，需要客户端定时调用
    function isReadyForSeeking (uint256 _id) public view returns (bool) {
        if (_getDinosaurPhase(_id) != DINOSAUR_PHASE) {
            return false;
        }

        if (!_isDinosaurInFree(_id)) {
            return false;
        }

        Dinosaur memory _dinosaur = dinosaurs[_id];

        return (_dinosaur.seekingCDEndTime <= now &&
                seekingIndexToOwner[_id] == address(0));
    }

    function isReadyToBackHome (uint256 _id) public view returns (bool) {
        if (_getDinosaurPhase(_id) != DINOSAUR_PHASE) {
            return false;
        }

        Dinosaur memory _dinosaur = dinosaurs[_id];

        if (_dinosaur.seekingCDEndTime >= now) {
            // 搜索还没有结束
            return false;
        }

        if (seekingIndexToOwner[_id] == address(0)) {
            // 搜索还没有开始
            return false;
        }

        return true;
    }

    function seeking (uint256 _id) public payable whenNotPaused {
        require(_owns(msg.sender, _id));

        Dinosaur storage _dinosaur = dinosaurs[_id];

        uint256 tax = getSeekingTax();
        require(msg.value == tax);

        if (isReadyForSeeking(_id)) {

            seekingIndexToOwner[_id] = msg.sender;

            _startSeeking(_id);

            // < (MAX_PLEASURE - 2)，使用直接的数字据说能降低gas
            if ((_dinosaur.attributes & PLEASURE_MASK) < 8) {
                _dinosaur.attributes += 2;
            } else {
                _dinosaur.attributes = MAX_PLEASURE;
            }
        }
    }

    function getSeekingTax () public view returns (uint256) {
        uint256 avgPrice = saleDutchAuction.averageGen0SalePrice();
        if (avgPrice == 0) {
            avgPrice = 0.01 ether;
        }
        return avgPrice * seekingTax / 10000;
    }


    // 当探索时间到了后，玩家收到事件通知或者再次登录，客户端提示玩家收取上次探索获得的物品
    // 每次探索必须都有收获
    // 任何人愿意支付gas都可以调用
    function collectSeekingTrophies (uint256 _id) public whenNotPaused {
        require(_id <= MAX_IDS);

        if (isReadyToBackHome(_id)) {
            Dinosaur storage _dinosaur = dinosaurs[_id];

            _createTrophies(_id, _dinosaur.attributes);

            _dinosaur.seekingCDEndTime = 0;

            delete seekingIndexToOwner[_id];
        }
    }


    /*** FINANCE ***/

    // CFO 权限
    function withdrawBalance() external onlyCFO {
        cfoAddress.transfer(this.balance);
    }
}
