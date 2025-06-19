// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DAOProposal is AccessControl {
    bytes32 public constant REVIEWER_ROLE = keccak256("REVIEWER_ROLE");
    bytes32 public constant EXPERT_ROLE = keccak256("EXPERT_ROLE");

    enum ProposalStage { Draft, CommunityReview, ExpertValidation, Voting, Implementation, Evaluation }

    struct Proposal {
        uint256 id;
        string title;
        string description;
        ProposalStage currentStage;
        uint256 timestamp;
        uint256 consensusScore;
    }

    uint256 public proposalCounter;
    mapping(uint256 => Proposal) public proposals;

    event ProposalSubmitted(uint256 indexed id, string title);
    event StageUpdated(uint256 indexed id, ProposalStage newStage);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REVIEWER_ROLE, msg.sender);
        _grantRole(EXPERT_ROLE, msg.sender);
    }

    function submitProposal(string memory title, string memory description) external returns (uint256) {
        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            title: title,
            description: description,
            currentStage: ProposalStage.Draft,
            timestamp: block.timestamp,
            consensusScore: 0
        });
        emit ProposalSubmitted(proposalCounter, title);
        return proposalCounter++;
    }

    function advanceStage(uint256 id) external {
        Proposal storage p = proposals[id];
        require(p.id == id, "Invalid ID");
        if (p.currentStage == ProposalStage.Evaluation) revert("Final stage reached");

        if (p.currentStage == ProposalStage.Draft) {
            require(hasRole(REVIEWER_ROLE, msg.sender), "Only reviewer");
        } else if (p.currentStage == ProposalStage.CommunityReview) {
            require(hasRole(EXPERT_ROLE, msg.sender), "Only expert");
        } else if (p.currentStage == ProposalStage.ExpertValidation) {
            require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only admin");
        }

        p.currentStage = ProposalStage(uint256(p.currentStage) + 1);
        p.timestamp = block.timestamp;

        emit StageUpdated(id, p.currentStage);
    }

    function getProposal(uint256 id) external view returns (Proposal memory) {
        return proposals[id];
    }
}
