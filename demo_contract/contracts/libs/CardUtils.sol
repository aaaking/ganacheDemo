pragma solidity ^0.4.21;

library CardUtils {
    function toCate(uint64 token) internal pure returns(uint32) {
        return uint32(token >> 32);
    }

    function toToken(uint32 cate, uint32 num) internal pure returns(uint64) {
        return (uint64(cate) << 32) + num;
    }

    function packageNum(uint32 cate) internal pure returns(uint) {
        return cate / 1000000;
    }

    function star(uint32 cate) internal pure returns(uint) {
        return cate / 10000 % 100;
    }

    function camp(uint32 cate) internal pure returns(uint) {
        return cate / 100 % 100;
    }

    function id(uint32 cate) internal pure returns(uint) {
        return cate % 100;
    }
}
