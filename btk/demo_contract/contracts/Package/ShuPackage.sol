pragma solidity ^0.4.21;

import './Package.sol';

contract ShuPackage is Package {
    uint internal _camp = 2;

    function packageCamp() external view returns(uint) {
        return _camp;
    }
}