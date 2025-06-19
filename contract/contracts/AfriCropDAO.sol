// contracts/src/AfriCropDAO.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract AfriCropDAO is Ownable {
    enum ProposalType { FUNDING, SEED_DISTRIBUTION, ADMIN_CHANGE, POLICY_CHANGE }
    enum VoteType { YES, NO, ABSTAIN }
    
    struct Proposal {
        uint256 id;
        ProposalType proposalType;
        address proposer;
        string title;
        string description;
        uint256 amount;
        address recipient;
        uint256 creationTime;
        uint256 endTime;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 abstainVotes;
        bool executed;
        address newAdmin; // For ADMIN_CHANGE proposals
    }
    
    IERC20 public governanceToken;
    IERC721 public reputationNFT;
    
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    uint256 public votingPeriod = 7 days;
    uint256 public quorum = 30; // 30% of total supply
    uint256 public majorityThreshold = 51; // 51% of votes
    
    event ProposalCreated(uint256 indexed id, ProposalType proposalType, address proposer);
    event Voted(uint256 indexed proposalId, address voter, VoteType vote, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event AdminChanged(address oldAdmin, address newAdmin);
    
    constructor(address _governanceToken, address _reputationNFT) {
        governanceToken = IERC20(_governanceToken);
        reputationNFT = IERC721(_reputationNFT);
    }
    
    function createProposal(
        ProposalType _proposalType,
        string memory _title,
        string memory _description,
        uint256 _amount,
        address _recipient,
        address _newAdmin
    ) external {
        require(
            _proposalType != ProposalType.ADMIN_CHANGE || _newAdmin != address(0),
            "Invalid new admin address"
        );
        
        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.id = proposalCount;
        newProposal.proposalType = _proposalType;
        newProposal.proposer = msg.sender;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.amount = _amount;
        newProposal.recipient = _recipient;
        newProposal.creationTime = block.timestamp;
        newProposal.endTime = block.timestamp + votingPeriod;
        newProposal.newAdmin = _newAdmin;
        
        emit ProposalCreated(proposalCount, _proposalType, msg.sender);
    }
    
    function vote(uint256 _proposalId, VoteType _vote) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");
        
        uint256 votingPower = calculateVotingPower(msg.sender);
        require(votingPower > 0, "No voting power");
        
        if (_vote == VoteType.YES) {
            proposal.yesVotes += votingPower;
        } else if (_vote == VoteType.NO) {
            proposal.noVotes += votingPower;
        } else {
            proposal.abstainVotes += votingPower;
        }
        
        hasVoted[_proposalId][msg.sender] = true;
        emit Voted(_proposalId, msg.sender, _vote, votingPower);
    }
    
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        
        uint256 totalVotes = proposal.yesVotes + proposal.noVotes;
        uint256 totalSupply = governanceToken.totalSupply();
        
        require(totalVotes >= (totalSupply * quorum) / 100, "Quorum not reached");
        require(proposal.yesVotes > (totalVotes * majorityThreshold) / 100, "Majority not reached");
        
        proposal.executed = true;
        
        if (proposal.proposalType == ProposalType.ADMIN_CHANGE) {
            address oldOwner = owner();
            _transferOwnership(proposal.newAdmin);
            emit AdminChanged(oldOwner, proposal.newAdmin);
        } else if (proposal.proposalType == ProposalType.FUNDING) {
            require(governanceToken.transfer(proposal.recipient, proposal.amount), "Transfer failed");
        }
        // Other proposal types would be handled here
        
        emit ProposalExecuted(_proposalId);
    }
    
    function calculateVotingPower(address _voter) public view returns (uint256) {
        uint256 tokenBalance = governanceToken.balanceOf(_voter);
        uint256 reputationScore = reputationNFT.balanceOf(_voter); // Simple 1 NFT = 1 rep point
        
        // Basic voting power calculation - can be enhanced
        return tokenBalance + (reputationScore * 100); // Each rep point counts as 100 tokens
    }
    
    function setVotingPeriod(uint256 _newPeriod) external onlyOwner {
        votingPeriod = _newPeriod;
    }
    
    function setQuorum(uint256 _newQuorum) external onlyOwner {
        require(_newQuorum <= 100, "Quorum cannot exceed 100%");
        quorum = _newQuorum;
    }
    
    function setMajorityThreshold(uint256 _newThreshold) external onlyOwner {
        require(_newThreshold <= 100, "Threshold cannot exceed 100%");
        majorityThreshold = _newThreshold;
    }
}