pragma solidity ^0.4.18;


/// @title Interface for contracts conforming to ERC-721: Non-Fungible Tokens (NFTs)
interface ERC721 {
    function implementsERC721() public pure returns (bool);

    // ERC-20 Compatibility
    function name() public view returns (string _name);
    function symbol() public view returns (string _symbol);

    function totalSupply() public view returns (uint256 _totalSupply);
    function balanceOf(address _owner) public view returns (uint256 balance);

    // Basic Ownership
    function ownerOf(uint256 _tokenId) public view returns (address owner);
    function approve(address _to, uint256 _tokenId) public;

    function transferFrom(address _from, address _to, uint256 _tokenId) public;
    function transfer(address _to, uint256 _tokenId) public;

    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256 tokenId);

    // NFT Metadata
    // function tokenMetadata(uint256 _tokenId) public view returns (string infoUrl);

    // events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
}
