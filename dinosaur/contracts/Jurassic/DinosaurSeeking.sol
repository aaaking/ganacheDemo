pragma solidity ^0.4.18;

import "../Activities/Minting.sol";

contract DinosaurSeeking is Minting {
    event StartSeeking(address indexed owner, uint256 dinosaurId);

    /// @param _categoryIndex     指明类型，比如恐龙，饰品。
    /// @param _kindIndex         获得的 _tokenId 是 _categoryIndex 下的哪一种代币
    ///                         比如获得的是恐龙，则指明恐龙的类型是霸王龙还是其他龙；如果是饰品，指明饰品的类型
    event TrophiesCollected(address owner, uint256 _tokenId, uint256 _kindIndex, uint256 _categoryIndex);

    // 探索手续费，万分之x
    uint256 public seekingTax = 20;

    // 设置探索手续费
    function setCut(uint256 _cut) public onlyCFO {
        require(_cut <= 1000);
        seekingTax = _cut;
    }

    function _triggerSeekingCooldown (Dinosaur storage _dinosaur) internal {
        _dinosaur.seekingCDEndTime = uint64(now + cooldowns[_dinosaur.seekingCDIndex]);

        // if (_dinosaur.seekingCDIndex < (COOLDOWN_TABLE_SIZE - 1)) {
        //     _dinosaur.seekingCDIndex += 1;
        // }
    }

    function _startSeeking (uint256 _id) internal {
        Dinosaur storage _dinosaur = dinosaurs[_id];
        _triggerSeekingCooldown(_dinosaur);

        address _owner = dinosaurIndexToOwner[_id];
        emit StartSeeking(_owner, _id);
    }

    // 创建战利品
    function _createTrophies (uint256 _id, uint256 _attr) internal {
        address _owner = dinosaurIndexToOwner[_id];

        // TODO: 物品获得算法(由属性和结束时间以及区块哈希决定)

        _attr = 1;

        uint256 _newEggId = _createGen0Egg(_owner);

        uint256 _kindIndex = 0;
        uint256 _categoryIndex = 0; // 0，恐龙；1，饰品

        emit TrophiesCollected(_owner, _newEggId, _kindIndex, _categoryIndex);
    }
}
