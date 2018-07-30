pragma solidity ^0.4.21;

import '../ERC/ERC721Receiver.sol';
import '../Ctrlship/Pausable.sol';
import '../ERC/ERC721.sol';
import '../CardChecker.sol';
import '../libs/Utils.sol';

contract BuyAgent is ERC721Receiver, Pausable {

    event MakeOrder(address _from, uint _order, uint _price, uint _tokenCate);
    event TakeOrder(address _to, uint _order, uint _fund);
    event CancelOrder(address _exc, uint _order);
    event WithDrawToken(address _to, uint _token);

    struct Order {
        uint id;
        uint token;
        uint price;
        address buyer;
    }

    ERC721 nftContract;

    CardChecker checker;

    Order[] orders;

    mapping (uint => uint) public orderIdToIndex;
    uint idCounter = 0;

    mapping (uint => address) public withdrawTokenOwner;

    //交易费率精度
    uint constant ACC = 1000;
    //交易费率 千分之
    uint sellRate = 100;

    function totalSupply() public view returns (uint) {
        return orders.length;
    }

    function orderByIndex(uint _index) public view returns (uint id, uint token, uint price, address buyer) {
        require(_index < orders.length);

        Order storage o = orders[_index];
        id = o.id;
        token = o.token;
        price = o.price;
        buyer = o.buyer;
    }

    function setNftContractAddress(address _addr) external onlyOwner {
        require(_addr != address(0));
        nftContract = ERC721(_addr);
    }

    function setCardCheckerAddress(address _addr) external onlyOwner {
        require(_addr != address(0));
        checker = CardChecker(_addr);
    }

    function onERC721Received(address _from, uint256 _tokenId, bytes _data) public whenNotPaused returns(bytes4) {
        require(msg.sender == address(nftContract));
        require(_from != address(0));
        uint orderId = Utils.bytesToUint(_data);

        _takeOrder(_from, orderId, _tokenId);
        
        return ERC721_RECEIVED;
    }

    function makeOrder(uint32 _tokenCate) external payable whenNotPaused {
        require(msg.value > ACC);
        require(checker.existsOfCardCate(_tokenCate));

        _makeOrder(msg.sender, _tokenCate, msg.value);
    }

    function _makeOrder(address _from, uint _tokenCate, uint _price) internal {
        idCounter++;
        Order memory o = Order(idCounter, _tokenCate, _price, _from);

        orders.push(o);
        orderIdToIndex[idCounter] = orders.length - 1;

        emit MakeOrder(_from, idCounter, _price, _tokenCate);
    }

    function _takeOrder(address _to, uint _orderId, uint _tokenId) internal {
        uint32 tokenCate = uint32(_tokenId >> 32);
        require(tokenCate > 0);
        
        Order storage o = orders[orderIdToIndex[_orderId]];
        address buyer = o.buyer;
        uint price = o.price;

        require(tokenCate == o.token);

        _removeOrder(_orderId);
        withdrawTokenOwner[_tokenId] = buyer;

        uint fund = price / ACC * (ACC - sellRate);
        _transferEth(_to, fund);

        emit TakeOrder(_to, _orderId, fund);
    }

    function cancelOrder(uint _orderId) external whenNotPaused {

        Order storage o = orders[orderIdToIndex[_orderId]];
        uint price = o.price;

        require(o.buyer == msg.sender);

        _removeOrder(_orderId);
        _transferEth(msg.sender, price);

        emit CancelOrder(msg.sender, _orderId);
    }

    function cancelOrderByOwner(uint _orderId) external onlyOwner {
        Order storage o = orders[orderIdToIndex[_orderId]];
        address buyer = o.buyer;
        uint price = o.price;

        _removeOrder(_orderId);
        _transferEth(buyer, price);

        emit CancelOrder(msg.sender, _orderId);
    }

    function _transferEth(address _to, uint value) internal {
        _to.transfer(value);
    }

    function withdrawToken(uint _token) external {
        require(withdrawTokenOwner[_token] == msg.sender);

        delete withdrawTokenOwner[_token];
        _transferToken(msg.sender, _token);
        emit WithDrawToken(msg.sender, _token);
    }

    function _removeOrder(uint _orderId) internal {
        require(_exists(_orderId));

        uint index = orderIdToIndex[_orderId];
        require(orders.length > index);

        uint lastIndex = orders.length - 1;
        Order storage lastOrder = orders[lastIndex];

        delete orders[index];
        delete orderIdToIndex[_orderId];

        orders[index] = lastOrder;
        orderIdToIndex[lastOrder.id] = index;

        orders.length--;
    }

    function _transferToken(address _to, uint _tokenId) internal {
        nftContract.safeTransferFrom(address(this), _to, _tokenId, "");
    }

    function _exists(uint _orderId) internal view returns(bool) {
        uint i = orderIdToIndex[_orderId];
        return _orderId == orders[i].id;
    }
    
}