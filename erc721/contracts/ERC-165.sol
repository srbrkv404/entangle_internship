// SPDX-License-Identifier: MIT

pragma solidity 0.8.27;

import "./IERC-165.sol";

contract ERC165 is IERC165 {
    function supportsInterface(bytes4 interfaceId) virtual public pure returns(bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}