// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CropSwap is Ownable {
    struct SwapPair {
        IERC20 tokenA;
        IERC20 tokenB;
        uint256 rateAtoB; // number of B tokens per 1 A token (multiplied by 1e18)
    }

    mapping(bytes32 => SwapPair) public pairs;

    event SwapExecuted(address indexed user, address tokenA, address tokenB, uint256 amountIn, uint256 amountOut);

    function createSwapPair(
        address _tokenA,
        address _tokenB,
        uint256 _rateAtoB // e.g., 1 A = 0.8 B => 0.8 * 1e18
    ) external onlyOwner {
        require(_tokenA != _tokenB, "CropSwap: Identical tokens");
        bytes32 key = _pairKey(_tokenA, _tokenB);
        pairs[key] = SwapPair(IERC20(_tokenA), IERC20(_tokenB), _rateAtoB);
    }

    function swap(address _tokenA, address _tokenB, uint256 _amount) external {
        bytes32 key = _pairKey(_tokenA, _tokenB);
        SwapPair storage pair = pairs[key];
        require(address(pair.tokenA) != address(0), "CropSwap: Pair not found");

        uint256 amountOut = (_amount * pair.rateAtoB) / 1e18;

        require(pair.tokenA.transferFrom(msg.sender, address(this), _amount), "Transfer A failed");
        require(pair.tokenB.transfer(msg.sender, amountOut), "Transfer B failed");

        emit SwapExecuted(msg.sender, _tokenA, _tokenB, _amount, amountOut);
    }

    function _pairKey(address tokenA, address tokenB) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(tokenA, tokenB));
    }

    function withdrawToken(address token, address to) external onlyOwner {
        IERC20(token).transfer(to, IERC20(token).balanceOf(address(this)));
    }
}
