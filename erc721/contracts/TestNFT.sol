// SPDX-License-Identifier: MIT

pragma solidity 0.8.27;

import "./ERC-721.sol";

contract TestNFT is ERC721{
    using Strings for uint256;

    string private tokenBaseURI;
    address public owner;

    constructor (string memory baseURI) ERC721("srbrkv_test_nft", "STN") {
        tokenBaseURI = baseURI;
        owner = msg.sender;
    }

    function mintNFT(address _owner, uint256 _tokenId) public {
        _safeMint(_owner, _tokenId);
    }

    function baseTokenURI() internal view returns(string memory) {
        return tokenBaseURI;
    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        return bytes(baseTokenURI()).length > 0
                    ? string(abi.encodePacked(tokenBaseURI, tokenId.toString()))
                    : "";
    }

    function setBaseURI(string memory newBaseURI) public {
        require(msg.sender == owner, "You are not an owner");

        tokenBaseURI = newBaseURI;
    }
}