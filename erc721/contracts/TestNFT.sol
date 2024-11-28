// SPDX-License-Identifier: MIT

pragma solidity 0.8.27;

import "./ERC-721.sol";

contract TestNFT is ERC721{

    string public tokenBaseURI;

    constructor (string memory baseURI) ERC721("srbrkv_test_nft", "STN") {
        tokenBaseURI = baseURI;
    }

    function mintNFT(address _owner, uint256 _tokenId) public {
        _safeMint(_owner, _tokenId);
    }

    function _baseURI() override internal view returns(string memory) {
        return tokenBaseURI;
    }
}