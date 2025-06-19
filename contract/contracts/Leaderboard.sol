// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Leaderboard is AccessControl {
    bytes32 public constant GAME_ENGINE_ROLE = keccak256("GAME_ENGINE_ROLE");

    struct Score {
        uint256 seasonal;
        uint256 lifetime;
        uint256 lastSeasonUpdated;
    }

    mapping(address => Score) public scores;

    event ScoreUpdated(address indexed farmer, uint256 seasonal, uint256 lifetime);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GAME_ENGINE_ROLE, msg.sender);
    }

    function updateScore(address farmer, uint256 points, uint256 currentSeason) external onlyRole(GAME_ENGINE_ROLE) {
        Score storage s = scores[farmer];

        if (s.lastSeasonUpdated != currentSeason) {
            s.seasonal = 0; // reset seasonal if new season
            s.lastSeasonUpdated = currentSeason;
        }

        s.seasonal += points;
        s.lifetime += points;

        emit ScoreUpdated(farmer, s.seasonal, s.lifetime);
    }

    function getScores(address farmer) external view returns (uint256 seasonal, uint256 lifetime) {
        Score storage s = scores[farmer];
        return (s.seasonal, s.lifetime);
    }
}
