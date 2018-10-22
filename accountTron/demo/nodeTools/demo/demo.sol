pragma solidity ^0.4.23;

import "./libs/Utils.sol";

contract demo {

    mapping(uint256 => uint256) data;

    function set(uint256 key, uint256 value) public {
        data[key] = value;
    }
    
    function get(uint256 key) view public returns (uint256 value) {
        value = data[key];
    }
    
    function getUint(bytes _data) view public returns (uint256) {
        return data[Utils.bytesToUint(_data)];
    }
}