pragma solidity ^0.4.18;

import "./DinosaurBase.sol";
import "./ERC721Draft.sol";

contract EggNFT is DinosaurBase, ERC721 {

    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return (dinosaurIndexToOwner[_tokenId] == _claimant);
    }

    /**
     * implements functions of ERC721 interface
     */

    function implementsERC721() public pure returns (bool) {
        return true;
    }

    // ERC-20 Compatibility
    function name() public view returns (string) {
        return "CryptoDinosaur";
    }

    function symbol() public view returns (string) {
        return "DNSR";
    }

    function totalSupply() public view returns (uint256) {
        return (dnsrToken.length - 1);
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return ownershipDinosaurCount[_owner];
    }

    // Basic Ownership
    function ownerOf(uint256 _tokenId) public view returns (address owner) {
        address _owner = dinosaurIndexToOwner[_tokenId];

        require(_owner != address(0));

        owner = _owner;
    }

    // 授权某个地址作为代理方行使sender的权利
    function approve(address _to, uint256 _tokenId) public whenNotPaused {
        require(_owns(msg.sender, _tokenId));

        dinosaurIndexToApproved[_tokenId] = _to;

        emit Approval(msg.sender, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public whenNotPaused {
        // 检查发起人是否可以转移该恐龙蛋
        require(dinosaurIndexToApproved[_tokenId] == msg.sender);

        require(_owns(_from, _tokenId));

        _transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public whenNotPaused {
        require(_to != address(0));

        require(_owns(msg.sender, _tokenId));

        _transfer(msg.sender, _to, _tokenId);
    }

    // 自己列表中的index转换为全局列表中index
    // @_index owner列表中的索引，从0开始
    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256 tokenId) {
        uint256 count = 0;
        uint256 total = totalSupply();
        for (uint256 i = 1; i <= total; i++) {
            if (dinosaurIndexToOwner[i] == _owner) {
                if (count == _index) {
                    tokenId = i;
                    return i;
                } else {
                    count++;
                }
            }
        }

        revert();
    }
}
