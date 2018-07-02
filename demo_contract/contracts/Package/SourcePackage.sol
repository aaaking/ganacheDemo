pragma solidity ^0.4.21;

import "./Package.sol";

contract SourcePackage is Package {

    uint internal _packageType = 1;

    function packageType() external view returns(uint) {
        return _packageType;
    }
}