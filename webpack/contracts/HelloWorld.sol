pragma solidity ^0.4.17;

contract HelloWorld {
    function say() public pure returns (string) {
        return "Hel22";
    }

    //
    function print(string name) public pure returns (string) {
        return name;
    }

    function getBalance() returns (uint){
        return this.balance;
    }
}