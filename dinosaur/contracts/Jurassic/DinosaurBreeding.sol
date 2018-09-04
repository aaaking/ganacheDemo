pragma solidity ^0.4.18;

import "./DinosaurBase.sol";
import "../Activities/Minting.sol";

// 处理下蛋、孵蛋、恐龙出生等繁衍相关的事情

contract DinosaurBreeding is Minting {
    event HatchingEgg(address owner, uint256 indexed id, uint256 endTime);
    event Pregnant(address owner, uint256 motherId, uint256 fatherId);

    // 开始孵蛋
    function _startHatchingEgg(uint256 _id) internal returns (uint64) {
        DinosaurEgg storage _egg = eggs[_id];

        _egg.hatchEndTime = uint64(now + cooldowns[_egg.hatchCDIndex]);

        return _egg.hatchEndTime;
    }

    function _triggerBreedingCooldown (Dinosaur storage _dinosaur) private {
        _dinosaur.breedingCDEndTime = uint64(now + cooldowns[_dinosaur.breedingCDIndex]);

        if (_dinosaur.breedingCDIndex < (COOLDOWN_TABLE_SIZE - 1)) {
            _dinosaur.breedingCDIndex += 1;
        }
    }

    function _isReadyToBreed (uint256 _id) internal view returns(bool) {
        Dinosaur memory _dinosaur = dinosaurs[_id];

        require (_isDinosaurInFree(_id));

        require(_dinosaur.seekingCDEndTime < now);
        require(_dinosaur.breedingCDEndTime < now);
        require(_dinosaur.siringWithId == 0);

        return true;
    }

    function _canBreedWith (uint256 _motherId, uint256 _fatherId) internal view returns(bool) {
        require(_motherId != _fatherId);

        require(_isReadyToBreed(_motherId));
        require(_isReadyToBreed(_fatherId));

        address motherOwner = dinosaurIndexToOwner[_motherId];
        address fatherOwner = dinosaurIndexToOwner[_fatherId];

        return (motherOwner == fatherOwner || sireAllowedToAddress[_fatherId] == motherOwner);
    }

    // 请求者作为雌性，被请求者作为雄性
    // 近亲繁殖将会大概率的降低蛋的基因，但也有极小概率获得某一方面基因向上的突变
    function _breedWith(uint256 _motherId, uint256 _fatherId) internal {
        Dinosaur storage _dinosaurM = dinosaurs[_motherId];
        Dinosaur storage _dinosaurF = dinosaurs[_fatherId];

        require((_dinosaurM.attributes & PLEASURE_MASK) >= 4);

        _dinosaurM.siringWithId = uint32(_fatherId);

        // 设定冷却时间
        _triggerBreedingCooldown(_dinosaurM);
        _triggerBreedingCooldown(_dinosaurF);

        // TODO: genes

        delete sireAllowedToAddress[_motherId];
        delete sireAllowedToAddress[_fatherId];

        if ((_dinosaurF.attributes & PLEASURE_MASK) < 10) {
            _dinosaurF.attributes += 1;
        }

        _dinosaurM.attributes -= 4;

        Pregnant(dinosaurIndexToOwner[_motherId], _motherId, _fatherId);
    }

    // 允许 _addr 地址的恐龙 (_motherId) 对你的 _fatherId 的恐龙进行繁殖
    function _approveSiring (address _addr, uint256 _fatherId) internal {

        sireAllowedToAddress[_fatherId] = _addr;
    }


}
