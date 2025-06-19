// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SocialImpact is AccessControl {
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    struct ImpactScore {
        uint256 carbonSequestered;
        uint256 foodSecurityPoints;
        uint256 communityProjects;
    }

    mapping(address => ImpactScore) public farmerScores;

    event ImpactUpdated(address indexed farmer, ImpactScore newScore);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
    }

    function updateImpact(
        address farmer,
        uint256 carbonDelta,
        uint256 foodDelta,
        uint256 communityDelta
    ) external onlyRole(UPDATER_ROLE) {
        farmerScores[farmer].carbonSequestered += carbonDelta;
        farmerScores[farmer].foodSecurityPoints += foodDelta;
        farmerScores[farmer].communityProjects += communityDelta;

        emit ImpactUpdated(farmer, farmerScores[farmer]);
    }

    function getImpact(address farmer) external view returns (ImpactScore memory) {
        return farmerScores[farmer];
    }
}
