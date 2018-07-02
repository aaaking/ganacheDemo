pragma solidity ^0.4.21;

contract Random {
    uint _seed;
    function next() external returns(uint) {
        _seed = uint(keccak256(keccak256(block.blockhash(block.number - 1), _seed), now));

        return _seed;
    }
}