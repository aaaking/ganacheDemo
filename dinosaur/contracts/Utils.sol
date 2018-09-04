pragma solidity ^0.4.18;

contract Utils {

    function min (uint256 a, uint256 b) public pure returns (uint256) {
        return a > b ? b : a;
    }

    function max (uint256 a, uint256 b) public pure returns (uint256) {
        return a > b ? a : b;
    }

}
