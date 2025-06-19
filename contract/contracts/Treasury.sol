// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Treasury is AccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    IERC20 public token;
    uint256 public yieldReserve;
    uint256 public emergencyReserve;

    event YieldFunded(uint256 amount);
    event EmergencyFundReleased(address to, uint256 amount);
    event LoanIssued(address borrower, uint256 amount);

    constructor(address _token) {
        token = IERC20(_token);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    function fundYield(uint256 amount) external onlyRole(MANAGER_ROLE) {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        yieldReserve += amount;
        emit YieldFunded(amount);
    }

    function releaseEmergencyFunds(address to, uint256 amount) external onlyRole(MANAGER_ROLE) {
        require(emergencyReserve >= amount, "Insufficient");
        emergencyReserve -= amount;
        require(token.transfer(to, amount), "Transfer fail");
        emit EmergencyFundReleased(to, amount);
    }

    function issueLoan(address borrower, uint256 amount) external onlyRole(MANAGER_ROLE) {
        require(token.transfer(borrower, amount), "Transfer fail");
        emit LoanIssued(borrower, amount);
    }

    function getTreasuryBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
