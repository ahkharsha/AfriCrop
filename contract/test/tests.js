const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AfriCropDAO", function () {
  let AfriCropDAO;
  let africropDAO;
  let owner;
  let farmer1;
  let farmer2;

  before(async function () {
    [owner, farmer1, farmer2] = await ethers.getSigners();

    // Deploy contract
    AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");
    africropDAO = await AfriCropDAO.deploy();
    await africropDAO.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await africropDAO.owner()).to.equal(owner.address);
    });
  });

  describe("Farmer Registration", function () {
    it("Should allow farmers to register", async function () {
      await africropDAO.connect(farmer1).registerFarmer();
      const farmer = await africropDAO.getFarmerProfile(farmer1.address);
      expect(farmer.isRegistered).to.be.true;
      expect(farmer.reputationPoints).to.equal(200);
    });

    it("Should prevent duplicate registration", async function () {
      await expect(africropDAO.connect(farmer1).registerFarmer())
        .to.be.revertedWithCustomError(africropDAO, "AfriCropDAO__AlreadyRegistered");
    });
  });

  describe("Crop Management", function () {
    let cropId;

    it("Should allow sowing crops", async function () {
      const tx = await africropDAO.connect(farmer1).sowCrop(
        0, // MAIZE
        "farm123",
        100 // initial seeds
      );
      await expect(tx)
        .to.emit(africropDAO, "CropSown")
        .withArgs(1, farmer1.address, 0, "farm123", anyValue);

      cropId = 1;
    });

    it("Should allow progressing crop stages", async function () {
      // SOWN -> GROWING
      await africropDAO.connect(farmer1).updateCropStage(cropId, 1);
      let crop = await africropDAO.crops(cropId);
      expect(crop.stage).to.equal(1); // GROWING

      // GROWING -> HARVESTED
      await africropDAO.connect(farmer1).updateCropStage(cropId, 2);
      crop = await africropDAO.crops(cropId);
      expect(crop.stage).to.equal(2); // HARVESTED
      expect(crop.harvestedOutput).to.be.gt(0);
    });

    it("Should allow storing harvested crops", async function () {
      await africropDAO.connect(farmer1).storeCrop(cropId);
      const crop = await africropDAO.crops(cropId);
      expect(crop.stage).to.equal(3); // STORED

      const storedCrops = await africropDAO.getFarmerStoredCrops(farmer1.address);
      expect(storedCrops.length).to.equal(1);
    });
  });

  describe("Marketplace", function () {
    let listingId;
    const price = ethers.utils.parseEther("0.1");
    const quantity = 50;

    it("Should allow listing crops for sale", async function () {
      const storedCrops = await africropDAO.getFarmerStoredCrops(farmer1.address);
      const cropId = storedCrops[0];

      await africropDAO.connect(farmer1).listCropForSale(
        cropId,
        price,
        quantity
      );

      listingId = 1;
      const listing = await africropDAO.marketListings(listingId);
      expect(listing.isActive).to.be.true;
    });

    it("Should allow purchasing crops", async function () {
      await africropDAO.connect(farmer2).registerFarmer();
      
      await expect(
        africropDAO.connect(farmer2).purchaseCrop(listingId, { value: price })
      )
        .to.emit(africropDAO, "CropPurchased")
        .withArgs(listingId, anyValue, farmer2.address, farmer1.address, price, anyValue);

      // Verify crop is now with buyer
      const storedCrops = await africropDAO.getFarmerStoredCrops(farmer2.address);
      expect(storedCrops.length).to.equal(1);
    });
  });

  describe("Governance", function () {
    let proposalId;
    const stakeAmount = ethers.utils.parseEther("0.01");

    it("Should allow creating proposals with stake", async function () {
      await expect(
        africropDAO.connect(farmer1).createProposal(
          "Change DAO Fee",
          1, // FundAllocation
          "Proposal to change DAO fee to 5%",
          farmer2.address,
          ethers.utils.parseEther("1"),
          { value: stakeAmount }
        )
      )
        .to.emit(africropDAO, "ProposalCreated")
        .withArgs(1, farmer1.address, "Change DAO Fee", 1, stakeAmount);

      proposalId = 1;
    });

    it("Should allow voting on proposals", async function () {
      await africropDAO.connect(farmer2).voteOnProposal(proposalId, true);
      const proposal = await africropDAO.proposals(proposalId);
      expect(proposal.yesVotes).to.equal(1);
    });

    it("Should execute successful proposals", async function () {
      // Need more votes to reach 2/3 majority
      await africropDAO.connect(owner).voteOnProposal(proposalId, true);
      
      await expect(africropDAO.executeProposal(proposalId))
        .to.emit(africropDAO, "ProposalExecuted")
        .withArgs(proposalId);
    });
  });

  describe("Education System", function () {
    let lessonId = 1;

    it("Should allow owner to add lessons", async function () {
      await africropDAO.connect(owner).addLesson(
        "Sustainable Farming",
        "Content about sustainable practices...",
        "Question 1?", "Correct", "Wrong1", "Wrong2",
        "Question 2?", "Correct", "Wrong1", "Wrong2",
        "Question 3?", "Correct", "Wrong1", "Wrong2",
        100 // points
      );

      const lesson = await africropDAO.getLesson(lessonId);
      expect(lesson.title).to.equal("Sustainable Farming");
    });

    it("Should allow farmers to complete lessons", async function () {
      await africropDAO.connect(farmer1).completeLesson(lessonId);
      const completed = await africropDAO.completedLessons(farmer1.address, lessonId);
      expect(completed).to.be.true;

      const farmer = await africropDAO.getFarmerProfile(farmer1.address);
      expect(farmer.knowledgePoints).to.equal(100);
      expect(farmer.reputationPoints).to.equal(300); // Initial 200 + 100 from lesson
    });
  });

  // Helper function for anyValue assertions
  function anyValue() {
    return true;
  }
});