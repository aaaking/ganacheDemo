pragma solidity ^0.4.18;

import "../Jurassic/ERC721Draft.sol";
import "../ControlCenter.sol";

contract AuctionBase is ControlCenter {
    event AuctionCreated(uint256 tokenId, uint256 startingPrice, uint256 endingPrice, uint256 duration);
    event AuctionSuccessful(uint256 tokenId, uint256 totalPrice, address winner);
    event AuctionCancelled(uint256 tokenId);

    struct Auction {
        address seller;
        // in wei
        uint128 startingPrice;
        // in wei
        uint128 endingPrice;
        // in seconds
        uint64 duration;
        // 这笔拍卖开始的时间，如果是0意味着已经结束
        uint64 startedAt;
    }

    // 拍卖手续费，万分之x
    uint256 public ownerCut = 20;

    // 记录正在拍卖的token和对应的拍卖对象
    mapping (uint256 => Auction) tokenIdToAuction;

    ERC721 public nftEggContract;


    modifier canBeStoredWith64Bits(uint256 _value) {
        require(_value <= 18446744073709551615);
        _;
    }

    modifier canBeStoredWith128Bits(uint256 _value) {
        require(_value < 340282366920938463463374607431768211455);
        _;
    }    

    function _addAuction(uint256 _tokenId, Auction _auction) internal {
        require(_auction.duration >= 1 minutes);

        tokenIdToAuction[_tokenId] = _auction;

        logstring("AuctionCreated event");

        emit AuctionCreated(uint256(_tokenId),
                       uint256(_auction.startingPrice),
                       uint256(_auction.endingPrice),
                       uint256(_auction.duration));

    }

    function _cancelAuction(uint256 _tokenId, address _seller) internal {
        require(msg.sender == _seller);

        delete tokenIdToAuction[_tokenId];

        emit AuctionCancelled(_tokenId);
    }


    function _bid(uint256 _tokenId, uint256 _bidAmount) internal returns (uint256) {
        Auction storage auction = tokenIdToAuction[_tokenId];

        require(_isOnAuction(auction));

        uint256 price = _currentPrice(auction);
        require(_bidAmount >= price);

        address seller = auction.seller;

        delete tokenIdToAuction[_tokenId];

        // 扣除手续费如果还有剩，则还给玩家
        if (price > 0) {
            uint256 auctioneerCut = _cut(price);
            uint256 sellerReturn = price - auctioneerCut;

            seller.transfer(sellerReturn);
        }

        emit AuctionSuccessful(_tokenId, price, msg.sender);

        return price;
    }

    function _isOnAuction(Auction storage _auction) internal view returns (bool) {
        return (_auction.startedAt > 0);
    }

    function _currentPrice(Auction storage _auction) internal view returns (uint256) {
        uint256 secondsPassed = 0;

        if (now > _auction.startedAt) {
            secondsPassed = now - _auction.startedAt;
        }

        if (secondsPassed >= _auction.duration) {
            return _auction.endingPrice;
        } else {
            int256 totalPriceChange = int256(_auction.endingPrice) - int256(_auction.startingPrice);
            int256 currentPriceChange = totalPriceChange * int256(secondsPassed) / int256(_auction.duration);

            return uint256(int256(_auction.startingPrice + currentPriceChange));
        }
    }

    function _cut(uint256 _price) internal view returns (uint256) {
        return _price * ownerCut / 10000;
    }

}
