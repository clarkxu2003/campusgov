const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  const CampusGov = await hre.ethers.getContractFactory("CampusGov");
  const campusGov = await CampusGov.deploy();
  await campusGov.waitForDeployment();

  console.log("CampusGov deployed to:", await campusGov.getAddress());

  const CGOVToken = await hre.ethers.getContractFactory("CGOVToken");
  const initialSupply = hre.ethers.parseUnits("1000000", 18);

  const cgovToken = await CGOVToken.deploy(initialSupply);
  await cgovToken.waitForDeployment();

  console.log("CGOVToken deployed to:", await cgovToken.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});