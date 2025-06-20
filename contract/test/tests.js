const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AfriCropDAO", function () {
    let afriCropDAO;
    let owner;
    let farmer1;
    let farmer2;
    let treasury;
    let addrs;

    // Enum values for CropStage and ProposalType from the contract
    const CropStage = {
        SOWN: 0,
        GROWING: 1,
        HARVESTED: 2,
        SELLING: 3,
        SOLD: 4,
        CANCELLED: 5
    };

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

    const ProposalType = {
        AdminChange: 0,
        FundAllocation: 1,
        ParameterChange: 2,
        ResearchGrant: 3
    };

    beforeEach(async function () {
        [owner, farmer1, farmer2, treasury, ...addrs] = await ethers.getSigners();

        const AfriCropDAOFactory = await ethers.getContractFactory("AfriCropDAO");
        afriCropDAO = await AfriCropDAOFactory.deploy(owner.address, treasury.address);
        await afriCropDAO.waitForDeployment(); // Use waitForDeployment

        // Register farmers
        await afriCropDAO.connect(farmer1).registerFarmer();
        await afriCropDAO.connect(farmer2).registerFarmer();
    });

    describe("Farmer Registration", function () {
        it("Should register a farmer and set initial reputation", async function () {
            const farmerProfile = await afriCropDAO.farmers(farmer1.address);
            expect(farmerProfile.isRegistered).to.be.true;
            expect(farmerProfile.reputationPoints).to.equal(100);
            expect(await afriCropDAO.getRegisteredFarmers()).to.include(farmer1.address);
        });

        it("Should not allow already registered farmer to register again", async function () {
            await expect(afriCropDAO.connect(farmer1).registerFarmer())
                .to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__AlreadyRegistered");
        });
    });

    describe("Crop Management", function () {
        it("Should allow a registered farmer to sow a crop", async function () {
            await expect(afriCropDAO.connect(farmer1).sowCrop(CropType.MAIZE, "FarmA1", 100))
                .to.emit(afriCropDAO, "CropSown")
                .withArgs(1, farmer1.address, CropType.MAIZE, "FarmA1", (await ethers.provider.getBlock("latest")).timestamp);

            const crop = await afriCropDAO.crops(1);
            expect(crop.farmerAddress).to.equal(farmer1.address);
            expect(crop.cropType).to.equal(CropType.MAIZE);
            expect(crop.stage).to.equal(CropStage.SOWN);
        });

        it("Should not allow unregistered farmer to sow a crop", async function () {
            await expect(afriCropDAO.connect(addrs[0]).sowCrop(CropType.RICE, "FarmB2", 50))
                .to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__FarmerNotRegistered");
        });

        it("Should allow owner to update crop stage from SOWN to GROWING", async function () {
            await afriCropDAO.connect(farmer1).sowCrop(CropType.MAIZE, "FarmA1", 100);
            await expect(afriCropDAO.connect(farmer1).updateCropStage(1, CropStage.GROWING))
                .to.emit(afriCropDAO, "CropStageUpdated")
                .withArgs(1, CropStage.GROWING, (await ethers.provider.getBlock("latest")).timestamp);
            const crop = await afriCropDAO.crops(1);
            expect(crop.stage).to.equal(CropStage.GROWING);
        });

        it("Should allow owner to update crop stage from GROWING to HARVESTED", async function () {
            await afriCropDAO.connect(farmer1).sowCrop(CropType.MAIZE, "FarmA1", 100);
            await afriCropDAO.connect(farmer1).updateCropStage(1, CropStage.GROWING);
            await expect(afriCropDAO.connect(farmer1).updateCropStage(1, CropStage.HARVESTED))
                .to.emit(afriCropDAO, "CropStageUpdated")
                .withArgs(1, CropStage.HARVESTED, (await ethers.provider.getBlock("latest")).timestamp);
            const crop = await afriCropDAO.crops(1);
            expect(crop.stage).to.equal(CropStage.HARVESTED);
            expect(crop.harvestedTimestamp).to.not.equal(0);
        });

        it("Should not allow updating crop stage out of order (e.g., SOWN to HARVESTED directly)", async function () {
            await afriCropDAO.connect(farmer1).sowCrop(CropType.MAIZE, "FarmA1", 100);
            await expect(afriCropDAO.connect(farmer1).updateCropStage(1, CropStage.HARVESTED))
                .to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__InvalidCropStage")
                .withArgs(1, CropStage.GROWING); // Expecting GROWING
        });

        it("Should not allow non-owner to update crop stage", async function () {
            await afriCropDAO.connect(farmer1).sowCrop(CropType.MAIZE, "FarmA1", 100);
            await expect(afriCropDAO.connect(farmer2).updateCropStage(1, CropStage.GROWING))
                .to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__NotCropOwner");
        });
    });

    describe("Marketplace", function () {
        beforeEach(async function () {
            await afriCropDAO.connect(farmer1).sowCrop(CropType.MAIZE, "FarmA1", 100);
            await afriCropDAO.connect(farmer1).updateCropStage(1, CropStage.GROWING);
            await afriCropDAO.connect(farmer1).updateCropStage(1, CropStage.HARVESTED);
        });

        it("Should allow a farmer to list a harvested crop for sale", async function () {
            await expect(afriCropDAO.connect(farmer1).listCropForSale(1, ethers.parseEther("0.1"), 80, 20)) // 20% plants died off
                .to.emit(afriCropDAO, "CropListed")
                .withArgs(1, 1, farmer1.address, ethers.parseEther("0.1"), 80);

            const listing = await afriCropDAO.marketListings(1);
            expect(listing.isActive).to.be.true;
            expect(listing.seller).to.equal(farmer1.address);
            expect(listing.priceInWei).to.equal(ethers.parseEther("0.1"));

            const crop = await afriCropDAO.crops(1);
            expect(crop.stage).to.equal(CropStage.SELLING);
            expect(crop.harvestedOutput).to.equal(80); // 100 * (100 - 20) / 100
        });

        it("Should not allow listing a non-harvested crop", async function () {
            await afriCropDAO.connect(farmer2).sowCrop(CropType.RICE, "FarmB2", 50);
            await expect(afriCropDAO.connect(farmer2).listCropForSale(2, ethers.parseEther("0.05"), 40, 10))
                .to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__NotHarvested");
        });

        it("Should allow a buyer to purchase a crop, transfer ETH, and update ownership", async function () {
            await afriCropDAO.connect(farmer1).listCropForSale(1, ethers.parseEther("0.1"), 80, 20); // List price 0.1 ETH, 80 units

            const initialSellerBalance = await ethers.provider.getBalance(farmer1.address);
            const initialTreasuryBalance = await ethers.provider.getBalance(treasury.address);

            const tx = await afriCropDAO.connect(farmer2).purchaseCrop(1, { value: ethers.parseEther("0.1") });
            const receipt = await tx.wait(); // Wait for transaction to be mined

            // Calculate gas cost for farmer2
            const gasUsed = receipt.gasUsed;
            const gasPrice = receipt.gasPrice;
            const gasCost = gasUsed * gasPrice;

            // Verify ETH transfers
            const expectedSellerAmount = ethers.parseEther("0.1").mul(90).div(100); // 90%
            const expectedDaoFee = ethers.parseEther("0.1").mul(10).div(100); // 10%

            const finalSellerBalance = await ethers.provider.getBalance(farmer1.address);
            const finalTreasuryBalance = await ethers.provider.getBalance(treasury.address);
            const finalBuyerBalance = await ethers.provider.getBalance(farmer2.address);

            expect(finalSellerBalance).to.equal(initialSellerBalance.add(expectedSellerAmount));
            expect(finalTreasuryBalance).to.equal(initialTreasuryBalance.add(expectedDaoFee));
            expect(finalBuyerBalance).to.equal(ethers.parseEther("10000").sub(ethers.parseEther("0.1")).sub(gasCost)); // Default Hardhat balance

            // Verify crop ownership and listing status
            const crop = await afriCropDAO.crops(1);
            expect(crop.farmerAddress).to.equal(farmer2.address);
            expect(crop.stage).to.equal(CropStage.SOLD);

            const listing = await afriCropDAO.marketListings(1);
            expect(listing.isActive).to.be.false;

            // Verify harvest points for seller and reputation for buyer
            const sellerProfile = await afriCropDAO.farmers(farmer1.address);
            expect(sellerProfile.harvestPoints).to.equal(8); // 80 units / 10 = 8 harvest points
            const buyerProfile = await afriCropDAO.farmers(farmer2.address);
            expect(buyerProfile.reputationPoints).to.equal(105); // 100 + 5
        });

        it("Should allow a farmer to cancel a crop listing", async function () {
            await afriCropDAO.connect(farmer1).listCropForSale(1, ethers.parseEther("0.1"), 80, 20);

            await expect(afriCropDAO.connect(farmer1).cancelCropListing(1))
                .to.emit(afriCropDAO, "CropListingCancelled")
                .withArgs(1, 1);

            const listing = await afriCropDAO.marketListings(1);
            expect(listing.isActive).to.be.false;

            const crop = await afriCropDAO.crops(1);
            expect(crop.stage).to.equal(CropStage.HARVESTED);
        });

        it("Should not allow non-owner to cancel a listing", async function () {
            await afriCropDAO.connect(farmer1).listCropForSale(1, ethers.parseEther("0.1"), 80, 20);
            await expect(afriCropDAO.connect(farmer2).cancelCropListing(1))
                .to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__NotListingOwner");
        });
    });

    describe("Governance", function () {
        it("Should allow a farmer to create a proposal with ETH stake", async function () {
            const initialTreasuryBalance = await ethers.provider.getBalance(treasury.address);
            const proposalStake = ethers.parseEther("0.01");

            await expect(afriCropDAO.connect(farmer1).createProposal(
                ProposalType.FundAllocation,
                "Fund grant for research",
                addrs[0].address,
                ethers.parseEther("0.5"),
                0, // paramKey
                0, // paramValue
                "QmResearchGrantHash"
                , { value: proposalStake }
            )).to.emit(afriCropDAO, "ProposalCreated")
                .withArgs(1, farmer1.address, ProposalType.FundAllocation, proposalStake);

            const finalTreasuryBalance = await ethers.provider.getBalance(treasury.address);
            expect(finalTreasuryBalance).to.equal(initialTreasuryBalance.add(proposalStake));

            const proposal = await afriCropDAO.proposals(1);
            expect(proposal.proposer).to.equal(farmer1.address);
            expect(proposal.status).to.equal(ProposalStatus.ACTIVE);
        });

        it("Should calculate voting power correctly (quadratic with bonuses)", async function () {
            // Initial reputation for farmer1 is 100, sqrt(100) = 10
            let votingPower = await afriCropDAO.calculateVotingPower(farmer1.address);
            expect(votingPower).to.equal(10); // 10 * (100 + 0 + 0) / 100

            // Increase sustainability score for farmer1
            await afriCropDAO.connect(owner)._updateSustainabilityScore(farmer1.address, 200, true);
            // Increase knowledge points for farmer1
            await afriCropDAO.connect(owner)._updateKnowledgePoints(farmer1.address, 100, true);

            // New reputation: 100 (initial)
            // Sustainability bonus: 200 / 100 = 2
            // Knowledge bonus: 100 / 50 = 2
            // Total bonus: 2 + 2 = 4
            // Voting power: sqrt(100) * (100 + 4) / 100 = 10 * 1.04 = 10.4 (approx 10 in integer math)
            votingPower = await afriCropDAO.calculateVotingPower(farmer1.address);
            expect(votingPower).to.equal(10); // Due to integer math, still 10. (10 * 104 / 100 = 1040/100 = 10)
            
            // Let's test with higher values to see the bonus effect more clearly
            await afriCropDAO.connect(owner)._updateReputation(farmer1.address, 900, true); // Total 1000 reputation
            await afriCropDAO.connect(owner)._updateSustainabilityScore(farmer1.address, 500, true); // Total 700 sustainability
            await afriCropDAO.connect(owner)._updateKnowledgePoints(farmer1.address, 500, true); // Total 600 knowledge
            
            // Rep: 1000, sqrt(1000) approx 31
            // Sustainability bonus: 700 / 100 = 7
            // Knowledge bonus: 600 / 50 = 12
            // Total bonus: 7 + 12 = 19
            // Voting power: 31 * (100 + 19) / 100 = 31 * 1.19 = 36.89 (approx 36 in integer math)
            // Need to make sure the sqrt approximation is accurate enough for small numbers too
            votingPower = await afriCropDAO.calculateVotingPower(farmer1.address);
            expect(votingPower).to.equal(36); // Expected after manual calculation
        });


        it("Should allow a farmer to vote on a proposal", async function () {
            await afriCropDAO.connect(farmer1).createProposal(
                ProposalType.FundAllocation,
                "Test proposal",
                addrs[0].address,
                ethers.parseEther("0.1"),
                0, 0, ""
                , { value: ethers.parseEther("0.01") }
            ); // Proposal ID 1

            const farmer1VotingPower = await afriCropDAO.calculateVotingPower(farmer1.address);
            await expect(afriCropDAO.connect(farmer1).voteOnProposal(1, true))
                .to.emit(afriCropDAO, "VoteCast")
                .withArgs(1, farmer1.address, farmer1VotingPower, true);

            const proposal = await afriCropDAO.proposals(1);
            expect(proposal.yesVotes).to.equal(farmer1VotingPower);
            expect(proposal.hasVoted[farmer1.address]).to.be.true;
        });

        it("Should not allow voting on an expired proposal", async function () {
            await afriCropDAO.connect(farmer1).createProposal(
                ProposalType.FundAllocation,
                "Test proposal",
                addrs[0].address,
                ethers.parseEther("0.1"),
                0, 0, ""
                , { value: ethers.parseEther("0.01") }
            );

            // Mine blocks to advance time beyond voting period
            for (let i = 0; i < 1001; i++) {
                await ethers.provider.send("evm_mine");
            }

            await expect(afriCropDAO.connect(farmer2).voteOnProposal(1, true))
                .to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__VotingPeriodNotActive");
        });

        it("Should allow execution of a passed proposal (FundAllocation)", async function () {
            await afriCropDAO.connect(farmer1).createProposal(
                ProposalType.FundAllocation,
                "Fund grant to addr[0]",
                addrs[0].address,
                ethers.parseEther("0.05"),
                0, 0, ""
                , { value: ethers.parseEther("0.01") }
            );

            // Farmer1 votes yes
            await afriCropDAO.connect(farmer1).voteOnProposal(1, true);

            // Transfer some ETH to the DAO treasury for allocation
            await owner.sendTransaction({ to: treasury.address, value: ethers.parseEther("1") });

            const initialRecipientBalance = await ethers.provider.getBalance(addrs[0].address);
            const initialTreasuryBalance = await ethers.provider.getBalance(treasury.address);

            // Mine blocks to end voting period
            for (let i = 0; i < 1001; i++) {
                await ethers.provider.send("evm_mine");
            }

            await expect(afriCropDAO.executeProposal(1))
                .to.emit(afriCropDAO, "ProposalExecuted")
                .to.emit(afriCropDAO, "FundAllocationExecuted")
                .withArgs(addrs[0].address, ethers.parseEther("0.05"));

            const finalRecipientBalance = await ethers.provider.getBalance(addrs[0].address);
            const finalTreasuryBalance = await ethers.provider.getBalance(treasury.address);

            expect(finalRecipientBalance).to.equal(initialRecipientBalance.add(ethers.parseEther("0.05")));
            expect(finalTreasuryBalance).to.equal(initialTreasuryBalance.sub(ethers.parseEther("0.05")));

            const proposal = await afriCropDAO.proposals(1);
            expect(proposal.status).to.equal(ProposalStatus.PASSED);
            expect(proposal.executed).to.be.true;
        });

        it("Should not allow execution of a failed proposal", async function () {
            await afriCropDAO.connect(farmer1).createProposal(
                ProposalType.FundAllocation,
                "Fund grant to addr[0]",
                addrs[0].address,
                ethers.parseEther("0.05"),
                0, 0, ""
                , { value: ethers.parseEther("0.01") }
            );

            // Farmer1 votes no
            await afriCropDAO.connect(farmer1).voteOnProposal(1, false);

            // Mine blocks to end voting period
            for (let i = 0; i < 1001; i++) {
                await ethers.provider.send("evm_mine");
            }

            await afriCropDAO.executeProposal(1); // Execute to set status
            const proposal = await afriCropDAO.proposals(1);
            expect(proposal.status).to.equal(ProposalStatus.FAILED);
            expect(proposal.executed).to.be.false; // Should not be marked as executed if failed
        });
    });

    describe("Education System", function () {
        it("Should allow owner to add a new lesson", async function () {
            await expect(afriCropDAO.connect(owner).addLesson("QmTestIPFSHash1", 25))
                .to.emit(afriCropDAO, "LessonAdded")
                .withArgs(1, "QmTestIPFSHash1", 25);
            const lesson = await afriCropDAO.lessons(1);
            expect(lesson.ipfsHash).to.equal("QmTestIPFSHash1");
            expect(lesson.knowledgePointsReward).to.equal(25);
        });

        it("Should allow a farmer to complete a lesson and earn knowledge/reputation points", async function () {
            await afriCropDAO.connect(owner).addLesson("QmTestIPFSHash1", 25); // Lesson ID 1

            const initialKnowledge = (await afriCropDAO.farmers(farmer1.address)).knowledgePoints;
            const initialReputation = (await afriCropDAO.farmers(farmer1.address)).reputationPoints;

            await expect(afriCropDAO.connect(farmer1).completeLesson(1))
                .to.emit(afriCropDAO, "LessonCompleted")
                .withArgs(farmer1.address, 1, 25);

            const farmerProfile = await afriCropDAO.farmers(farmer1.address);
            expect(farmerProfile.knowledgePoints).to.equal(initialKnowledge.add(25));
            expect(farmerProfile.reputationPoints).to.equal(initialReputation.add(12)); // 25 / 2 = 12 (integer div)
            expect(await afriCropDAO.completedLessons(farmer1.address, 1)).to.be.true;
        });

        it("Should not allow completing a lesson twice", async function () {
            await afriCropDAO.connect(owner).addLesson("QmTestIPFSHash1", 25);
            await afriCropDAO.connect(farmer1).completeLesson(1);
            await expect(afriCropDAO.connect(farmer1).completeLesson(1))
                .to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__LessonAlreadyCompleted");
        });
    });

    describe("Mentorship Program", function () {
        beforeEach(async function () {
            // Farmer1 gets enough knowledge points to request mentorship
            await afriCropDAO.connect(owner).addLesson("lesson1", 60);
            await afriCropDAO.connect(farmer1).completeLesson(1); // Farmer1 has 60 knowledge points (initial 0 + 60)

            // Farmer2 gets enough reputation to be a mentor
            await afriCropDAO.connect(owner)._updateReputation(farmer2.address, 450, true); // Farmer2 has 100 + 450 = 550 reputation
        });

        it("Should allow a mentee to request mentorship from an experienced farmer", async function () {
            await expect(afriCropDAO.connect(farmer1).requestMentorship(farmer2.address))
                .to.emit(afriCropDAO, "MentorshipRequested")
                .withArgs(1, farmer1.address, farmer2.address);

            const session = await afriCropDAO.mentorshipSessions(1);
            expect(session.mentee).to.equal(farmer1.address);
            expect(session.mentor).to.equal(farmer2.address);
            expect(session.accepted).to.be.false;
            expect(session.completed).to.be.false;
        });

        it("Should not allow mentorship request if mentee has insufficient knowledge points", async function () {
            // Re-register farmer1 to reset points
            await afriCropDAO.connect(owner)._updateKnowledgePoints(farmer1.address, (await afriCropDAO.farmers(farmer1.address)).knowledgePoints, false); // Subtract all
            await expect(afriCropDAO.connect(farmer1).requestMentorship(farmer2.address))
                .to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__InsufficientReputationForMentorship");
        });

        it("Should not allow mentorship request if mentor has insufficient reputation", async function () {
            // Re-register farmer2 to reset reputation
            await afriCropDAO.connect(owner)._updateReputation(farmer2.address, (await afriCropDAO.farmers(farmer2.address)).reputationPoints.sub(100), false); // Reset to 100
            await expect(afriCropDAO.connect(farmer1).requestMentorship(farmer2.address))
                .to.be.revertedWithCustomError(afriCropDAO, "AfriCropDAO__InsufficientReputationForMentorship");
        });

        it("Should allow mentor to accept mentorship request", async function () {
            await afriCropDAO.connect(farmer1).requestMentorship(farmer2.address);
            await expect(afriCropDAO.connect(farmer2).acceptMentorship(1))
                .to.emit(afriCropDAO, "MentorshipAccepted")
                .withArgs(1);

            const session = await afriCropDAO.mentorshipSessions(1);
            expect(session.accepted).to.be.true;
            expect(session.startTimestamp).to.not.equal(0);
        });

        it("Should allow mentor or mentee to complete mentorship and award points", async function () {
            await afriCropDAO.connect(farmer1).requestMentorship(farmer2.address);
            await afriCropDAO.connect(farmer2).acceptMentorship(1);

            const initialMentorReputation = (await afriCropDAO.farmers(farmer2.address)).reputationPoints;
            const initialMenteeReputation = (await afriCropDAO.farmers(farmer1.address)).reputationPoints;
            const initialMenteeKnowledge = (await afriCropDAO.farmers(farmer1.address)).knowledgePoints;

            await expect(afriCropDAO.connect(farmer1).completeMentorship(1)) // Mentee can also complete
                .to.emit(afriCropDAO, "MentorshipCompleted")
                .withArgs(1, farmer2.address, farmer1.address);

            const session = await afriCropDAO.mentorshipSessions(1);
            expect(session.completed).to.be.true;
            expect(session.endTimestamp).to.not.equal(0);

            const finalMentorReputation = (await afriCropDAO.farmers(farmer2.address)).reputationPoints;
            const finalMenteeReputation = (await afriCropDAO.farmers(farmer1.address)).reputationPoints;
            const finalMenteeKnowledge = (await afriCropDAO.farmers(farmer1.address)).knowledgePoints;

            expect(finalMentorReputation).to.equal(initialMentorReputation.add(50));
            expect(finalMenteeReputation).to.equal(initialMenteeReputation.add(20));
            expect(finalMenteeKnowledge).to.equal(initialMenteeKnowledge.add(30));
        });
    });

    describe("Climate Action", function () {
        it("Should show initial sustainability score as 0", async function () {
            const farmerProfile = await afriCropDAO.farmers(farmer1.address);
            expect(farmerProfile.sustainabilityScore).to.equal(0);
        });

        it("Sustainability score should affect voting power", async function () {
            await afriCropDAO.connect(owner)._updateSustainabilityScore(farmer1.address, 100, true); // +100 score
            await afriCropDAO.connect(owner)._updateKnowledgePoints(farmer1.address, 50, true); // +50 points

            // Initial: rep 100, sust 0, know 0 => VP = 10
            // After update: rep 100, sust 100, know 50
            // sqrt(100) = 10
            // sust bonus = 100 / 100 = 1
            // know bonus = 50 / 50 = 1
            // New VP = 10 * (100 + 1 + 1) / 100 = 10 * 1.02 = 10.2 (floor to 10 in integer math)
            const votingPower = await afriCropDAO.calculateVotingPower(farmer1.address);
            expect(votingPower).to.equal(10); // Still 10 due to integer division, but shows the formula logic
            
            // To clearly demonstrate the effect:
            await afriCropDAO.connect(owner)._updateReputation(farmer1.address, 900, true); // Total 1000 reputation
            await afriCropDAO.connect(owner)._updateSustainabilityScore(farmer1.address, 900, true); // Total 1000 sustainability
            await afriCropDAO.connect(owner)._updateKnowledgePoints(farmer1.address, 450, true); // Total 500 knowledge

            // Rep: 1000, sqrt(1000) approx 31
            // Sustainability bonus: (100+900) / 100 = 10
            // Knowledge bonus: (50+450) / 50 = 10
            // Total bonus: 10 + 10 = 20
            // Voting power: 31 * (100 + 20) / 100 = 31 * 1.2 = 37.2 (approx 37 in integer math)
            const newVotingPower = await afriCropDAO.calculateVotingPower(farmer1.address);
            expect(newVotingPower).to.equal(37);
        });
    });

    describe("DAO Treasury", function () {
        it("Should return the correct DAO treasury balance", async function () {
            const initialBalance = await afriCropDAO.getDaoTreasuryBalance();
            expect(initialBalance).to.equal(0); // Initially empty

            await owner.sendTransaction({ to: treasury.address, value: ethers.parseEther("1") });
            const updatedBalance = await afriCropDAO.getDaoTreasuryBalance();
            expect(updatedBalance).to.equal(ethers.parseEther("1"));
        });

        it("DAO fee should be transferred to the treasury on crop purchase", async function () {
            await afriCropDAO.connect(farmer1).sowCrop(CropType.MAIZE, "FarmC1", 100);
            await afriCropDAO.connect(farmer1).updateCropStage(1, CropStage.GROWING);
            await afriCropDAO.connect(farmer1).updateCropStage(1, CropStage.HARVESTED);
            await afriCropDAO.connect(farmer1).listCropForSale(1, ethers.parseEther("1"), 90, 10); // Price 1 ETH

            const initialTreasuryBalance = await ethers.provider.getBalance(treasury.address);
            const expectedDaoFee = ethers.parseEther("1").mul(10).div(100); // 0.1 ETH

            await afriCropDAO.connect(farmer2).purchaseCrop(1, { value: ethers.parseEther("1") });

            const finalTreasuryBalance = await ethers.provider.getBalance(treasury.address);
            expect(finalTreasuryBalance).to.equal(initialTreasuryBalance.add(expectedDaoFee));
        });
    });
});