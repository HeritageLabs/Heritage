const hre = require("hardhat");

async function main() {
  const Heritage = await hre.ethers.getContractFactory("Heritage");
  const heritage = await Heritage.deploy();

  await heritage.deployed();

  console.log(
    `Heritage deployed to ${heritage.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
