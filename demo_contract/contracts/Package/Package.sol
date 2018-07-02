pragma solidity ^0.4.21;

import "../Ctrlship/Ctrlable.sol";

contract Package is Ctrlable {
    //抽卡
    function drawCardWithIndex(uint index) external returns(uint32, uint32);

    function drawCardWithCate(uint32 cate) external returns(uint32);

    //包的类型
    function packageType() external view returns(uint);

    //包的阵营
    function packageCamp() external view returns(uint);

    //包里卡的种类数量
    function cardCateNum() external view returns(uint);

    //包里第pos张卡的索引
    function indexAtPos(uint pos) external view returns(uint);

    //根据卡的种类获取卡的索引
    function cardIndex(uint32 cate) public view returns(uint);

    //索引为index的卡的id
    function cardCate(uint index) public view returns(uint32);

    //索引为i的卡剩余的数量
    function cardRemainNum(uint index) public view returns(uint);

    //索引为i的卡已抽出来的数量
    function cardDrawedNum(uint index) public view returns(uint);

    //检查这类卡是否存在
    function exists(uint32 cate) public view returns(bool);

}