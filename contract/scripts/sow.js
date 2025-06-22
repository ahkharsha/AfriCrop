const { ethers } = require("hardhat");
const { formatEther } = require("ethers");

async function main() {
  const CONTRACT_ADDRESS = "0x94037Dff7be2e2Aa8d1B5f62C76CF6581e0D8FC0";
  const cropId = 1; // Change this
  const HARVESTED_STAGE = 2;

  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  const balance = await signer.provider.getBalance(signer.address);
  console.log("Available balance:", formatEther(balance), "ETH");

  const AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");
  const dao = AfriCropDAO.attach(CONTRACT_ADDRESS).connect(signer);

  const farmer = await dao.farmers(signer.address);
  if (!farmer.isRegistered) {
    console.log("Registering farmer...");
    const regTx = await dao.registerFarmer();
    await regTx.wait();
    console.log("Farmer registered.");
  }

  console.log(`Sending tx to update crop ${cropId} to HARVESTED...`);
  const tx = await dao.updateCropStage(cropId, HARVESTED_STAGE);
  await tx.wait();

  console.log(`Crop ${cropId} successfully marked as HARVESTED!`);
  console.log("Tx hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
