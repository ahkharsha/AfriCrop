// contracts/src/AfriCropToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AfriCropToken is ERC20, Ownable {
    constructor() ERC20("AfriCrop DAO Token", "CROP") {
        _mint(msg.sender, 10_000_000 * 10 ** decimals()); // Initial supply
    }
    
    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }
    
    function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }
}