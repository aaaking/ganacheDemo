pragma solidity ^0.4.23;

import './libs/Utils.sol';
import './user/User.sol';

contract Migrations is Users {
  address public owner;
  uint public last_completed_migration;

  mapping(uint256 => uint256) data;

  constructor() public {
    owner = msg.sender;
  }

  function set(uint256 key, uint256 value) public {
    log0("xxs");
    data[key] = value;
  }
    
  function get(uint256 key) view public returns (uint256 value) {
    value = data[key];
  }

  function say() public pure returns (string) {
    return "hello mshk.top";
  }

  function print(string name) public pure returns (string) {
    return name;
  }

  function useUtil(bytes _data) public pure returns(uint) {
    return Utils.bytesToUint(_data);
  }

  function getMigration() public view returns(uint) {
    return last_completed_migration;
  }

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
