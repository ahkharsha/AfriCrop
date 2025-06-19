// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EducationVault is Ownable {
    IERC20 public rewardToken;

    struct LearningRecord {
        uint256 modulesCompleted;
        uint256 totalScore;
        uint256 lastRewarded;
    }

    mapping(address => LearningRecord) public learners;

    event ModuleCompleted(address learner, uint256 score, uint256 tokensRewarded);

    constructor(address _rewardToken) {
        rewardToken = IERC20(_rewardToken);
    }

    function completeModule(uint256 score) external {
        require(score > 0, "Score must be positive");

        LearningRecord storage learner = learners[msg.sender];
        learner.modulesCompleted++;
        learner.totalScore += score;

        uint256 tokens = score * 10 ** 18 / 100; // 1 token per 100 score
        learner.lastRewarded = tokens;

        rewardToken.transfer(msg.sender, tokens);
        emit ModuleCompleted(msg.sender, score, tokens);
    }

    function getProgress(address user) external view returns (uint256 modules, uint256 totalScore) {
        modules = learners[user].modulesCompleted;
        totalScore = learners[user].totalScore;
    }
}
