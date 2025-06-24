const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("AfriCropDAO", function () {
  // Define enums to match contract
  const CropType = {
    MAIZE: 0,
    RICE: 1,
    WHEAT: 2,
    CASSAVA: 3,
    BEANS: 4,
    SORGHUM: 5,
    MILLET: 6,
    YAM: 7,
    POTATOES: 8,
    COFFEE: 9,
    COTTON: 10
  };

  const CropStage = {
    SOWN: 0,
    GROWING: 1,
    HARVESTED: 2,
    STORED: 3,
    SELLING: 4,
    SOLD: 5
  };

  const ProposalType = {
    AdminChange: 0,
    FundAllocation: 1,
    GeneralProposal: 2
  };

  describe("1. Deployment & Initial Setup", function () {
    let AfriCropDAO;
    let afriCropDAO;
    let owner;

    before(async function () {
      [owner] = await ethers.getSigners();
      AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");
      afriCropDAO = await AfriCropDAO.deploy();
    });

    it("should deploy with the correct owner", async function () {
      expect(await afriCropDAO.owner()).to.equal(owner.address);
    });

    it("should initialize crop sustainability scores", async function () {
      expect(await afriCropDAO.cropSustainabilityScores(CropType.MAIZE)).to.equal(4);
      expect(await afriCropDAO.cropSustainabilityScores(CropType.CASSAVA)).to.equal(7);
    });

    it("should initialize harvest points", async function () {
      expect(await afriCropDAO.cropHarvestPoints(CropType.MAIZE)).to.equal(1);
      expect(await afriCropDAO.cropHarvestPoints(CropType.COFFEE)).to.equal(4);
    });

    it("should return correct crop types", async function () {
      const cropTypes = await afriCropDAO.getCropTypes();
      expect(cropTypes).to.deep.equal([
        "MAIZE", "RICE", "WHEAT", "CASSAVA", "BEANS",
        "SORGHUM", "MILLET", "YAM", "POTATOES", "COFFEE", "COTTON"
      ]);
    });

    it("should return correct proposal types", async function () {
      const proposalTypes = await afriCropDAO.getProposalTypes();
      expect(proposalTypes).to.deep.equal(["ADMIN_CHANGE", "FUND_ALLOCATION", "GENERAL_PROPOSAL"]);
    });
  });

  describe("2. Farmer Management", function () {
    let AfriCropDAO;
    let afriCropDAO;
    let owner, farmer1, farmer2, nonFarmer;

    before(async function () {
      [owner, farmer1, farmer2, nonFarmer] = await ethers.getSigners();
      AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");
      afriCropDAO = await AfriCropDAO.deploy();
    });

    it("should allow farmers to register", async function () {
      await expect(afriCropDAO.connect(farmer1).registerFarmer())
        .to.emit(afriCropDAO, "FarmerRegistered")
        .withArgs(farmer1.address, 200);
      
      const farmer = await afriCropDAO.getFarmerProfile(farmer1.address);
      expect(farmer.isRegistered).to.be.true;
    });

    it("should prevent duplicate registration with custom error", async function () {
      await expect(
        afriCropDAO.connect(farmer1).registerFarmer()
      ).to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__AlreadyRegistered");
    });

    it("should return registered farmers", async function () {
      await afriCropDAO.connect(farmer2).registerFarmer();
      
      const farmers = await afriCropDAO.getRegisteredFarmers();
      expect(farmers).to.include(farmer2.address);
    });

    it("should prevent non-registered farmers from farmer-only functions", async function () {
      await expect(
        afriCropDAO.connect(nonFarmer).sowCrop(CropType.MAIZE, "farm123", 100)
      ).to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__FarmerNotRegistered");
    });

    it("should return farmer profiles", async function () {
      const profile = await afriCropDAO.getFarmerProfile(farmer1.address);
      expect(profile.walletAddress).to.equal(farmer1.address);
    });

    it("should return farmer history", async function () {
      const history = await afriCropDAO.getFarmerHistory(farmer1.address);
      expect(history.length).to.be.gt(0);
    });

    it("should return top farmers by sustainability", async function () {
      await afriCropDAO.connect(farmer1).sowCrop(CropType.CASSAVA, "farm1", 100);
      await afriCropDAO.connect(farmer1).updateCropStage(1, CropStage.GROWING, 0);
      
      const [topFarmers, scores] = await afriCropDAO.getTopFarmersBySustainability(2);
      expect(topFarmers.length).to.equal(2);
    });
  });

  describe("3. Treasury Functions", function () {
    let AfriCropDAO;
    let afriCropDAO;
    let owner, testFarmer;

    beforeEach(async function () {
      [owner, testFarmer] = await ethers.getSigners();
      AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");
      afriCropDAO = await AfriCropDAO.deploy();
      await afriCropDAO.connect(testFarmer).registerFarmer();
    });

    it("should accept donations to treasury", async function () {
      const donationAmount = ethers.parseEther("1.0");
      await expect(
        afriCropDAO.connect(testFarmer).donateToTreasury({ value: donationAmount })
      )
        .to.emit(afriCropDAO, "TreasuryDonation")
        .withArgs(testFarmer.address, donationAmount, anyValue);
    });

    it("should prevent zero donations", async function () {
      await expect(
        afriCropDAO.connect(testFarmer).donateToTreasury({ value: 0 })
      ).to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__InvalidDonationAmount");
    });

    it("should allow owner to withdraw funds", async function () {
      const donationAmount = ethers.parseEther("1.0");
      await afriCropDAO.connect(testFarmer).donateToTreasury({ value: donationAmount });
      
      const withdrawAmount = ethers.parseEther("0.5");
      await expect(
        afriCropDAO.connect(owner).withdrawDAOFunds(owner.address, withdrawAmount)
      ).to.emit(afriCropDAO, "TreasuryWithdrawn");
    });
  });

  describe("4. Crop Lifecycle Management", function () {
    let AfriCropDAO;
    let afriCropDAO;
    let testFarmer;
    let cropId;

    beforeEach(async function () {
      [testFarmer] = await ethers.getSigners();
      AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");
      afriCropDAO = await AfriCropDAO.deploy();
      await afriCropDAO.connect(testFarmer).registerFarmer();
      await afriCropDAO.connect(testFarmer).sowCrop(CropType.MAIZE, "farm123", 100);
      cropId = 1;
    });

    it("should allow sowing crops", async function () {
      const crop = await afriCropDAO.crops(cropId);
      expect(crop.farmerAddress).to.equal(testFarmer.address);
    });

    it("should update crop stage from SOWN to GROWING", async function () {
      await expect(
        afriCropDAO.connect(testFarmer).updateCropStage(cropId, CropStage.GROWING, 0)
      ).to.emit(afriCropDAO, "CropStageUpdated");
    });

    it("should allow storing harvested crops", async function () {
      await afriCropDAO.connect(testFarmer).updateCropStage(cropId, CropStage.GROWING, 0);
      await afriCropDAO.connect(testFarmer).updateCropStage(cropId, CropStage.HARVESTED, 10);
      
      await expect(
        afriCropDAO.connect(testFarmer).storeCrop(cropId)
      ).to.emit(afriCropDAO, "CropStored");
    });
  });

  describe("5. Marketplace Functions", function () {
    let AfriCropDAO;
    let afriCropDAO;
    let seller, buyer;
    let cropId, listingId;

    beforeEach(async function () {
      [seller, buyer] = await ethers.getSigners();
      AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");
      afriCropDAO = await AfriCropDAO.deploy();
      await afriCropDAO.connect(seller).registerFarmer();
      await afriCropDAO.connect(buyer).registerFarmer();
      
      await afriCropDAO.connect(seller).sowCrop(CropType.MAIZE, "farm123", 100);
      cropId = 1;
      await afriCropDAO.connect(seller).updateCropStage(cropId, CropStage.GROWING, 0);
      await afriCropDAO.connect(seller).updateCropStage(cropId, CropStage.HARVESTED, 10);
      await afriCropDAO.connect(seller).storeCrop(cropId);
      
      await afriCropDAO.connect(seller).listCropForSale(cropId, ethers.parseEther("0.1"), 50);
      listingId = 1;
    });

    it("should allow listing crops for sale", async function () {
      const listing = await afriCropDAO.marketListings(listingId);
      expect(listing.isActive).to.be.true;
    });

    it("should allow purchasing listed crops", async function () {
      await expect(
        afriCropDAO.connect(buyer).purchaseCrop(listingId, { value: ethers.parseEther("0.1") })
      ).to.emit(afriCropDAO, "CropPurchased");
    });
  });

  describe("6. Governance Functions", function () {
    let AfriCropDAO;
    let afriCropDAO;
    let testFarmer1, testFarmer2;
    let proposalId;

    beforeEach(async function () {
      [testFarmer1, testFarmer2] = await ethers.getSigners();
      AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");
      afriCropDAO = await AfriCropDAO.deploy();
      await afriCropDAO.connect(testFarmer1).registerFarmer();
      await afriCropDAO.connect(testFarmer2).registerFarmer();
      
      await afriCropDAO.connect(testFarmer1).createProposal(
        "Test Proposal",
        ProposalType.AdminChange,
        "Test description",
        testFarmer2.address,
        0,
        { value: ethers.parseEther("0.01") }
      );
      proposalId = 1;
    });

    it("should allow creating a proposal with stake", async function () {
      const proposal = await afriCropDAO.proposals(proposalId);
      expect(proposal.proposer).to.equal(testFarmer1.address);
    });

    it("should allow voting on proposals", async function () {
      await expect(
        afriCropDAO.connect(testFarmer2).voteOnProposal(proposalId, true)
      ).to.emit(afriCropDAO, "VoteCast");
    });
  });

  describe("7. Education Functions", function () {
    let AfriCropDAO;
    let afriCropDAO;
    let owner, testFarmer;
    let lessonId;

    beforeEach(async function () {
      [owner, testFarmer] = await ethers.getSigners();
      AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");
      afriCropDAO = await AfriCropDAO.deploy();
      await afriCropDAO.connect(testFarmer).registerFarmer();
      
      await afriCropDAO.connect(owner).addLesson(
        "Test Lesson",
        "Content",
        "Q1", "A", "B", "C",
        "Q2", "A", "B", "C",
        "Q3", "A", "B", "C",
        10
      );
      lessonId = 1;
    });

    it("should allow owner to add lessons", async function () {
      const lesson = await afriCropDAO.getLesson(lessonId);
      expect(lesson.title).to.equal("Test Lesson");
    });

    it("should allow farmers to complete lessons", async function () {
      await expect(
        afriCropDAO.connect(testFarmer).completeLesson(lessonId)
      ).to.emit(afriCropDAO, "LessonCompleted");
    });
  });

  describe("8. Additional View Functions", function () {
    let AfriCropDAO;
    let afriCropDAO;
    let testFarmer1, testFarmer2;

    beforeEach(async function () {
      [testFarmer1, testFarmer2] = await ethers.getSigners();
      AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");
      afriCropDAO = await AfriCropDAO.deploy();
      await afriCropDAO.connect(testFarmer1).registerFarmer();
      await afriCropDAO.connect(testFarmer2).registerFarmer();
    });

    it("should return all farmers", async function () {
      const farmers = await afriCropDAO.getAllFarmers();
      expect(farmers).to.include(testFarmer1.address);
    });

    it("should return sustainability scores", async function () {
      const [farmers, scores] = await afriCropDAO.getSustainabilityScores();
      expect(farmers.length).to.equal(2);
    });
  });

  // Helper for anyValue assertion
  function anyValue() {
    return true;
  }
});