const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const CGOVToken = await hre.ethers.getContractFactory("CGOVToken");
  const initialSupply = hre.ethers.parseUnits("1000000", 18);
  const token = await CGOVToken.deploy(initialSupply);
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("CGOVToken deployed to:", tokenAddress);

  // bump nonce once so CampusGov gets a different address
  const bumpTx = await deployer.sendTransaction({
    to: deployer.address,
    value: 0n,
  });
  await bumpTx.wait();

  const CampusGov = await hre.ethers.getContractFactory("CampusGov");
  const gov = await CampusGov.deploy(tokenAddress);
  await gov.waitForDeployment();

  const govAddress = await gov.getAddress();
  console.log("CampusGov deployed to:", govAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});