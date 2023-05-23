import hre from "hardhat";

const main = async () => {

  const EntryPoint = await hre.ethers.getContractFactory("EntryPoint");
  const entryPoint = await EntryPoint.deploy();

  await entryPoint.deployed();

  console.log(
    "EntryPoint deployed to:", entryPoint.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
