// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Reputation.sol - Tracks farmer performance, sustainability, and contributions.
 * Dynamic scores influence governance weight, badges, and education rewards.
 */

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Reputation is AccessControl {
    using SafeMath for uint256;

    bytes32 public constant REPUTATION_MODIFIER_ROLE = keccak256("REPUTATION_MODIFIER_ROLE");

    struct ReputationScore {
        uint256 yieldPerformance;
        uint256 sustainability; // CO2 reduction, organic practices, etc.
        uint256 participation;  // Governance + community engagement
        uint256 educationPoints;
    }

    mapping(address => ReputationScore) private _reputations;

    event ReputationUpdated(
        address indexed farmer,
        uint256 yieldPerformance,
        uint256 sustainability,
        uint256 participation,
        uint256 educationPoints
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REPUTATION_MODIFIER_ROLE, msg.sender);
    }

    modifier onlyAuthorized() {
        require(hasRole(REPUTATION_MODIFIER_ROLE, msg.sender), "Not authorized to modify reputation");
        _;
    }

    function getReputation(address farmer) external view returns (ReputationScore memory) {
        return _reputations[farmer];
    }

    function getReputationMultiplier(address farmer) external view returns (uint256) {
        ReputationScore memory score = _reputations[farmer];
        uint256 raw = score.yieldPerformance + score.sustainability + score.participation + score.educationPoints;
        return 1000 + raw; // Base multiplier of 1000 (1.0x) + score sum
    }

    function updateReputation(
        address farmer,
        uint256 yieldDelta,
        uint256 sustainabilityDelta,
        uint256 participationDelta,
        uint256 educationDelta
    ) external onlyAuthorized {
        _reputations[farmer].yieldPerformance = _reputations[farmer].yieldPerformance.add(yieldDelta);
        _reputations[farmer].sustainability = _reputations[farmer].sustainability.add(sustainabilityDelta);
        _reputations[farmer].participation = _reputations[farmer].participation.add(participationDelta);
        _reputations[farmer].educationPoints = _reputations[farmer].educationPoints.add(educationDelta);

        emit ReputationUpdated(
            farmer,
            _reputations[farmer].yieldPerformance,
            _reputations[farmer].sustainability,
            _reputations[farmer].participation,
            _reputations[farmer].educationPoints
        );
    }

    function resetReputation(address farmer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _reputations[farmer] = ReputationScore(0, 0, 0, 0);
        emit ReputationUpdated(farmer, 0, 0, 0, 0);
    }
}
