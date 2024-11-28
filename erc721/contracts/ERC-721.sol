// SPDX-License-Identifier: MIT

pragma solidity 0.8.27;

import "./IERC-721_metadata.sol";
import "./ERC-721_receiver.sol";
import "./ERC-165.sol";
import "./Strings.sol";

contract ERC721 is ERC165, IERC721, IERC721Metadata {
    using Strings for uint256;

    string public name;
    string public symbol;

    mapping (address => uint256) _balances;
    mapping (uint256 => address) _owners;
    mapping (uint256 => address) _tokenApprovals;
    mapping (address => mapping (address => bool)) _operatorApprovals;


    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
    }

    function balanceOf(address owner) public view returns(uint256) {
        require(owner != address(0), "Zero address");

        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view _requireMinted(tokenId) returns(address) {
        return _owners[tokenId];
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not an owner or approved");

        _safeTransfer(from, to, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not an owner or approved");

        _transfer(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);

        require(owner == msg.sender || isApprovedForAll(owner, msg.sender), "Not an owner or approved");
        require(owner != to, "Can not approve to self");

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId); 
    }

    function setApprovalForAll(address operator, bool approved) public {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function getApproved(uint256 tokenId) public view _requireMinted(tokenId) returns(address) {
        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address owner, address operator) public view returns(bool) {
        return _operatorApprovals[owner][operator];
    }

    function tokenURI(uint256 tokenId) public _requireMinted(tokenId) returns(string memory) {
        string memory baseURI = _baseURI();

        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }

    function supportsInterface(bytes4 interfaceId) override public pure returns(bool) {
        return interfaceId == type(IERC721).interfaceId || super.supportsInterface(interfaceId);
    }

    // Service

    function _safeMint(address to, uint256 tokenId) internal {
        require(_checkOnERC721Received(msg.sender, to, tokenId), "Not ERC721 receiver");
        
        _mint(to, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "To cannot be zero");
        require(!_exists(tokenId), "Allready exist");

        _owners[tokenId] = to;
        _balances[to]++;

        emit Transfer(msg.sender, to, tokenId);
    }

    function _burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not an owner or approved");

        address owner = ownerOf(tokenId);
        delete _tokenApprovals[tokenId];
        _balances[owner]--;
        delete _owners[tokenId];
    }

    function _baseURI() internal virtual returns(string memory) {}

    function _exists(uint256 tokenId) internal view returns(bool) {
        return _owners[tokenId] != address(0);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns(bool) {
        address owner = ownerOf(tokenId);

        require(
            spender == owner ||
            isApprovedForAll(owner, spender) ||
            getApproved(tokenId) == spender,
            "Not an owner or approved"
        );

        return true;
    }

    function _safeTransfer(address from, address to, uint256 tokenId) internal {
        _transfer(from, to, tokenId);

        require(_checkOnERC721Received(from, to, tokenId), "Not ERC721 receiver");
    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        require(from == ownerOf(tokenId), "Not an owner");
        require(to != address(0), "To cannot be zero");

        _balances[from]--;
        _balances[to]++;

        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _checkOnERC721Received(address from, address to, uint256 tokenId) private returns(bool) {
        if (to.code.length > 0) {
            try  IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, bytes("")) returns(bytes4 ret) {
                return ret == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory error) {
                if (error.length == 0) {
                    revert("Not ERC721 receiver");
                } else {
                    assembly {
                        revert(add(32, error), mload(error))
                    }
                }
            }
        } else {
            return true;
        }
    }

    // Modifiers

    modifier _requireMinted(uint256 tokenId) {
        require(_exists(tokenId), "Not minted");
        _;
    }
}