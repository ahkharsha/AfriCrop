// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Reputation.sol";

contract Voting is AccessControl {
    bytes32 public constant PROPOSAL_CREATOR_ROLE = keccak256("PROPOSAL_CREATOR_ROLE");

    IERC20 public governanceToken;
    Reputation public reputationContract;

    struct Proposal {
        uint256 id;
        string description;
        uint256 voteDeadline;
        uint256 totalVotes;
        bool executed;
        mapping(address => uint256) voterPower;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(uint256 indexed proposalId, string description, uint256 deadline);
    event VoteCast(address indexed voter, uint256 proposalId, uint256 votingPower);
    event ProposalExecuted(uint256 indexed proposalId);

    constructor(address _govToken, address _reputation) {
        governanceToken = IERC20(_govToken);
        reputationContract = Reputation(_reputation);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROPOSAL_CREATOR_ROLE, msg.sender);
    }

    function createProposal(string calldata _desc, uint256 _durationInSecs) external onlyRole(PROPOSAL_CREATOR_ROLE) {
        uint256 newId = proposalCount++;
        Proposal storage p = proposals[newId];
        p.id = newId;
        p.description = _desc;
        p.voteDeadline = block.timestamp + _durationInSecs;
        emit ProposalCreated(newId, _desc, p.voteDeadline);
    }

    function castVote(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp < p.voteDeadline, "Voting closed");
        require(p.voterPower[msg.sender] == 0, "Already voted");

        uint256 tokens = governanceToken.balanceOf(msg.sender);
        require(tokens > 0, "No tokens");

        uint256 repMultiplier = reputationContract.getReputationMultiplier(msg.sender);
        // Assume sustainability is embedded in rep multiplier for now
        uint256 power = sqrt(tokens) * repMultiplier / 1000;

        p.voterPower[msg.sender] = power;
        p.totalVotes += power;

        emit VoteCast(msg.sender, proposalId, power);
    }

    function executeProposal(uint256 proposalId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp >= p.voteDeadline, "Too early");
        require(!p.executed, "Already done");
        p.executed = true;
        emit ProposalExecuted(proposalId);
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
