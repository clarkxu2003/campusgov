const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const CGOVToken = await hre.ethers.getContractFactory("CGOVToken");
  const cgovToken = await CGOVToken.deploy();
  await cgovToken.waitForDeployment();

  const tokenAddress = await cgovToken.getAddress();
  console.log("CGOVToken deployed to:", tokenAddress);

  const CampusGov = await hre.ethers.getContractFactory("CampusGov");
  const campusGov = await CampusGov.deploy(tokenAddress);
  await campusGov.waitForDeployment();

  console.log("CampusGov deployed to:", await campusGov.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});