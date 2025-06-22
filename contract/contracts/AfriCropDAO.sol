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
    error AfriCropDAO__NotStored(uint256 cropId);
    error AfriCropDAO__NotSelling(uint256 cropId);
    error AfriCropDAO__ZeroAmount();
    error AfriCropDAO__InsufficientFunds();
    error AfriCropDAO__ListingNotFound(uint256 listingId);
    error AfriCropDAO__NotListingOwner(uint256 listingId);
    error AfriCropDAO__ProposalNotFound(uint256 proposalId);
    error AfriCropDAO__ProposalNotExecutable();
    error AfriCropDAO__AlreadyVoted(uint256 proposalId);
    error AfriCropDAO__StakeRequired(uint256 requiredStake);
    error AfriCropDAO__InsufficientStake();
    error AfriCropDAO__AlreadyRegistered();
    error AfriCropDAO__LessonAlreadyCompleted();
    error AfriCropDAO__InsufficientReputationForMentorship();
    error AfriCropDAO__InvalidDonationAmount();
    error AfriCropDAO__NotEnoughInSilo(uint256 available, uint256 requested);

    // ====== CORE STRUCTURES ======
    enum CropStage {
        SOWN,
        GROWING,
        HARVESTED,
        STORED,
        SELLING,
        SOLD
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
        FundAllocation
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
        string title;
        ProposalType proposalType;
        string description;
        uint256 stakeAmount;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        ProposalStatus status;
        mapping(address => bool) hasVoted;
        address targetAddress;
        uint256 amount;
    }

    // Add this new view struct
    struct ProposalView {
        uint256 id;
        address proposer;
        string title;
        ProposalType proposalType;
        string description;
        uint256 stakeAmount;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        ProposalStatus status;
        address targetAddress;
        uint256 amount;
    }

    struct Lesson {
        uint256 id;
        string title;
        string content;
        string question1;
        string option1A;
        string option1B;
        string option1C;
        string question2;
        string option2A;
        string option2B;
        string option2C;
        string question3;
        string option3A;
        string option3B;
        string option3C;
        uint256 knowledgePointsReward;
    }

    // ====== STATE VARIABLES ======
    uint256 public constant DAO_FEE_PERCENT = 10;
    Counters.Counter private _cropIds;
    Counters.Counter private _listingIds;
    Counters.Counter private _proposalIds;
    Counters.Counter private _lessonIds;

    mapping(address => Farmer) public farmers;
    address[] public registeredFarmers;
    mapping(uint256 => Crop) public crops;
    mapping(address => uint256[]) public farmerCrops;
    mapping(address => uint256[]) public farmerStoredCrops;
    mapping(uint256 => MarketListing) public marketListings;
    uint256[] public activeListings;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Lesson) public lessons;
    mapping(address => mapping(uint256 => bool)) public completedLessons;

    // Sustainability scores per crop type (per plant)
    mapping(CropType => uint256) public cropSustainabilityScores;

    // Harvest points per crop type (per plant)
    mapping(CropType => uint256) public cropHarvestPoints;

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
    event CropStored(
        uint256 indexed cropId,
        address indexed farmerAddress,
        uint256 quantity
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
        string title,
        ProposalType proposalType,
        uint256 stake
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool vote
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event LessonAdded(
        uint256 indexed lessonId,
        string title,
        uint256 knowledgePointsReward
    );
    event LessonCompleted(
        address indexed farmerAddress,
        uint256 indexed lessonId,
        uint256 knowledgePointsEarned
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
    event TreasuryWithdrawn(address indexed recipient, uint256 amount);
    event TreasuryDonation(address indexed donor, uint256 amount); // Added this event

    constructor() {
        _transferOwnership(msg.sender);

        // Initialize crop sustainability scores (per plant)
        cropSustainabilityScores[CropType.MAIZE] = 4;
        cropSustainabilityScores[CropType.RICE] = 3;
        cropSustainabilityScores[CropType.WHEAT] = 5;
        cropSustainabilityScores[CropType.CASSAVA] = 7;
        cropSustainabilityScores[CropType.BEANS] = 8;
        cropSustainabilityScores[CropType.SORGHUM] = 6;
        cropSustainabilityScores[CropType.MILLET] = 7;
        cropSustainabilityScores[CropType.YAM] = 6;
        cropSustainabilityScores[CropType.POTATOES] = 5;
        cropSustainabilityScores[CropType.COFFEE] = 3;
        cropSustainabilityScores[CropType.COTTON] = 2;

        // Initialize harvest points (per plant)
        cropHarvestPoints[CropType.MAIZE] = 1;
        cropHarvestPoints[CropType.RICE] = 1;
        cropHarvestPoints[CropType.WHEAT] = 2;
        cropHarvestPoints[CropType.CASSAVA] = 3;
        cropHarvestPoints[CropType.BEANS] = 2;
        cropHarvestPoints[CropType.SORGHUM] = 2;
        cropHarvestPoints[CropType.MILLET] = 2;
        cropHarvestPoints[CropType.YAM] = 3;
        cropHarvestPoints[CropType.POTATOES] = 2;
        cropHarvestPoints[CropType.COFFEE] = 4;
        cropHarvestPoints[CropType.COTTON] = 1;
    }

    // ====== MODIFIERS ======
    modifier onlyRegisteredFarmer() {
        if (!farmers[msg.sender].isRegistered) {
            revert AfriCropDAO__FarmerNotRegistered(msg.sender);
        }
        _;
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
            reputationPoints: 200, // Increased initial reputation
            sustainabilityScore: 0,
            knowledgePoints: 0,
            harvestPoints: 0,
            lastProposalStakeTime: 0,
            isRegistered: true
        });
        registeredFarmers.push(msg.sender);
        emit FarmerRegistered(msg.sender, 200);
    }

    function getFarmerProfile(
        address _farmerAddress
    ) public view returns (Farmer memory) {
        return farmers[_farmerAddress];
    }

    function getRegisteredFarmers() public view returns (address[] memory) {
        return registeredFarmers;
    }

    function getTopFarmersBySustainability(
        uint256 limit
    ) public view returns (address[] memory, uint256[] memory) {
        uint256 resultSize = limit > registeredFarmers.length
            ? registeredFarmers.length
            : limit;
        address[] memory topFarmers = new address[](resultSize);
        uint256[] memory scores = new uint256[](resultSize);

        // This is a simplified version - in production you'd want to sort properly
        for (uint i = 0; i < resultSize; i++) {
            topFarmers[i] = registeredFarmers[i];
            scores[i] = farmers[registeredFarmers[i]].sustainabilityScore;
        }

        return (topFarmers, scores);
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
        CropStage _newStage,
        uint256 _lossPercentage // New parameter added (0-100)
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
            uint256 sustainabilityPoints = _mul(
                crop.initialSeeds,
                cropSustainabilityScores[crop.cropType]
            );
            _updateSustainabilityScore(msg.sender, sustainabilityPoints, true);
        } else if (_newStage == CropStage.HARVESTED) {
            if (crop.stage != CropStage.GROWING) {
                revert AfriCropDAO__InvalidCropStage(
                    _cropId,
                    CropStage.GROWING
                );
            }
            require(_lossPercentage <= 100, "Loss percentage too high"); // Safety check

            crop.harvestedTimestamp = block.timestamp;
            crop.harvestedOutput =
                _mul(crop.initialSeeds, (100 - _lossPercentage)) /
                100; // Dynamic loss

            uint256 harvestPoints = _mul(
                crop.harvestedOutput,
                cropHarvestPoints[crop.cropType]
            );
            _updateHarvestPoints(msg.sender, harvestPoints, true);
            _updateReputation(msg.sender, _div(harvestPoints, 10), true);
        }

        crop.stage = _newStage;
        emit CropStageUpdated(_cropId, _newStage, block.timestamp);
    }

    function storeCrop(uint256 _cropId) public onlyRegisteredFarmer {
        Crop storage crop = crops[_cropId];
        if (crop.farmerAddress != msg.sender) {
            revert AfriCropDAO__NotCropOwner(msg.sender, _cropId);
        }
        if (crop.stage != CropStage.HARVESTED) {
            revert AfriCropDAO__NotHarvested(_cropId);
        }

        crop.stage = CropStage.STORED;

        // Remove from farmerCrops and add to farmerStoredCrops
        uint256[] storage cropsList = farmerCrops[msg.sender];
        for (uint i = 0; i < cropsList.length; i++) {
            if (cropsList[i] == _cropId) {
                cropsList[i] = cropsList[cropsList.length - 1];
                cropsList.pop();
                break;
            }
        }
        farmerStoredCrops[msg.sender].push(_cropId);

        emit CropStored(_cropId, msg.sender, crop.harvestedOutput);
    }

    function getFarmerCrops(
        address _farmerAddress
    ) public view returns (uint256[] memory) {
        return farmerCrops[_farmerAddress];
    }

    function getFarmerStoredCrops(
        address _farmerAddress
    ) public view returns (uint256[] memory) {
        return farmerStoredCrops[_farmerAddress];
    }

    // ====== MARKETPLACE FUNCTIONS ======
    function listCropForSale(
        uint256 _cropId,
        uint256 _priceInWei,
        uint256 _quantityToSell
    ) public onlyRegisteredFarmer {
        Crop storage crop = crops[_cropId];
        if (crop.farmerAddress != msg.sender) {
            revert AfriCropDAO__NotCropOwner(msg.sender, _cropId);
        }
        if (crop.stage != CropStage.STORED) {
            revert AfriCropDAO__NotStored(_cropId);
        }
        if (_priceInWei == 0 || _quantityToSell == 0) {
            revert AfriCropDAO__ZeroAmount();
        }
        if (_quantityToSell > crop.harvestedOutput) {
            revert AfriCropDAO__NotEnoughInSilo(
                crop.harvestedOutput,
                _quantityToSell
            );
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

        activeListings.push(newListingId);
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

        // Transfer the crop to buyer's stored crops
        crop.farmerAddress = msg.sender;
        crop.stage = CropStage.STORED;

        // Remove from seller's stored crops and add to buyer's stored crops
        uint256[] storage sellerStored = farmerStoredCrops[listing.seller];
        for (uint i = 0; i < sellerStored.length; i++) {
            if (sellerStored[i] == listing.cropId) {
                sellerStored[i] = sellerStored[sellerStored.length - 1];
                sellerStored.pop();
                break;
            }
        }
        farmerStoredCrops[msg.sender].push(listing.cropId);

        listing.isActive = false;

        // Remove from active listings
        for (uint i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == _listingId) {
                activeListings[i] = activeListings[activeListings.length - 1];
                activeListings.pop();
                break;
            }
        }

        // Award harvest points to seller (double points)
        _updateHarvestPoints(
            listing.seller,
            _div(listing.quantityToSell, 5),
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
        crops[listing.cropId].stage = CropStage.STORED;

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
        string calldata _title,
        ProposalType _proposalType,
        string calldata _description,
        address _targetAddress,
        uint256 _amount
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
        proposal.title = _title;
        proposal.proposalType = _proposalType;
        proposal.description = _description;
        proposal.stakeAmount = msg.value;
        proposal.yesVotes = 0;
        proposal.noVotes = 0;
        proposal.executed = false;
        proposal.status = ProposalStatus.ACTIVE;
        proposal.targetAddress = _targetAddress;
        proposal.amount = _amount;

        farmers[msg.sender].lastProposalStakeTime = block.timestamp;

        emit ProposalCreated(
            newProposalId,
            msg.sender,
            _title,
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
        uint256 sustainabilityBonus = _div(farmer.sustainabilityScore, 50); // More impactful
        uint256 knowledgeBonus = _div(farmer.knowledgePoints, 20); // More impactful

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
        if (proposal.status != ProposalStatus.ACTIVE) {
            revert AfriCropDAO__ProposalNotExecutable();
        }

        if (_vote) {
            proposal.yesVotes += 1;
        } else {
            proposal.noVotes += 1;
        }
        proposal.hasVoted[msg.sender] = true;
        emit VoteCast(_proposalId, msg.sender, _vote);
    }

    function executeProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        if (proposal.id == 0) {
            revert AfriCropDAO__ProposalNotFound(_proposalId);
        }
        if (proposal.executed) {
            revert AfriCropDAO__ProposalNotExecutable();
        }

        uint256 totalVotes = _add(proposal.yesVotes, proposal.noVotes);
        uint256 requiredVotes = _div(_mul(registeredFarmers.length, 2), 3); // 2/3 of registered farmers

        if (totalVotes >= requiredVotes) {
            if (proposal.yesVotes > proposal.noVotes) {
                proposal.status = ProposalStatus.PASSED;
                if (proposal.proposalType == ProposalType.AdminChange) {
                    transferOwnership(proposal.targetAddress);
                } else if (
                    proposal.proposalType == ProposalType.FundAllocation
                ) {
                    require(
                        address(this).balance >= proposal.amount,
                        "Insufficient funds"
                    );
                    payable(proposal.targetAddress).transfer(proposal.amount);
                    emit FundAllocationExecuted(
                        proposal.targetAddress,
                        proposal.amount
                    );
                }
                proposal.executed = true;

                // Return stake to proposer
                payable(proposal.proposer).transfer(proposal.stakeAmount);

                emit ProposalExecuted(_proposalId);
            } else {
                proposal.status = ProposalStatus.FAILED;
                // Return stake to proposer even if failed
                payable(proposal.proposer).transfer(proposal.stakeAmount);
            }
        } else {
            revert AfriCropDAO__ProposalNotExecutable();
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
        if (proposal.yesVotes > proposal.noVotes) {
            return ProposalStatus.PASSED;
        } else if (proposal.noVotes > proposal.yesVotes) {
            return ProposalStatus.FAILED;
        }
        return ProposalStatus.ACTIVE;
    }

    // ====== EDUCATION FUNCTIONS ======
    function addLesson(
        string calldata _title,
        string calldata _content,
        string calldata _question1,
        string calldata _option1A,
        string calldata _option1B,
        string calldata _option1C,
        string calldata _question2,
        string calldata _option2A,
        string calldata _option2B,
        string calldata _option2C,
        string calldata _question3,
        string calldata _option3A,
        string calldata _option3B,
        string calldata _option3C,
        uint256 _knowledgePointsReward
    ) public onlyOwner {
        _lessonIds.increment();
        uint256 newLessonId = _lessonIds.current();
        lessons[newLessonId] = Lesson({
            id: newLessonId,
            title: _title,
            content: _content,
            question1: _question1,
            option1A: _option1A,
            option1B: _option1B,
            option1C: _option1C,
            question2: _question2,
            option2A: _option2A,
            option2B: _option2B,
            option2C: _option2C,
            question3: _question3,
            option3A: _option3A,
            option3B: _option3B,
            option3C: _option3C,
            knowledgePointsReward: _knowledgePointsReward
        });
        emit LessonAdded(newLessonId, _title, _knowledgePointsReward);
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
        _updateReputation(msg.sender, lesson.knowledgePointsReward, true); // Full reward

        emit LessonCompleted(
            msg.sender,
            _lessonId,
            lesson.knowledgePointsReward
        );
    }

    function getLesson(uint256 _lessonId) public view returns (Lesson memory) {
        return lessons[_lessonId];
    }

    function getAllLessons() public view returns (Lesson[] memory) {
        uint256 totalLessons = _lessonIds.current();
        Lesson[] memory allLessons = new Lesson[](totalLessons);

        for (uint i = 1; i <= totalLessons; i++) {
            allLessons[i - 1] = lessons[i];
        }

        return allLessons;
    }

    // ====== VIEW FUNCTIONS ======
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

    function getProposalTypes() external pure returns (string[2] memory) {
        return ["ADMIN_CHANGE", "FUND_ALLOCATION"];
    }

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

    function getActiveProposals()
        external
        view
        returns (ProposalView[] memory)
    {
        uint256 totalProposals = _proposalIds.current();
        uint256 activeCount = 0;

        // Count active proposals
        for (uint i = 1; i <= totalProposals; i++) {
            if (proposals[i].status == ProposalStatus.ACTIVE) {
                activeCount++;
            }
        }

        // Create and populate the array
        ProposalView[] memory activeProposals = new ProposalView[](activeCount);
        uint256 index = 0;
        for (uint i = 1; i <= totalProposals; i++) {
            if (proposals[i].status == ProposalStatus.ACTIVE) {
                Proposal storage p = proposals[i];
                activeProposals[index] = ProposalView({
                    id: p.id,
                    proposer: p.proposer,
                    title: p.title,
                    proposalType: p.proposalType,
                    description: p.description,
                    stakeAmount: p.stakeAmount,
                    yesVotes: p.yesVotes,
                    noVotes: p.noVotes,
                    executed: p.executed,
                    status: p.status,
                    targetAddress: p.targetAddress,
                    amount: p.amount
                });
                index++;
            }
        }

        return activeProposals;
    }
}
