pragma solidity ^0.4.21;

import "./CompPackage.sol";
import "./WeiPackage.sol";

contract BasicComp1 is CompPackage, WeiPackage {
    uint32 public constant CARD_CATE = 64;     //合成卡的数量

    uint32[CARD_CATE] internal _cardCates = [50111, 50112, 50113, 50114, 50115, 50116, 50117, 50118, 60101, 60102, 60103, 60104, 60105, 60106, 60107, 60108, 60111, 60113, 60115, 60117, 70101, 70102, 70103, 70104, 70105, 70106, 70107, 70108, 70111, 70113, 70115, 70117, 80101, 80102, 80103, 80104, 80105, 80106, 80107, 80108, 80111, 80113, 80115, 80117, 90101, 90102, 90103, 90104, 90105, 90106, 90107, 90108, 90111, 90113, 90115, 90117, 100101, 100102, 100103, 100104, 100105, 100106, 100107, 100108];
    uint32[CARD_CATE] internal _cardsCnt = [62, 62, 62, 62, 62, 62, 62, 62, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    //包里每张卡已卖出的数量
    uint32[CARD_CATE] internal _cardsNum;

    mapping (uint32 => uint32) internal _cardCateToIndex;

    function BasicComp1 () public
    {
        
        for(uint32 i = 0; i < CARD_CATE; i++) {

            _cardCateToIndex[_cardCates[i]] = i;
        }
    }

    //抽卡
    function drawCardWithIndex(uint index) external onlyCtrl returns(uint32, uint32) {
        require(index < _cardsCnt.length);
        require(_cardsCnt[index] > 0);

        _drawCard(index);

        return (_cardCates[index], _cardsNum[index]);
    }

    function drawCardWithCate(uint32 cate) external onlyCtrl returns(uint32) {
        require(exists(cate));

        uint index = _cardCateToIndex[cate];

        require(_cardsCnt[index] > 0);
        _drawCard(index);

        return _cardsNum[index];
    } 

    //包里卡的种类数量
    function cardCateNum() external view returns(uint) {
        return CARD_CATE;
    }

    //包里第pos张卡的索引
    function indexAtPos(uint pos) external view returns(uint) {
        uint cnt = pos;
        for(uint i = 0; i < CARD_CATE; i++) {
            if(cnt < _cardsCnt[i]) {
                return i;
            } else {
                cnt -= _cardsCnt[i];
            }
        }

        return CARD_CATE;
    }

    //根据卡的id获取卡的索引
    function cardIndex(uint32 cate) public view returns(uint) {
        require(exists(cate));
        return _cardCateToIndex[cate];
    }

    //索引为index的卡的id
    function cardCate(uint index) public view returns(uint32) {
        require(index < _cardCates.length);
        return _cardCates[index];
    }

    //索引为i的卡剩余的数量
    function cardRemainNum(uint index) public view returns(uint) {
        require(index < _cardsCnt.length);
        return _cardsCnt[index];
    }

    //索引为i的卡已抽出来的数量
    function cardDrawedNum(uint index) public view returns(uint) {
        require(index < _cardsNum.length);
        return _cardsNum[index];
    }

    function _drawCard(uint index) internal {
        _cardsCnt[index]--;
        _cardsNum[index]++;
    }

    function exists(uint32 cate) public view returns(bool) {
        if (cate > 0) {
            uint index = _cardCateToIndex[cate];
            return _cardCates[index] == cate;
        } else {
            return false;
        }
    }
}