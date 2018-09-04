pragma solidity ^0.4.18;

import "./DutchAuction.sol";

contract SiringDutchAuction is DutchAuction {
    bool public constant IS_SIRINGDUTCHAUCTION = true;

    // 设置合约地址的函数一定要控制权限，这里不能单独允许外部设置
    function setNFTEggContract(address _address) public onlyCTO {
        ERC721 candidateContract = ERC721(_address);
        require(candidateContract.implementsERC721());

        nftEggContract = candidateContract;
    }

    // 必须由Jurassic调用，那边还需要处理其他的事情
    function bid(uint256 _tokenId) public payable {

        require(msg.sender == address(nftEggContract));

        address _seller = tokenIdToAuction[_tokenId].seller;

        _bid(_tokenId, msg.value);

        // 拍卖生育权结束后，token还是要还给卖家
        nftEggContract.transfer(_seller, _tokenId);
    }

    function withdrawBalance() external onlyCFO {
        address nftAddress = address(nftEggContract);

        nftAddress.transfer(this.balance);
    }
}
