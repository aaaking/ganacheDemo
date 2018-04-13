pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SanGuoSha.sol";

contract TestMetacoin {

  function testInitialBalanceUsingDeployedContract() public {
    SanGuoSha meta = SanGuoSha(DeployedAddresses.SanGuoSha());

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 SanGuoSha initially");
  }

  function testInitialBalanceWithNewSanGuoSha() public {
    SanGuoSha meta = new SanGuoSha();

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 SanGuoSha initially");
  }

}
