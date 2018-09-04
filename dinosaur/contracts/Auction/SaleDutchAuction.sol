pragma solidity ^0.4.18;

import "./DutchAuction.sol";

contract SaleDutchAuction is DutchAuction {
    bool public constant IS_SALEDUTCHAUCTION = true;

    // 记录最后5个0代蛋的价格
    uint256 public gen0SaleCount;
    uint256[5] public lastGen0SalePrices;

    // 设置合约地址的函数一定要控制权限，这里不能单独允许外部设置
    function setNFTEggContract(address _address) public onlyCTO {
        ERC721 candidateContract = ERC721(_address);
        require(candidateContract.implementsERC721());

        nftEggContract = candidateContract;
    }

    function bid(uint256 _tokenId) public payable {
        address seller = tokenIdToAuction[_tokenId].seller;

        uint256 price = _bid(_tokenId, msg.value);

        nftEggContract.transfer(msg.sender, _tokenId);

        if (seller == address(nftEggContract)) {
            lastGen0SalePrices[gen0SaleCount % 5] = price;
            gen0SaleCount++;
        }
    }
    
    function averageGen0SalePrice() public view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < 5; i++) {
            sum += lastGen0SalePrices[i];
        }
        return sum / 5;
    }

    function withdrawBalance() external onlyCFO {
        address nftAddress = address(nftEggContract);

        nftAddress.transfer(this.balance);
    }
}
