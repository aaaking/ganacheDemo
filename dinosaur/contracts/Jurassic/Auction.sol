pragma solidity ^0.4.18;

import "../Auction/SaleDutchAuction.sol";
import "../Auction/SiringDutchAuction.sol";
import "./DinosaurBreeding.sol";

contract Auction is DinosaurBreeding {
    SaleDutchAuction public saleDutchAuction;

    SiringDutchAuction public siringDutchAuction;

    // 设置合约地址的函数必须得由CTO直接调用，如果由其他合约调用会导致安全问题
    function setSaleAuctionAddress(address _addr) public onlyCTO {
        SaleDutchAuction candidateContract = SaleDutchAuction(_addr);
        require(candidateContract.IS_SALEDUTCHAUCTION());
        saleDutchAuction = candidateContract;
    }

    function setSiringAuctionAddress(address _addr) public onlyCTO {
        SiringDutchAuction candidateContract = SiringDutchAuction(_addr);
        require(candidateContract.IS_SIRINGDUTCHAUCTION());
        siringDutchAuction = candidateContract;
    }

    function createSaleAuction(uint256 _tokenId,
                               uint256 _startingPrice,
                               uint256 _endingPrice,
                               uint256 _duration) public whenNotPaused {

        require(_owns(msg.sender, _tokenId));

        require (_isDinosaurInFree(_tokenId));

        address owner = dinosaurIndexToOwner[_tokenId];
        // require(msg.sender == owner);

        dinosaurIndexToApproved[_tokenId] = address(saleDutchAuction);

        saleDutchAuction.createAuction(_tokenId, _startingPrice, _endingPrice, _duration, owner);
    }


    // 后台调用，创建0代恐龙蛋以及拍卖合约
    function createGen0SaleAuction (uint256 _startingPrice,
                                    uint256 _endingPrice,
                                    uint256 _duration) public onlyCOO whenNotPaused {
        uint256 _newId = _createGen0Egg(address(this));

        dinosaurIndexToApproved[_newId] = address(saleDutchAuction);

        saleDutchAuction.createAuction(_newId, _startingPrice, _endingPrice, _duration, address(this));
    }

    function createSiringAuction (uint256 _tokenId,
                                  uint256 _startingPrice,
                                  uint256 _endingPrice,
                                  uint256 _duration) public whenNotPaused {

        address owner = dinosaurIndexToOwner[_tokenId];
        require(msg.sender == owner);

        require(_isReadyToBreed(_tokenId));

        dinosaurIndexToApproved[_tokenId] = address(siringDutchAuction);

        siringDutchAuction.createAuction(_tokenId, _startingPrice, _endingPrice, _duration, owner);
    }

    // 发起者为 _motherId; 合约上的是 _fatherId
    function bidOnSiringAuction (uint256 _motherId, uint256 _fatherId) public payable whenNotPaused {
        require(_owns(msg.sender, _motherId));

        uint256 price = siringDutchAuction.getCurrentPrice(_fatherId);
        uint256 bidAmount = msg.value;

        require(bidAmount >= price);

        // 通过modifier把bitAmount和函数调用一起发给合约
        siringDutchAuction.bid.value(bidAmount)(_fatherId);

        _approveSiring(msg.sender, _fatherId);

        if (_canBreedWith(_motherId, _fatherId)) {
            _breedWith(_motherId, _fatherId);
        }
    }


}
