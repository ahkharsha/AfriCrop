const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying AfriCropDAO with account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Available account balance:", balance.toString());

  const AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");

  const dao = await AfriCropDAO.deploy();

  await dao.waitForDeployment();

  console.log("AfriCropDAO deployed to:", await dao.getAddress());
  console.log("Owner set to:", await dao.owner());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
