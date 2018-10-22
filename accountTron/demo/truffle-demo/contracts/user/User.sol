pragma solidity ^0.4.23;

// pragma experimental ABIEncoderV2;

import "../libs/Utils.sol";

contract Users {
    struct Participant {
        uint id;
        bytes32 name;
        uint point;
    }

    Participant[] public users;
    uint userCount;
    function addUser(bytes32 userName, uint userPoint) public returns (uint userID, bool success) {
        userID = userCount++;
        Participant memory newUser;
        newUser.id = userID;
        newUser.name = userName;
        newUser.point = userPoint;
        users.push(newUser);
        return (userID, true);
    }

    function getUsers() public view returns (uint[], bytes32[], uint[]) {
        uint length = users.length;
        uint[] memory usersID = new uint[](length);
        bytes32[] memory userNames = new bytes32[](length);
        uint[] memory userPoints = new uint[](length);
        for (uint i = 0; i < length; i++) {
            Participant memory showUser;
            showUser = users[i];
            usersID[i] = showUser.id;
            userNames[i] = showUser.name;
            userPoints[i] = showUser.point;
        }
        return (usersID, userNames, userPoints);
    }

    function plusFive(uint id) public returns (bool suc) {
        users[id].point = users[id].point + 5;
        return true;
    }

    function getName(uint id) public view returns (string) {
        return Utils.bytesToString(users[id].name);
    }
}