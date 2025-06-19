// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * AfriCropDAO.sol - Main entry contract
 * Handles DAO-level access control and basic config
 */

import "./Reputation.sol";
import "./Voting.sol";
import "./Treasury.sol";
import "./CropInsurance.sol";
import "./CropNFT.sol";
import "./SustainabilityTracker.sol";
import "./BadgeSystem.sol";
import "./KnowledgeRewards.sol";

contract AfriCropDAO {
    address public admin;

    Reputation public reputation;
    Voting public voting;
    Treasury public treasury;
    CropInsurance public insurance;
    CropNFT public cropNFT;
    SustainabilityTracker public sustainability;
    BadgeSystem public badgeSystem;
    KnowledgeRewards public knowledge;

    constructor() {
        admin = msg.sender;
        reputation = new Reputation();
        voting = new Voting(address(reputation));
        treasury = new Treasury();
        insurance = new CropInsurance(admin); // Updated to pass admin address
        cropNFT = new CropNFT();
        sustainability = new SustainabilityTracker();
        badgeSystem = new BadgeSystem();
        knowledge = new KnowledgeRewards();
    }

    function getAllModules() external view returns (
        address, address, address, address, address, address, address, address
    ) {
        return (
            address(reputation),
            address(voting),
            address(treasury),
            address(insurance),
            address(cropNFT),
            address(sustainability),
            address(badgeSystem),
            address(knowledge)
        );
    }
}
