// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AfriCropDAO is Ownable {
    using Counters for Counters.Counter;

    // ====== SAFE MATH FUNCTIONS ======
    function _add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "Addition overflow");
        return c;
    }

    function _sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "Subtraction overflow");
        return a - b;
    }

    function _mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "Multiplication overflow");
        return c;
    }

    function _div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "Division by zero");
        return a / b;
    }

    // ====== ERROR DEFINITIONS ======
    error AfriCropDAO__FarmerNotRegistered(address farmer);
    error AfriCropDAO__CropNotFound(uint256 cropId);
    error AfriCropDAO__InvalidCropStage(
        uint256 cropId,
        CropStage expectedStage
    );
    error AfriCropDAO__NotCropOwner(address caller, uint256 cropId);
    error AfriCropDAO__NotHarvested(uint256 cropId);
    error AfriCropDAO__NotSelling(uint256 cropId);
    error AfriCropDAO__ZeroAmount();
    error AfriCropDAO__InsufficientFunds();
    error AfriCropDAO__ListingNotFound(uint256 listingId);
    error AfriCropDAO__NotListingOwner(uint256 listingId);
    error AfriCropDAO__VotingPeriodNotActive();
    error AfriCropDAO__ProposalNotFound(uint256 proposalId);
    error AfriCropDAO__ProposalNotExecutable();
    error AfriCropDAO__AlreadyVoted(uint256 proposalId);
    error AfriCropDAO__CannotVoteOnExpiredProposal();
    error AfriCropDAO__StakeRequired(uint256 requiredStake);
    error AfriCropDAO__InsufficientStake();
    error AfriCropDAO__AlreadyRegistered();
    error AfriCropDAO__LessonAlreadyCompleted();
    error AfriCropDAO__MentorAlreadyAssigned();
    error AfriCropDAO__NotMentorOrMentee();
    error AfriCropDAO__MentorshipNotCompleted();
    error AfriCropDAO__InsufficientReputationForMentorship();
    error AfriCropDAO__InvalidDonationAmount();

    // ====== DEBUG SYSTEM ======
    bool public debugMode;
    event DebugModeToggled(bool enabled);
    event DebugAction(string action, address indexed user, uint256 data);
    event TreasuryDonation(address indexed donor, uint256 amount);

    // ====== CORE STRUCTURES ======
    enum CropStage {
        SOWN,
        GROWING,
        HARVESTED,
        SELLING,
        SOLD,
        CANCELLED
    }
    enum CropType {
        MAIZE,
        RICE,
        WHEAT,
        CASSAVA,
        BEANS,
        SORGHUM,
        MILLET,
        YAM,
        POTATOES,
        COFFEE,
        COTTON
    }
    enum ProposalType {
        AdminChange,
        FundAllocation,
        ParameterChange,
        ResearchGrant
    }
    enum ProposalStatus {
        PENDING,
        ACTIVE,
        PASSED,
        FAILED,
        EXECUTED
    }

    struct Farmer {
        address walletAddress;
        uint256 reputationPoints;
        uint256 sustainabilityScore;
        uint256 knowledgePoints;
        uint256 harvestPoints;
        uint256 lastProposalStakeTime;
        bool isRegistered;
    }

    struct Crop {
        uint256 id;
        address farmerAddress;
        CropType cropType;
        string farmId;
        uint256 sownTimestamp;
        uint256 harvestedTimestamp;
        CropStage stage;
        uint256 initialSeeds;
        uint256 harvestedOutput;
    }

    struct MarketListing {
        uint256 listingId;
        uint256 cropId;
        address seller;
        uint256 priceInWei;
        uint256 quantityToSell;
        uint256 listingTimestamp;
        bool isActive;
    }

    struct Proposal {
        uint256 id;
        address proposer;
        ProposalType proposalType;
        string description;
        uint256 stakeAmount;
        uint256 startBlock;
        uint256 endBlock;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        ProposalStatus status;
        mapping(address => bool) hasVoted;
        address targetAddress;
        uint256 amount;
        uint256 paramKey;
        uint256 paramValue;
        string researchGrantDetailsIPFSHash;
    }

    struct Lesson {
        uint256 id;
        string ipfsHash;
        uint256 knowledgePointsReward;
    }

    struct MentorshipSession {
        uint256 id;
        address mentor;
        address mentee;
        bool accepted;
        bool completed;
        uint256 startTimestamp;
        uint256 endTimestamp;
    }

    // ====== STATE VARIABLES ======
    uint256 public constant DAO_FEE_PERCENT = 10;
    Counters.Counter private _cropIds;
    Counters.Counter private _listingIds;
    Counters.Counter private _proposalIds;
    Counters.Counter private _lessonIds;
    Counters.Counter private _mentorshipIds;

    mapping(address => Farmer) public farmers;
    address[] public registeredFarmers;
    mapping(uint256 => Crop) public crops;
    mapping(address => uint256[]) public farmerCrops;
    mapping(uint256 => MarketListing) public marketListings;
    uint256[] public activeListings;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Lesson) public lessons;
    mapping(address => mapping(uint256 => bool)) public completedLessons;
    mapping(uint256 => MentorshipSession) public mentorshipSessions;
    mapping(address => uint256[]) public activeMentorships;

    // ====== EVENTS ======
    event FarmerRegistered(
        address indexed farmerAddress,
        uint256 initialReputation
    );
    event CropSown(
        uint256 indexed cropId,
        address indexed farmerAddress,
        CropType cropType,
        string farmId,
        uint256 timestamp
    );
    event CropStageUpdated(
        uint256 indexed cropId,
        CropStage newStage,
        uint256 timestamp
    );
    event CropListed(
        uint256 indexed listingId,
        uint256 indexed cropId,
        address indexed seller,
        uint256 price,
        uint256 quantity
    );
    event CropPurchased(
        uint256 indexed listingId,
        uint256 indexed cropId,
        address indexed buyer,
        address seller,
        uint256 price,
        uint256 daoFee
    );
    event CropListingCancelled(
        uint256 indexed listingId,
        uint256 indexed cropId
    );
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalType proposalType,
        uint256 stake
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        uint256 votingPower,
        bool vote
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event LessonAdded(
        uint256 indexed lessonId,
        string ipfsHash,
        uint256 knowledgePointsReward
    );
    event LessonCompleted(
        address indexed farmerAddress,
        uint256 indexed lessonId,
        uint256 knowledgePointsEarned
    );
    event MentorshipRequested(
        uint256 indexed sessionId,
        address indexed mentee,
        address indexed mentor
    );
    event MentorshipAccepted(uint256 indexed sessionId);
    event MentorshipCompleted(
        uint256 indexed sessionId,
        address indexed mentor,
        address indexed mentee
    );
    event ReputationUpdated(
        address indexed farmerAddress,
        uint256 newReputation
    );
    event SustainabilityScoreUpdated(
        address indexed farmerAddress,
        uint256 newScore
    );
    event KnowledgePointsUpdated(
        address indexed farmerAddress,
        uint256 newPoints
    );
    event HarvestPointsUpdated(
        address indexed farmerAddress,
        uint256 newPoints
    );
    event FundAllocationExecuted(address indexed recipient, uint256 amount);
    event ParameterChangeExecuted(uint256 indexed paramKey, uint256 newValue);
    event TreasuryWithdrawn(address indexed recipient, uint256 amount);

    constructor() {
        _transferOwnership(msg.sender);
    }

    // ====== MODIFIERS ======
    modifier onlyRegisteredFarmer() {
        if (!farmers[msg.sender].isRegistered) {
            revert AfriCropDAO__FarmerNotRegistered(msg.sender);
        }
        _;
    }

    // ====== DEBUG FUNCTIONS ======
    function toggleDebugMode(bool _status) external onlyOwner {
        debugMode = _status;
        emit DebugModeToggled(_status);
    }

    function debug_CompleteLesson(address _user, uint256 _lessonId) external {
        require(debugMode, "Debug mode disabled");
        require(
            !completedLessons[_user][_lessonId],
            "Lesson already completed"
        );
        completedLessons[_user][_lessonId] = true;
        _updateKnowledgePoints(
            _user,
            lessons[_lessonId].knowledgePointsReward,
            true
        );
        emit DebugAction("LessonCompleted", _user, _lessonId);
    }

    function debug_ForceHarvest(uint256 _cropId) external {
        require(debugMode, "Debug mode disabled");
        Crop storage crop = crops[_cropId];
        require(crop.stage == CropStage.GROWING, "Crop not growing");
        crop.stage = CropStage.HARVESTED;
        crop.harvestedTimestamp = block.timestamp;
        crop.harvestedOutput = _mul(crop.initialSeeds, 90) / 100; // 10% loss
        emit DebugAction("HarvestForced", msg.sender, _cropId);
    }

    function debug_AddReputation(address _user, uint256 _points) external {
        require(debugMode, "Debug mode disabled");
        _updateReputation(_user, _points, true);
        emit DebugAction("ReputationAdded", _user, _points);
    }

    // ====== TREASURY FUNCTIONS ======
    function donateToTreasury() external payable {
        if (msg.value == 0) revert AfriCropDAO__InvalidDonationAmount();
        emit TreasuryDonation(msg.sender, msg.value);
    }

    function withdrawDAOFunds(
        address payable _recipient,
        uint256 _amount
    ) external onlyOwner {
        if (_amount == 0) revert AfriCropDAO__ZeroAmount();
        if (_amount > address(this).balance)
            revert AfriCropDAO__InsufficientFunds();

        _recipient.transfer(_amount);
        emit TreasuryWithdrawn(_recipient, _amount);
    }

    function getTreasuryBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // ====== FARMER FUNCTIONS ======
    function registerFarmer() public {
        if (farmers[msg.sender].isRegistered) {
            revert AfriCropDAO__AlreadyRegistered();
        }

        farmers[msg.sender] = Farmer({
            walletAddress: msg.sender,
            reputationPoints: 100,
            sustainabilityScore: 0,
            knowledgePoints: 0,
            harvestPoints: 0,
            lastProposalStakeTime: 0,
            isRegistered: true
        });
        registeredFarmers.push(msg.sender);
        emit FarmerRegistered(msg.sender, 100);
    }

    function getFarmerProfile(
        address _farmerAddress
    ) public view returns (Farmer memory) {
        return farmers[_farmerAddress];
    }

    function getRegisteredFarmers() public view returns (address[] memory) {
        return registeredFarmers;
    }

    function _updateReputation(
        address _farmer,
        uint256 _points,
        bool _increase
    ) internal {
        if (_increase) {
            farmers[_farmer].reputationPoints = _add(
                farmers[_farmer].reputationPoints,
                _points
            );
        } else {
            farmers[_farmer].reputationPoints = _sub(
                farmers[_farmer].reputationPoints,
                _points
            );
        }
        emit ReputationUpdated(_farmer, farmers[_farmer].reputationPoints);
    }

    function _updateSustainabilityScore(
        address _farmer,
        uint256 _points,
        bool _increase
    ) internal {
        if (_increase) {
            farmers[_farmer].sustainabilityScore = _add(
                farmers[_farmer].sustainabilityScore,
                _points
            );
        } else {
            farmers[_farmer].sustainabilityScore = _sub(
                farmers[_farmer].sustainabilityScore,
                _points
            );
        }
        emit SustainabilityScoreUpdated(
            _farmer,
            farmers[_farmer].sustainabilityScore
        );
    }

    function _updateKnowledgePoints(
        address _farmer,
        uint256 _points,
        bool _increase
    ) internal {
        if (_increase) {
            farmers[_farmer].knowledgePoints = _add(
                farmers[_farmer].knowledgePoints,
                _points
            );
        } else {
            farmers[_farmer].knowledgePoints = _sub(
                farmers[_farmer].knowledgePoints,
                _points
            );
        }
        emit KnowledgePointsUpdated(_farmer, farmers[_farmer].knowledgePoints);
    }

    function _updateHarvestPoints(
        address _farmer,
        uint256 _points,
        bool _increase
    ) internal {
        if (_increase) {
            farmers[_farmer].harvestPoints = _add(
                farmers[_farmer].harvestPoints,
                _points
            );
        } else {
            farmers[_farmer].harvestPoints = _sub(
                farmers[_farmer].harvestPoints,
                _points
            );
        }
        emit HarvestPointsUpdated(_farmer, farmers[_farmer].harvestPoints);
    }

    // ====== CROP MANAGEMENT ======
    function sowCrop(
        CropType _cropType,
        string calldata _farmId,
        uint256 _initialSeeds
    ) public onlyRegisteredFarmer {
        _cropIds.increment();
        uint256 newCropId = _cropIds.current();

        crops[newCropId] = Crop({
            id: newCropId,
            farmerAddress: msg.sender,
            cropType: _cropType,
            farmId: _farmId,
            sownTimestamp: block.timestamp,
            harvestedTimestamp: 0,
            stage: CropStage.SOWN,
            initialSeeds: _initialSeeds,
            harvestedOutput: 0
        });
        farmerCrops[msg.sender].push(newCropId);
        emit CropSown(
            newCropId,
            msg.sender,
            _cropType,
            _farmId,
            block.timestamp
        );
    }

    function updateCropStage(
        uint256 _cropId,
        CropStage _newStage
    ) public onlyRegisteredFarmer {
        Crop storage crop = crops[_cropId];
        if (crop.farmerAddress != msg.sender) {
            revert AfriCropDAO__NotCropOwner(msg.sender, _cropId);
        }
        if (crop.id == 0) {
            revert AfriCropDAO__CropNotFound(_cropId);
        }

        if (_newStage == CropStage.GROWING) {
            if (crop.stage != CropStage.SOWN) {
                revert AfriCropDAO__InvalidCropStage(_cropId, CropStage.SOWN);
            }
        } else if (_newStage == CropStage.HARVESTED) {
            if (crop.stage != CropStage.GROWING) {
                revert AfriCropDAO__InvalidCropStage(
                    _cropId,
                    CropStage.GROWING
                );
            }
            crop.harvestedTimestamp = block.timestamp;
        }
        crop.stage = _newStage;
        emit CropStageUpdated(_cropId, _newStage, block.timestamp);
    }

    function getFarmerCrops(
        address _farmerAddress
    ) public view returns (uint256[] memory) {
        return farmerCrops[_farmerAddress];
    }

    // ====== MARKETPLACE FUNCTIONS ======
    function listCropForSale(
        uint256 _cropId,
        uint256 _priceInWei,
        uint256 _quantityToSell,
        uint256 _plantsDiedOffPercentage
    ) public onlyRegisteredFarmer {
        Crop storage crop = crops[_cropId];
        if (crop.farmerAddress != msg.sender) {
            revert AfriCropDAO__NotCropOwner(msg.sender, _cropId);
        }
        if (crop.stage != CropStage.HARVESTED) {
            revert AfriCropDAO__NotHarvested(_cropId);
        }
        if (_priceInWei == 0 || _quantityToSell == 0) {
            revert AfriCropDAO__ZeroAmount();
        }

        uint256 actualHarvestedOutput = _div(
            _mul(crop.initialSeeds, _sub(100, _plantsDiedOffPercentage)),
            100
        );
        crop.harvestedOutput = actualHarvestedOutput;

        if (_quantityToSell > crop.harvestedOutput) {
            revert AfriCropDAO__ZeroAmount();
        }

        _listingIds.increment();
        uint256 newListingId = _listingIds.current();

        marketListings[newListingId] = MarketListing({
            listingId: newListingId,
            cropId: _cropId,
            seller: msg.sender,
            priceInWei: _priceInWei,
            quantityToSell: _quantityToSell,
            listingTimestamp: block.timestamp,
            isActive: true
        });

        bool alreadyInActiveListings = false;
        for (uint i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == newListingId) {
                alreadyInActiveListings = true;
                break;
            }
        }
        if (!alreadyInActiveListings) {
            activeListings.push(newListingId);
        }

        crop.stage = CropStage.SELLING;
        emit CropListed(
            newListingId,
            _cropId,
            msg.sender,
            _priceInWei,
            _quantityToSell
        );
    }

    function purchaseCrop(uint256 _listingId) public payable {
        MarketListing storage listing = marketListings[_listingId];
        if (!listing.isActive) {
            revert AfriCropDAO__ListingNotFound(_listingId);
        }
        if (listing.seller == msg.sender) {
            revert AfriCropDAO__InvalidCropStage(_listingId, CropStage.SELLING);
        }
        if (msg.value < listing.priceInWei) {
            revert AfriCropDAO__InsufficientFunds();
        }

        Crop storage crop = crops[listing.cropId];
        if (crop.stage != CropStage.SELLING) {
            revert AfriCropDAO__NotSelling(listing.cropId);
        }

        uint256 daoFee = _div(_mul(listing.priceInWei, DAO_FEE_PERCENT), 100);
        uint256 sellerAmount = _sub(listing.priceInWei, daoFee);

        payable(listing.seller).transfer(sellerAmount);

        crop.farmerAddress = msg.sender;
        crop.stage = CropStage.SOLD;
        listing.isActive = false;

        for (uint i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == _listingId) {
                activeListings[i] = activeListings[activeListings.length - 1];
                activeListings.pop();
                break;
            }
        }

        _updateHarvestPoints(
            listing.seller,
            _div(listing.quantityToSell, 10),
            true
        );
        _updateReputation(msg.sender, 5, true);
        emit CropPurchased(
            _listingId,
            listing.cropId,
            msg.sender,
            listing.seller,
            listing.priceInWei,
            daoFee
        );
    }

    function cancelCropListing(uint256 _listingId) public onlyRegisteredFarmer {
        MarketListing storage listing = marketListings[_listingId];
        if (!listing.isActive) {
            revert AfriCropDAO__ListingNotFound(_listingId);
        }
        if (listing.seller != msg.sender) {
            revert AfriCropDAO__NotListingOwner(_listingId);
        }

        listing.isActive = false;
        crops[listing.cropId].stage = CropStage.HARVESTED;

        for (uint i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == _listingId) {
                activeListings[i] = activeListings[activeListings.length - 1];
                activeListings.pop();
                break;
            }
        }
        emit CropListingCancelled(_listingId, listing.cropId);
    }

    function getActiveMarketListings()
        public
        view
        returns (MarketListing[] memory)
    {
        MarketListing[] memory listingsArray = new MarketListing[](
            activeListings.length
        );
        for (uint i = 0; i < activeListings.length; i++) {
            listingsArray[i] = marketListings[activeListings[i]];
        }
        return listingsArray;
    }

    // ====== GOVERNANCE FUNCTIONS ======
    function createProposal(
        ProposalType _proposalType,
        string calldata _description,
        address _targetAddress,
        uint256 _amount,
        uint256 _paramKey,
        uint256 _paramValue,
        string calldata _researchGrantDetailsIPFSHash
    ) public payable onlyRegisteredFarmer returns (uint256) {
        uint256 proposalStake = 0.01 ether;
        if (msg.value < proposalStake) {
            revert AfriCropDAO__InsufficientStake();
        }

        _proposalIds.increment();
        uint256 newProposalId = _proposalIds.current();

        Proposal storage proposal = proposals[newProposalId];
        proposal.id = newProposalId;
        proposal.proposer = msg.sender;
        proposal.proposalType = _proposalType;
        proposal.description = _description;
        proposal.stakeAmount = msg.value;
        proposal.startBlock = block.number;
        proposal.endBlock = _add(block.number, 1000);
        proposal.yesVotes = 0;
        proposal.noVotes = 0;
        proposal.executed = false;
        proposal.status = ProposalStatus.ACTIVE;
        proposal.targetAddress = _targetAddress;
        proposal.amount = _amount;
        proposal.paramKey = _paramKey;
        proposal.paramValue = _paramValue;
        proposal.researchGrantDetailsIPFSHash = _researchGrantDetailsIPFSHash;

        emit ProposalCreated(
            newProposalId,
            msg.sender,
            _proposalType,
            msg.value
        );
        return newProposalId;
    }

    function calculateVotingPower(
        address _farmerAddress
    ) public view returns (uint256) {
        Farmer memory farmer = farmers[_farmerAddress];
        if (!farmer.isRegistered) {
            return 0;
        }
        uint256 reputationSqrt = sqrt(farmer.reputationPoints);
        uint256 sustainabilityBonus = _div(farmer.sustainabilityScore, 100);
        uint256 knowledgeBonus = _div(farmer.knowledgePoints, 50);

        return
            _div(
                _mul(
                    reputationSqrt,
                    _add(100, _add(sustainabilityBonus, knowledgeBonus))
                ),
                100
            );
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = _div(_add(x, 1), 2);
        y = x;
        while (z < y) {
            y = z;
            z = _div(_add(_div(x, z), z), 2);
        }
    }

    function voteOnProposal(
        uint256 _proposalId,
        bool _vote
    ) public onlyRegisteredFarmer {
        Proposal storage proposal = proposals[_proposalId];
        if (proposal.id == 0) {
            revert AfriCropDAO__ProposalNotFound(_proposalId);
        }
        if (proposal.hasVoted[msg.sender]) {
            revert AfriCropDAO__AlreadyVoted(_proposalId);
        }
        if (
            block.number < proposal.startBlock ||
            block.number > proposal.endBlock
        ) {
            revert AfriCropDAO__VotingPeriodNotActive();
        }

        uint256 votingPower = calculateVotingPower(msg.sender);
        if (votingPower == 0) {
            revert AfriCropDAO__FarmerNotRegistered(msg.sender);
        }

        if (_vote) {
            proposal.yesVotes = _add(proposal.yesVotes, votingPower);
        } else {
            proposal.noVotes = _add(proposal.noVotes, votingPower);
        }
        proposal.hasVoted[msg.sender] = true;
        emit VoteCast(_proposalId, msg.sender, votingPower, _vote);
    }

    function executeProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        if (proposal.id == 0) {
            revert AfriCropDAO__ProposalNotFound(_proposalId);
        }
        if (block.number <= proposal.endBlock) {
            revert AfriCropDAO__ProposalNotExecutable();
        }
        if (proposal.executed) {
            revert AfriCropDAO__ProposalNotExecutable();
        }

        if (proposal.yesVotes > proposal.noVotes) {
            proposal.status = ProposalStatus.PASSED;
            if (proposal.proposalType == ProposalType.AdminChange) {
                transferOwnership(proposal.targetAddress);
            } else if (proposal.proposalType == ProposalType.FundAllocation) {
                require(
                    address(this).balance >= proposal.amount,
                    "Insufficient funds"
                );
                payable(proposal.targetAddress).transfer(proposal.amount);
                emit FundAllocationExecuted(
                    proposal.targetAddress,
                    proposal.amount
                );
            } else if (proposal.proposalType == ProposalType.ParameterChange) {
                emit ParameterChangeExecuted(
                    proposal.paramKey,
                    proposal.paramValue
                );
            }
            proposal.executed = true;
            emit ProposalExecuted(_proposalId);
        } else {
            proposal.status = ProposalStatus.FAILED;
        }
    }

    function getProposalStatus(
        uint256 _proposalId
    ) public view returns (ProposalStatus) {
        Proposal storage proposal = proposals[_proposalId];
        if (proposal.id == 0) {
            return ProposalStatus.PENDING;
        }
        if (proposal.executed) return ProposalStatus.EXECUTED;
        if (block.number > proposal.endBlock) {
            if (proposal.yesVotes > proposal.noVotes) {
                return ProposalStatus.PASSED;
            } else {
                return ProposalStatus.FAILED;
            }
        }
        return ProposalStatus.ACTIVE;
    }

    // ====== EDUCATION FUNCTIONS ======
    function addLesson(
        string calldata _ipfsHash,
        uint256 _knowledgePointsReward
    ) public onlyOwner {
        _lessonIds.increment();
        uint256 newLessonId = _lessonIds.current();
        lessons[newLessonId] = Lesson({
            id: newLessonId,
            ipfsHash: _ipfsHash,
            knowledgePointsReward: _knowledgePointsReward
        });
        emit LessonAdded(newLessonId, _ipfsHash, _knowledgePointsReward);
    }

    function completeLesson(uint256 _lessonId) public onlyRegisteredFarmer {
        if (completedLessons[msg.sender][_lessonId]) {
            revert AfriCropDAO__LessonAlreadyCompleted();
        }
        Lesson storage lesson = lessons[_lessonId];
        if (lesson.id == 0) {
            revert("Lesson not found");
        }

        completedLessons[msg.sender][_lessonId] = true;
        _updateKnowledgePoints(msg.sender, lesson.knowledgePointsReward, true);
        _updateReputation(
            msg.sender,
            _div(lesson.knowledgePointsReward, 2),
            true
        );

        emit LessonCompleted(
            msg.sender,
            _lessonId,
            lesson.knowledgePointsReward
        );
    }

    function getLesson(uint256 _lessonId) public view returns (Lesson memory) {
        return lessons[_lessonId];
    }

    // ====== MENTORSHIP FUNCTIONS ======
    function requestMentorship(
        address _mentorAddress
    ) public onlyRegisteredFarmer {
        if (farmers[msg.sender].knowledgePoints < 50) {
            revert AfriCropDAO__InsufficientReputationForMentorship();
        }
        if (farmers[_mentorAddress].reputationPoints < 500) {
            revert AfriCropDAO__InsufficientReputationForMentorship();
        }

        for (uint i = 0; i < activeMentorships[msg.sender].length; i++) {
            MentorshipSession storage existingSession = mentorshipSessions[
                activeMentorships[msg.sender][i]
            ];
            if (
                existingSession.mentor == _mentorAddress &&
                !existingSession.completed
            ) {
                revert AfriCropDAO__MentorAlreadyAssigned();
            }
        }

        _mentorshipIds.increment();
        uint256 newSessionId = _mentorshipIds.current();

        mentorshipSessions[newSessionId] = MentorshipSession({
            id: newSessionId,
            mentor: _mentorAddress,
            mentee: msg.sender,
            accepted: false,
            completed: false,
            startTimestamp: 0,
            endTimestamp: 0
        });

        activeMentorships[msg.sender].push(newSessionId);
        activeMentorships[_mentorAddress].push(newSessionId);
        emit MentorshipRequested(newSessionId, msg.sender, _mentorAddress);
    }

    function acceptMentorship(uint256 _sessionId) public onlyRegisteredFarmer {
        MentorshipSession storage session = mentorshipSessions[_sessionId];
        if (session.mentor != msg.sender || session.accepted) {
            revert("Not mentor or already accepted");
        }
        session.accepted = true;
        session.startTimestamp = block.timestamp;
        emit MentorshipAccepted(_sessionId);
    }

    function completeMentorship(
        uint256 _sessionId
    ) public onlyRegisteredFarmer {
        MentorshipSession storage session = mentorshipSessions[_sessionId];
        if (session.mentor != msg.sender && session.mentee != msg.sender) {
            revert AfriCropDAO__NotMentorOrMentee();
        }
        if (!session.accepted || session.completed) {
            revert AfriCropDAO__MentorshipNotCompleted();
        }

        session.completed = true;
        session.endTimestamp = block.timestamp;

        _updateReputation(session.mentor, 50, true);
        _updateKnowledgePoints(session.mentee, 30, true);
        _updateReputation(session.mentee, 20, true);

        emit MentorshipCompleted(_sessionId, session.mentor, session.mentee);
    }

    function getMentorshipSessions(
        address _farmerAddress
    ) public view returns (uint256[] memory) {
        return activeMentorships[_farmerAddress];
    }

    // Additional view functions for frontend
    function getCropTypes() external pure returns (string[11] memory) {
        return [
            "MAIZE",
            "RICE",
            "WHEAT",
            "CASSAVA",
            "BEANS",
            "SORGHUM",
            "MILLET",
            "YAM",
            "POTATOES",
            "COFFEE",
            "COTTON"
        ];
    }

    function getProposalTypes() external pure returns (string[4] memory) {
        return [
            "ADMIN_CHANGE",
            "FUND_ALLOCATION",
            "PARAMETER_CHANGE",
            "RESEARCH_GRANT"
        ];
    }

    // Add to AfriCropDAO.sol
    function getAllFarmers() external view returns (address[] memory) {
        return registeredFarmers;
    }

    function getSustainabilityScores()
        external
        view
        returns (address[] memory, uint256[] memory)
    {
        address[] memory farmersList = new address[](registeredFarmers.length);
        uint256[] memory scores = new uint256[](registeredFarmers.length);

        for (uint i = 0; i < registeredFarmers.length; i++) {
            farmersList[i] = registeredFarmers[i];
            scores[i] = farmers[registeredFarmers[i]].sustainabilityScore;
        }

        return (farmersList, scores);
    }

    function getTopCrops(uint256 limit) external view returns (Crop[] memory) {
        uint256 resultSize = limit > _cropIds.current()
            ? _cropIds.current()
            : limit;
        Crop[] memory result = new Crop[](resultSize);

        for (uint256 i = 1; i <= resultSize; i++) {
            result[i - 1] = crops[i];
        }

        return result;
    }
}
