pragma solidity ^0.4.21;

import './Package.sol';

contract QunPackage is Package {
    uint internal _camp = 4;

    function packageCamp() external view returns(uint) {
        return _camp;
    }
}