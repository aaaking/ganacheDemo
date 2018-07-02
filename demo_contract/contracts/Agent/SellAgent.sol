pragma solidity ^0.4.21;

import '../ERC/ERC721Receiver.sol';
import '../Ctrlship/Pausable.sol';
import '../ERC/ERC721.sol';
import '../libs/Utils.sol';

contract SellAgent is ERC721Receiver, Pausable {
    event MakeOrder(address _from, uint _token, uint _price);
    event TakeOrder(address _to, uint _token);
    event CancelOrder(uint _token, address exc);
    event WithDraw(address _to, uint _fund);

    struct Order {
        address saler;
        uint token;
        uint price;
    }

    ERC721 nftContract;

    mapping (uint => Order) orderOfToken;

    mapping (address => uint) public withdrawFund;

    //交易费率精度
    uint constant ACC = 1000;
    //交易费率 千分之
    uint sellRate = 100;

    function orderByToken(uint _tokenId) external view returns(address saler, uint token, uint price) {
        require(_exists(_tokenId));
        Order storage o = orderOfToken[_tokenId];

        saler = o.saler;
        token = o.token;
        price = o.price;
    }

    function onERC721Received(address _from, uint256 _tokenId, bytes _data) public whenNotPaused returns(bytes4) {
        require(msg.sender == address(nftContract));
        uint price = Utils.bytesToUint(_data);
        require(price > 1000);
        _makeOrder(_from, _tokenId, price);

        return ERC721_RECEIVED;
    }

    function setNftContractAddress(address _addr) external onlyOwner {
        nftContract = ERC721(_addr);
    }


    function _makeOrder(address _from, uint _tokenId, uint _price) internal {
        Order memory o = Order(_from, _tokenId, _price);

        orderOfToken[_tokenId] = o;
        emit MakeOrder(_from, _tokenId, _price);
    }

    function takeOrder(uint _tokenId) external payable whenNotPaused {
        Order storage o = orderOfToken[_tokenId];
        uint price = o.price;
        address saler = o.saler;

        require(msg.value >= price);

        _removeOrder(_tokenId);
        _transferToken(msg.sender, _tokenId);

        withdrawFund[saler] += (price / ACC * (ACC - sellRate));
        emit TakeOrder(msg.sender, _tokenId);
    }

    function withdraw() external whenNotPaused {
        uint fund = withdrawFund[msg.sender];
        require(fund > 0);
        withdrawFund[msg.sender] = 0;
        
        msg.sender.transfer(fund);
        emit WithDraw(msg.sender, fund);
    }

    function cancelOrder(uint _tokenId) external whenNotPaused {
        Order storage o = orderOfToken[_tokenId];
        require(o.saler == msg.sender);

        _removeOrder(_tokenId);
        _transferToken(msg.sender, _tokenId);
        emit CancelOrder(_tokenId, msg.sender);
    }

    function cancelOrderByOwner(uint _tokenId) external onlyOwner {
        Order storage o = orderOfToken[_tokenId];
        address saler = o.saler;

        _removeOrder(_tokenId);
        _transferToken(saler, _tokenId);
        emit CancelOrder(_tokenId, msg.sender);
    }

    function _removeOrder(uint _tokenId) internal {
        require(_exists(_tokenId));

        delete orderOfToken[_tokenId];
    }

    function _transferToken(address _to, uint _tokenId) internal {
        nftContract.safeTransferFrom(address(this), _to, _tokenId, "");
    }

    function _exists(uint _tokenId) internal view returns(bool) {
        return (_tokenId > 0) && (_tokenId == orderOfToken[_tokenId].token);
    }

}