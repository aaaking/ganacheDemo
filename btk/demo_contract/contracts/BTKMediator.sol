pragma solidity ^0.4.21;

import './Ctrlship/Ownable.sol';
import './CardChecker.sol';
import './BTKMergeCtrl.sol';
import './BTKSourceCtrl.sol';
import './CardOwnership.sol';

contract BTKMediator is CardChecker, Ownable {
    BTKMergeCtrl public mergeCtrl;
    BTKSourceCtrl public sourceCtrl;
    CardOwnership public wallet;

    function existsOfCardCate(uint32 cate) public view returns (bool) {
        if (sourceCtrl.existsOfCardCate(cate)) {
            return true;
        } else if (mergeCtrl.existsOfCardCate(cate)) {
            return true;
        } else {
            return false;
        }
    }

    function mint(address _to, uint _tokenId) external {
        require(msg.sender == address(mergeCtrl) || msg.sender == address(sourceCtrl));
        wallet.mint(_to, _tokenId); 
    }

    function burn(address _owner, uint _tokenId) external {
        require(msg.sender == address(mergeCtrl));
        wallet.burn(_owner, _tokenId);
    }

    function setMergeCtrl(BTKMergeCtrl _merge) external onlyOwner {
        mergeCtrl = _merge;
    }

    function setSourceCtrl(BTKSourceCtrl _source) external onlyOwner {
        sourceCtrl = _source;
    }

    function setCardOwnership(CardOwnership _ownership) external onlyOwner {
        wallet = _ownership;
    }
}