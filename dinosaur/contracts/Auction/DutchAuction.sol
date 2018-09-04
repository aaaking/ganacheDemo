pragma solidity ^0.4.18;

import "./AuctionBase.sol";

// 荷兰式减价拍卖

contract DutchAuction is AuctionBase {

    // 设置拍卖手续费
    function setCut(uint256 _cut) public onlyCFO {
        require(_cut <= 1000);
        ownerCut = _cut;
    }

    // 由游戏合约发起调用
    function createAuction(uint256 _tokenId,
                           uint256 _startingPrice,
                           uint256 _endingPrice,
                           uint256 _duration,
                           address _seller
                           ) 
        public 
        canBeStoredWith128Bits(_startingPrice)
        canBeStoredWith128Bits(_endingPrice)
        canBeStoredWith64Bits(_duration)
    {

        require(msg.sender == address(nftEggContract));
        require(_startingPrice > _endingPrice);
        require(_duration >= 1 minutes);

        // 把token授权给拍卖合约
        nftEggContract.transferFrom(_seller, address(this), _tokenId);


        Auction memory auction = Auction(_seller,
                                         uint128(_startingPrice),
                                         uint128(_endingPrice),
                                         uint64(_duration),
                                         uint64(now)
                                         );

        _addAuction(_tokenId, auction);
    }

    function cancelAuction(uint256 _tokenId) public {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));

        require(msg.sender == auction.seller);

        // 把之前卖家授权给合约的token还给卖家
        nftEggContract.transfer(auction.seller, _tokenId);

        _cancelAuction(_tokenId, auction.seller);
    }


    function getAuction(uint256 _tokenId) public view returns (address seller,
                                                               uint256 startingPrice,
                                                               uint256 endingPrice,
                                                               uint256 duration,                                                               
                                                               uint256 startAt) {
        Auction storage auction = tokenIdToAuction[_tokenId];

        seller        = auction.seller;
        startingPrice = auction.startingPrice;
        endingPrice   = auction.endingPrice;
        duration      = auction.duration;
        startAt       = auction.startedAt;
    }

    function getCurrentPrice(uint256 _tokenId) public view returns (uint256) {
        Auction storage auction = tokenIdToAuction[_tokenId];
        require(_isOnAuction(auction));

        return _currentPrice(auction);
    }
}
