// contracts/Market1155.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Market1155 is ERC1155, Ownable {

    uint256 public constant CHARIZARD = 0;
    uint256 public constant IVYSAUR = 1;
    uint256 public constant VENUSAUR = 2;
    
    mapping (uint256 => string) private _uris;

    constructor() public ERC1155("https://ipfs.moralis.io:2053/ipfs/QmS2asoxrA6RH5BKwbZAgPktbGbcGKyKqCseimvPwLaQLV/metadata/{id}.json") {
                                //   https://ipfs.moralis.io:2053/ipfs/QmS2asoxrA6RH5BKwbZAgPktbGbcGKyKqCseimvPwLaQLV/metadata/1.json

    
        _mint(msg.sender, CHARIZARD, 100, "");
        _mint(msg.sender, IVYSAUR, 100, "");
        _mint(msg.sender, VENUSAUR, 100, "");

    }
    
    function uri(uint256 tokenId) override public view returns (string memory) {
        return(_uris[tokenId]);
    }
    
    function setTokenUri(uint256 tokenId, string memory uri) public onlyOwner {
        require(bytes(_uris[tokenId]).length == 0, "Cannot set uri twice"); 
        _uris[tokenId] = uri; 
    }
}