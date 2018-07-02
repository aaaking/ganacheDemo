pragma solidity ^0.4.21;

import "./ERC/ERC721Token.sol";
import "./Ctrlship/Ctrlable.sol";

contract CardOwnership is ERC721Token, Ctrlable {
    string internal constant _name_ = "BlockThreeKingdoms";
    string internal constant _symbol_ = "btk";

    function CardOwnership() public
        ERC721Token(_name_, _symbol_) {
        
    }

    function mint(address _to, uint _tokenId) external onlyCtrl {
        _mint(_to, _tokenId);
    }

    function burn(address _owner, uint _tokenId) external onlyCtrl {
        _burn(_owner, _tokenId);
    }
}